'use strict';

(function () {
  var DisabledClass = {
    MAP: 'map--faded',
    AD_FORM: 'ad-form--disabled'
  };
  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var main = document.querySelector('main');

  var KeyCode = {
    ESC: 27
  };


  function activate() {
    map.classList.remove(DisabledClass.MAP);
    adForm.classList.remove(DisabledClass.AD_FORM);
    window.adForm.toggleFieldsets(window.adForm.fieldsetStatus.ACTIVATE);
    window.adForm.addFieldsListeners();
    window.xhr.create(window.pins.requestData);
  }

  function deactivate() {
    // Для себя: сделать фукцию ресет для каждого блока, уточнить насчет сброса offer
    map.classList.add(DisabledClass.MAP);
    adForm.classList.add(DisabledClass.AD_FORM);
    window.adForm.toggleFieldsets(window.adForm.fieldsetStatus.DEACTIVATE);
    window.filterForm.toggleFilters(window.filterForm.filterStatus.DEACTIVATE);
    window.pins.remove();
    window.pins.cache.length = 0;
    window.cards.removeActive();
    window.mainPin.isDragged = false;
    window.mainPin.resetPosition();
    window.adForm.setAddressFieldValue(window.mainPin.setting.START);
  }

  function renderSuccessPopup() {
    var successTemplate = document.querySelector('#success').content;
    var success = successTemplate.cloneNode(true);
    main.appendChild(success);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyup);
    adForm.reset();
    deactivate();
  }

  function renderErrorPopup(errorText) {
    var template = document.querySelector('#error').content;
    var popup = template.cloneNode(true);
    var message = popup.querySelector('.error__message');
    message.textContent = errorText;
    var closeButton = popup.querySelector('.error__button');
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      removeActivePopup();
    });
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyup);
    main.appendChild(popup);
  }

  function removeActivePopup() {
    var success = main.querySelector('div.success');
    var error = main.querySelector('div.error');
    var active = false;

    if (success) {
      active = success;
    } else if (error) {
      active = error;
    }

    if (active) {
      active.remove();
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keyup', onDocumentKeyup);
    }
  }

  function onDocumentClick(evt) {
    evt.preventDefault();
    removeActivePopup();
  }

  function onDocumentKeyup(evt) {
    evt.preventDefault();
    if (evt.keyCode === KeyCode.ESC) {
      removeActivePopup();
    }
  }

  window.page = {
    KeyCode: KeyCode,
    activate: activate,
    deactivate: deactivate,
    renderSuccess: renderSuccessPopup,
    renderError: renderErrorPopup
  };
})();
