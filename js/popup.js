'use strict';
(function () {
  var DISABLED_CLASS = 'popup--disabled';
  var main = document.querySelector('main');
  var success;
  var error;

  function onDocumentClick(evt) {
    evt.preventDefault();
    hideActive();
  }

  function onDocumentKeyup(evt) {
    evt.preventDefault();
    if (window.utils.isEscKeycode(evt)) {
      hideActive();
    }
  }

  function renderSuccess() {
    var template = document.querySelector('#success').content;
    var popup = template.cloneNode(true);
    main.appendChild(popup);
    success = main.querySelector('div.success');
    success.classList.add(DISABLED_CLASS);
  }

  function renderError() {
    var template = document.querySelector('#error').content;
    var popup = template.cloneNode(true);
    var closeButton = popup.querySelector('.error__button');
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      hideActive();
    });
    main.appendChild(popup);
    error = main.querySelector('div.error');
    error.classList.add(DISABLED_CLASS);
  }

  function showSuccess() {
    success.classList.remove(DISABLED_CLASS);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyup);
  }

  function showError(errorText) {
    error.classList.remove(DISABLED_CLASS);
    var message = error.querySelector('.error__message');
    message.textContent = errorText;
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keyup', onDocumentKeyup);
  }

  function hideActive() {
    var isSuccess = !success.classList.contains(DISABLED_CLASS);
    var isError = !error.classList.contains(DISABLED_CLASS);
    var active = false;

    if (isSuccess) {
      active = success;
    } else if (isError) {
      active = error;
    }

    active.classList.add(DISABLED_CLASS);
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keyup', onDocumentKeyup);
  }

  renderSuccess();
  renderError();

  window.popup = {
    showSuccess: showSuccess,
    showError: showError
  };
})();
