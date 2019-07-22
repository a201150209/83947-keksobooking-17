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
    window.adForm.toggleFieldsets(window.adForm.fieldsetStatus.ACTIVE);
    window.adForm.addFieldsEventListeners();
    window.xhr.create(window.xhr.pinsConfig);
  }

  function deactivate() {
    map.classList.add(DisabledClass.MAP);
    adForm.classList.add(DisabledClass.AD_FORM);
    window.adForm.toggleFieldsets(window.adForm.fieldsetStatus.INACTIVE);
    window.adForm.removeFieldsEventListeners();
    window.filterForm.toggleFilters(window.filterForm.filterStatus.INACTIVE);
    window.pins.remove();
    window.cards.removeActive();
    window.mainPin.resetPosition();
  }


  window.page = {
    adForm: adForm,
    map: map,
    activate: activate,
    deactivate: deactivate,
  };
})();
