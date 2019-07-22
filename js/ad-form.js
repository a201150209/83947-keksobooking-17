'use strict';

(function () {
  var FieldsetStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  };
  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var addressField = form.querySelector('#address');
  var priceField = form.querySelector('#price');
  var roomNumberField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');
  var typeField = form.querySelector('#type');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var resetButton = form.querySelector('.ad-form__reset');
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
    onSuccess: window.page.showSuccess,
    onError: window.page.showError
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

  function onFormSubmit(evt) {
    evt.preventDefault();
    if (form.checkValidity()) {
      xhrData.data = new FormData(document.forms.adForm);
      window.xhr.create(xhrData);
    }
  }

  function onClickResetButton() {
    form.reset();
    window.page.deactivate();
  }

  function setAddressFieldValue(pinType) {
    var pinCoordinates = window.mainPin.getCoordinates(pinType);
    addressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  function toggleFieldsets(status) {
    switch (status) {
      case FieldsetStatus.ACTIVE:
        window.utils.toggleStatusOfElements(formFieldsets, false);
        break;
      case FieldsetStatus.INACTIVE:
        window.utils.toggleStatusOfElements(formFieldsets, true);
        break;
    }
  }

  function addFormFieldsListeners() {
    typeField.addEventListener('change', onTypeFieldChange);
    roomNumberField.addEventListener('change', onRoomNumberFieldChange);
    capacityField.addEventListener('change', onCapacityFieldChange);
    timeInField.addEventListener('change', onTimeInFieldChange);
    timeOutField.addEventListener('change', onTimeOutFieldChange);
    form.addEventListener('submit', onFormSubmit);
    resetButton.addEventListener('click', onClickResetButton);
  }


  checkCustomValidation();
  setMinPrice(typeField.value);
  setAddressFieldValue('round');
  toggleFieldsets(FieldsetStatus.INACTIVE);

  window.adForm = {
    fieldsetStatus: FieldsetStatus,
    toggleFieldsets: toggleFieldsets,
    setAddressFieldValue: setAddressFieldValue,
    addFieldsListeners: addFormFieldsListeners
  };
})();
