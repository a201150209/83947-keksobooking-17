'use strict';

(function () {
  var DisabledClass = {
    MAP: 'map--faded',
    AD_FORM: 'ad-form--disabled',
    SUCCESS: 'success--disabled',
    ERROR: 'error--disabled',
    POPUP: 'popup--disabled'
  };
  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var main = document.querySelector('main');
  var successPopup;
  var errorPopup;

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
    map.classList.add(DisabledClass.MAP);
    adForm.classList.add(DisabledClass.AD_FORM);
    window.adForm.toggleFieldsets(window.adForm.fieldsetStatus.DEACTIVATE);
    window.filterForm.toggleFilters(window.filterForm.filterStatus.DEACTIVATE);
    window.pins.remove();
    window.cards.removeActive();
    window.mainPin.resetPosition();
  }

  function renderSuccessPopup() {
    var template = document.querySelector('#success').content;
    var popup = template.cloneNode(true);
    main.appendChild(popup);
    successPopup = main.querySelector('div.success');
    successPopup.classList.add(DisabledClass.POPUP);
  }

  function showSuccessPopup() {
    successPopup.classList.remove(DisabledClass.POPUP);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyup);
    adForm.reset();
    deactivate();
  }

  function renderErrorPopup() {
    var template = document.querySelector('#error').content;
    var popup = template.cloneNode(true);
    var closeButton = popup.querySelector('.error__button');
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      hideActivePopup();
    });
    main.appendChild(popup);
    errorPopup = main.querySelector('div.error');
    errorPopup.classList.add(DisabledClass.POPUP);
  }

  function showErrorPopup(errorText) {
    errorPopup.classList.remove(DisabledClass.POPUP);
    var message = errorPopup.querySelector('.error__message');
    message.textContent = errorText;
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyup);
  }

  function hideActivePopup() {
    var isSuccess = !successPopup.classList.contains(DisabledClass.POPUP);
    var isError = !errorPopup.classList.contains(DisabledClass.POPUP);
    var active = false;

    if (isSuccess) {
      active = successPopup;
    } else if (isError) {
      active = errorPopup;
    }

    if (active) {
      active.classList.add(DisabledClass.POPUP);
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keyup', onDocumentKeyup);
    }
  }

  function onDocumentClick(evt) {
    evt.preventDefault();
    hideActivePopup();
  }

  function onDocumentKeyup(evt) {
    evt.preventDefault();
    if (evt.keyCode === KeyCode.ESC) {
      hideActivePopup();
    }
  }

  renderSuccessPopup();
  renderErrorPopup();

  window.page = {
    KeyCode: KeyCode,
    activate: activate,
    deactivate: deactivate,
    showSuccess: showSuccessPopup,
    showError: showErrorPopup
  };
})();
