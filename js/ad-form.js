'use strict';

(function () {
  var MaxIndexImages = {
    AVATAR: 0,
    PHOTOS: 2
  };
  var FieldsetStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  };
  var formFieldsets = window.page.adForm.querySelectorAll('fieldset');
  var addressField = window.page.adForm.querySelector('#address');
  var priceField = window.page.adForm.querySelector('#price');
  var roomNumberField = window.page.adForm.querySelector('#room_number');
  var capacityField = window.page.adForm.querySelector('#capacity');
  var typeField = window.page.adForm.querySelector('#type');
  var timeInField = window.page.adForm.querySelector('#timein');
  var timeOutField = window.page.adForm.querySelector('#timeout');
  var avatarUploadField = window.page.adForm.querySelector('#avatar');
  var avatarPreviewWrapper = window.page.adForm.querySelector('.ad-form-header__preview');
  var photosUploadField = window.page.adForm.querySelector('#images');
  var photosPreviewWrapper = window.page.adForm.querySelector('.ad-form__photo');
  var resetButton = window.page.adForm.querySelector('.ad-form__reset');
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

  function onAvatarUploadFieldChange(evt) {
    window.uploadingImages.upload(evt.target, avatarPreviewWrapper, MaxIndexImages.AVATAR);
  }

  function onPhotosUploadFieldChange(evt) {
    window.uploadingImages.upload(evt.target, photosPreviewWrapper, MaxIndexImages.PHOTOS);
  }

  function onFormSubmit(evt) {
    evt.preventDefault();
    if (window.page.adForm.checkValidity()) {
      enableDisabledFields();
      window.xhr.adFormConfig.data = new FormData(document.forms.adForm);
      window.xhr.create(window.xhr.adFormConfig);
      window.page.adForm.reset();
      window.page.deactivate();
    }
  }

  function onClickResetButton() {
    enableDisabledFields();
    window.page.adForm.reset();
    window.page.deactivate();
  }

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

  function checkCustomValidation() {
    if (!matchRoomsAndCapacities()) {
      roomNumberField.setCustomValidity('В текущее количество комнат может заехать гостей: ' + roomsToCapacities[roomNumberField.value]);
    } else {
      roomNumberField.setCustomValidity('');
    }
  }

  function setAddressFieldValue(pinType) {
    var pinCoordinates = window.mainPin.getCoordinates(pinType);
    addressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  function toggleFieldsetsDisability(status) {
    switch (status) {
      case FieldsetStatus.ACTIVE:
        window.utils.toggleElementsDisability(formFieldsets, false);
        break;
      case FieldsetStatus.INACTIVE:
        window.utils.toggleElementsDisability(formFieldsets, true);
        break;
    }
  }

  function enableDisabledFields() {
    var fields = window.page.adForm.querySelectorAll('input:disabled');
    window.utils.toggleElementsDisability(fields, false);
  }

  function addFormFieldsEventListeners() {
    typeField.addEventListener('change', onTypeFieldChange);
    roomNumberField.addEventListener('change', onRoomNumberFieldChange);
    capacityField.addEventListener('change', onCapacityFieldChange);
    timeInField.addEventListener('change', onTimeInFieldChange);
    timeOutField.addEventListener('change', onTimeOutFieldChange);
    avatarUploadField.addEventListener('change', onAvatarUploadFieldChange);
    photosUploadField.addEventListener('change', onPhotosUploadFieldChange);
    resetButton.addEventListener('click', onClickResetButton);
    window.page.adForm.addEventListener('submit', onFormSubmit);
  }

  function removeFormFieldsEventListeners() {
    typeField.removeEventListener('change', onTypeFieldChange);
    roomNumberField.removeEventListener('change', onRoomNumberFieldChange);
    capacityField.removeEventListener('change', onCapacityFieldChange);
    timeInField.removeEventListener('change', onTimeInFieldChange);
    timeOutField.removeEventListener('change', onTimeOutFieldChange);
    avatarUploadField.removeEventListener('change', onAvatarUploadFieldChange);
    photosUploadField.removeEventListener('change', onPhotosUploadFieldChange);
    resetButton.removeEventListener('click', onClickResetButton);
    window.page.adForm.removeEventListener('submit', onFormSubmit);
  }

  checkCustomValidation();
  setMinPrice(typeField.value);
  setAddressFieldValue('round');
  toggleFieldsetsDisability(FieldsetStatus.INACTIVE);

  window.adForm = {
    status: FieldsetStatus,
    toggleFieldsetsDisability: toggleFieldsetsDisability,
    setAddressFieldValue: setAddressFieldValue,
    addFieldsEventListeners: addFormFieldsEventListeners,
    removeFieldsEventListeners: removeFormFieldsEventListeners
  };
})();
