'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var main = document.querySelector('main');

  var KeyCode = {
    ESC: 27
  };

  function toggleStatusOfFormsFieldsets(status) {
    var adFormFieldsets = adForm.querySelectorAll('fieldset');
    var mapFilters = map.querySelector('.map__filters');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = status;
    }
    mapFilters.disabled = status;
  }

  function activate() {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    toggleStatusOfFormsFieldsets(false);
    window.xhr.create(window.pins.requestData);
  }

  function deactivate() {
    // Для себя: сделать фукцию ресет для каждого блока, уточнить насчет сброса offer
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    toggleStatusOfFormsFieldsets(true);
    window.pins.remove();
    window.cards.removeActive();
    window.mainPin.isDragged = false;
    window.mainPin.resetPosition();
    window.adForm.setAddressFieldValue('round');
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

  function renderErrorPopup(data) {
    var template = document.querySelector('#error').content;
    var popup = template.cloneNode(true);
    var message = popup.querySelector('.error__message');
    message.textContent = data;
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

  toggleStatusOfFormsFieldsets(true);

  window.page = {
    KeyCode: KeyCode,
    activate: activate,
    deactivate: deactivate,
    renderSuccess: renderSuccessPopup,
    renderError: renderErrorPopup
  };
})();
