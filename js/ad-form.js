'use strict';

(function () {
  var FieldsetStatus = {
    ACTIVATE: 'activate',
    DEACTIVATE: 'deactivate'
  };
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var addressField = adForm.querySelector('#address');
  var priceField = adForm.querySelector('#price');
  var roomNumberField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var offerTypeToMinPrice = {
    'palace': 10000,
    'house': 5000,
    'flat': 1000,
    'bungalo': 0
  };
  var roomsToCapacities = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };
  var xhrData = {
    type: 'POST',
    url: 'https://js.dump.academy/keksobooking',
    data: {},
    responseType: 'json',
    onSuccess: window.page.renderSuccess,
    onError: window.page.renderError
  };

  function matchRoomsAndCapacities() {
    var capacities = roomsToCapacities[roomNumberField.value];

    function matchValue(value) {
      return value === capacityField.value;
    }

    return capacities.some(matchValue);
  }

  function setMinPrice(offerType) {
    priceField.min = offerTypeToMinPrice[offerType];
    priceField.placeholder = offerTypeToMinPrice[offerType];
  }

  function onTypeFieldChange(evt) {
    evt.preventDefault();
    setMinPrice(evt.target.value);
  }

  function onRoomNumberFieldChange(evt) {
    evt.preventDefault();
    checkCustomValidation();
  }

  function onCapacityFieldChange(evt) {
    evt.preventDefault();
    checkCustomValidation();
  }

  function onTimeInFieldChange(evt) {
    evt.preventDefault();
    timeOutField.value = evt.target.value;
  }

  function onTimeOutFieldChange(evt) {
    evt.preventDefault();
    timeInField.value = evt.target.value;
  }

  function checkCustomValidation() {
    if (!matchRoomsAndCapacities()) {
      roomNumberField.setCustomValidity('В текущее количество комнат может заехать гостей: ' + roomsToCapacities[roomNumberField.value]);
    } else {
      roomNumberField.setCustomValidity('');
    }
  }

  function onAdFormSubmit(evt) {
    evt.preventDefault();
    if (adForm.checkValidity()) {
      xhrData.data = new FormData(document.forms.adForm);
      window.xhr.create(xhrData);
    }
  }

  function onAdFormReset() {
    window.page.deactivate();
  }

  function setAddressFieldValue(pinType) {
    var pinCoordinates = window.mainPin.getCoordinates(pinType);
    addressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  function toggleFieldsets(status) {
    switch (status) {
      case FieldsetStatus.ACTIVATE:
        window.utils.toggleStatusOfElements(adFormFieldsets, false);
        break;
      case FieldsetStatus.DEACTIVATE:
        window.utils.toggleStatusOfElements(adFormFieldsets, true);
        break;
    }
  }

  function addAdFormFieldsListeners() {
    typeField.addEventListener('change', onTypeFieldChange);
    roomNumberField.addEventListener('change', onRoomNumberFieldChange);
    capacityField.addEventListener('change', onCapacityFieldChange);
    timeInField.addEventListener('change', onTimeInFieldChange);
    timeOutField.addEventListener('change', onTimeOutFieldChange);
    adForm.addEventListener('submit', onAdFormSubmit);
    adForm.addEventListener('reset', onAdFormReset);
  }


  checkCustomValidation();
  setMinPrice(typeField.value);
  setAddressFieldValue('round');
  toggleFieldsets(FieldsetStatus.DEACTIVATE);

  window.adForm = {
    fieldsetStatus: FieldsetStatus,
    toggleFieldsets: toggleFieldsets,
    setAddressFieldValue: setAddressFieldValue,
    addFieldsListeners: addAdFormFieldsListeners
  };
})();
