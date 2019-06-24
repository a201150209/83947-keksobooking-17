'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');

  function toggleStatusOfFormsElements(status) {
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = status;
    }
    mapFilters.disabled = status;
  }

  window.page = {
    activate: function () {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      toggleStatusOfFormsElements(false);
      window.pins.render();
    },
    deactivate: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      toggleStatusOfFormsElements(true);
      window.pins.delete();
      window.mainPin.isDragged = false;
      window.mainPin.resetPosition();
      window.adForm.setAddressFieldValue('round');
    }
  };

  toggleStatusOfFormsElements(true);
})();
