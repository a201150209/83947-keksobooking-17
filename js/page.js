'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');


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
    window.pins.render();
  }

  function deactivate() {
    // Для себя: сделать фукцию ресет для каждого блока, уточнить насчет сброса offer
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    toggleStatusOfFormsFieldsets(true);
    window.pins.delete();
    window.mainPin.isDragged = false;
    window.mainPin.resetPosition();
    window.adForm.setAddressFieldValue('round');
  }

  toggleStatusOfFormsFieldsets(true);

  window.page = {
    activate: activate,
    deactivate: deactivate
  };
})();
