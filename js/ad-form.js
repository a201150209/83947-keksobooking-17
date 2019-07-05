'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var priceField = adForm.querySelector('#price');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var offerTypeToMinPrice = {
    palace: 10000,
    house: 5000,
    flat: 1000,
    bungalo: 0
  };

  function setMinPrice(offerType) {
    priceField.min = offerTypeToMinPrice[offerType];
    priceField.placeholder = offerTypeToMinPrice[offerType];
  }

  function onTypeFieldChange(evt) {
    setMinPrice(evt.target.value);
  }

  function onTimeInFieldChange(evt) {
    timeOutField.value = evt.target.value;
  }

  function onTimeOutFieldChange(evt) {
    timeInField.value = evt.target.value;
  }

  function onResetButtonClick() {
    window.page.deactivate();
  }

  function setAddressFieldValue(pinType) {
    var pinCoordinates = window.mainPin.getCoordinates(pinType);
    addressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  setMinPrice(typeField.value);
  setAddressFieldValue('round');
  typeField.addEventListener('change', onTypeFieldChange);
  timeInField.addEventListener('change', onTimeInFieldChange);
  timeOutField.addEventListener('change', onTimeOutFieldChange);
  resetButton.addEventListener('click', onResetButtonClick);

  window.adForm = {
    setAddressFieldValue: setAddressFieldValue
  };
})();
