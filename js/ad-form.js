'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var priceField = adForm.querySelector('#price');
  var roomNumberField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var offerTypeToMinPrice = {
    palace: 10000,
    house: 5000,
    flat: 1000,
    bungalo: 0
  };
  var roomsToCapacities = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };
  var xhrRequestData = {
    type: 'POST',
    url: 'https://js.dump.academy/keksobooking',
    data: {},
    responseType: 'json',
    onSuccess: window.page.renderSuccess,
    onError: window.page.renderError
  };

  function setMinPrice(offerType) {
    priceField.min = offerTypeToMinPrice[offerType];
    priceField.placeholder = offerTypeToMinPrice[offerType];
  }

  function onTypeFieldChange(evt) {
    evt.preventDefault();
    setMinPrice(evt.target.value);
  }

  function onTimeInFieldChange(evt) {
    evt.preventDefault();
    timeOutField.value = evt.target.value;
  }

  function onTimeOutFieldChange(evt) {
    evt.preventDefault();
    timeInField.value = evt.target.value;
  }

  /* function getAdFormFields() {
    var inputs = Array.from(adForm.querySelectorAll('input'));
    var selects = Array.from(adForm.querySelectorAll('select'));
    return inputs.concat(selects);
  }

  var adFormFields = getAdFormFields();*/

  function onAdFormSubmit(evt) {
    evt.preventDefault();
    var questsRelatedFieldValidity = matchRoomsAndCapacities();
    roomNumberField.setCustomValidity('');
    console.log(questsRelatedFieldValidity);
    if (!questsRelatedFieldValidity) {
      roomNumberField.setCustomValidity('Какая-то херня');
    } else {

      xhrRequestData.data = new FormData(document.forms.adForm);
      window.request.create(xhrRequestData);
    }
  }

  function onAdFormReset() {
    window.page.deactivate();
  }

  function setAddressFieldValue(pinType) {
    var pinCoordinates = window.mainPin.getCoordinates(pinType);
    addressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  function matchRoomsAndCapacities() {
    var capacities = roomsToCapacities[roomNumberField.value];
    function matchValue(value) {
      return value === capacityField.value;
    }
    return capacities.some(matchValue);
  }

  // Может быть нужно добавлять обработчики после активации страницы


  setMinPrice(typeField.value);
  setAddressFieldValue('round');
  typeField.addEventListener('change', onTypeFieldChange);
  timeInField.addEventListener('change', onTimeInFieldChange);
  timeOutField.addEventListener('change', onTimeOutFieldChange);
  adForm.addEventListener('submit', onAdFormSubmit);
  adForm.addEventListener('reset', onAdFormReset);

  window.adForm = {
    setAddressFieldValue: setAddressFieldValue,
  };
})();
