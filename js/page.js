'use strict';

(function () {
  var DisabledClass = {
    MAP: 'map--faded',
    AD_FORM: 'ad-form--disabled',
  };

  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');

  function activate() {
    map.classList.remove(DisabledClass.MAP);
    adForm.classList.remove(DisabledClass.AD_FORM);
    window.adForm.toggleFieldsetsDisability(window.adForm.status.ACTIVE);
    window.adForm.addFieldsEventListeners();
    window.adForm.checkCustomValidation();
    window.xhr.create(window.xhr.pinsConfig);
  }

  function deactivate() {
    map.classList.add(DisabledClass.MAP);
    adForm.classList.add(DisabledClass.AD_FORM);
    window.adForm.toggleFieldsetsDisability(window.adForm.status.INACTIVE);
    window.adForm.removeFieldsEventListeners();
    window.filterForm.toggleDisability(window.filterForm.status.INACTIVE);
    window.pins.remove();
    window.cards.removeActive();
    window.mainPin.resetPosition();
    window.uploadingImages.index = {};
    window.uploadingImages.removePreview();
  }

  window.page = {
    adForm: adForm,
    map: map,
    activate: activate,
    deactivate: deactivate,
  };
})();
