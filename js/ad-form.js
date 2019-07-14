'use strict';

(function () {
  var ErrorClass = {
    FIELD: 'ad-form__error',
    MESSAGE: 'ad-form__error-message'
  };
  var adForm = document.querySelector('.ad-form');
  var adFormFields = getAdFormFields();
  var titleField = adForm.querySelector('#title');
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

  function onAdFormSubmit(evt) {
    evt.preventDefault();
    /* var errors = [];
    for (var i = 0; i < adFormFields.length; i++) {
      var validity = checkValidity(adFormFields[i]);
      if (!validity) {
        errors.push(i);
      }
    }

    if (errors.length === 0) {
      xhrRequestData.data = new FormData(document.forms.adForm);
      window.request.create(xhrRequestData);
    }*/
  }

  function onAdFormReset() {
    window.page.deactivate();
  }

  function setAddressFieldValue(pinType) {
    var pinCoordinates = window.mainPin.getCoordinates(pinType);
    addressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
  }

  function getAdFormFields() {
    var inputs = Array.from(adForm.querySelectorAll('input'));
    var selects = Array.from(adForm.querySelectorAll('select'));
    var textareas = Array.from(adForm.querySelectorAll('textarea'));
    return inputs.concat(selects, textareas);
  }

  function addBlurHandlerOnAdFormFields(field) {
    field.addEventListener('blur', onFieldBlur);
  }

  function onFieldBlur(evt) {
    checkValidity(evt.target);
  }

  function onFieldInput(evt) {
    checkValidity(evt.target);
  }

  function createErrorMessage(field, text) {
    var errorMessage = document.createElement('p');
    errorMessage.classList.add(ErrorClass.MESSAGE);
    errorMessage.textContent = text;
    field.insertAdjacentElement('afterend', errorMessage);
  }

  function setErrorMessage(message, text) {
    message.textContent = text;
  }

  function matchRoomsAndCapacities() {
    var capacities = roomsToCapacities[roomNumberField.value];
    function matchValue(value) {
      return value === capacityField.value;
    }
    return capacities.some(matchValue);
  }

  function checkValidity(field) {
    var validity = false;
    var isTitleField = field === titleField;
    var isPriceField = field === priceField;
    var isQuestsRelatedFields = field === roomNumberField || field === capacityField;
    var errorMessage = field.nextElementSibling;
    var isErrorMessage = errorMessage && errorMessage.classList.contains(ErrorClass.MESSAGE);
    var errorText = '';

    if (isTitleField) {
      if (field.value.length === 0) {
        errorText = 'Это поле не может быть пустым';
      } else if (field.value.length < field.minLength) {
        errorText = 'Необходимо ввести символов минимум: ' + field.minLength + '. Сейчас введено символов: ' + field.value.length
          + '.';
      } else if (field.value.length > field.maxLength) {
        errorText = 'Можно ввести символов максимум: ' + field.maxLength + '. Сейчас введено символов: ' + field.value.length
          + '.';
      } else {
        validity = true;
      }
    } else if (isPriceField) {
      if (field.value.length === 0) {
        errorText = 'Это поле не может быть пустым';
      } else if (field.value < field.min) {
        errorText = 'Значение слишком мало. Минимально допустимое значение: ' + field.min;
      } else if (field.value > field.max) {
        errorText = 'Значение слишком велико. Максимально допустимое значение: ' + field.max;
      } else {
        validity = true;
      }
    } else if (isQuestsRelatedFields) {
      validity = matchRoomsAndCapacities();
      // Переназначаю поле, чтобы ошибка всегда показывалась у поля с комнатами
      field = roomNumberField;
      if (!validity) {
        errorText = 'В текущее количество комнат может заселиться гостей: ' + roomsToCapacities[roomNumberField.value];
      }
    } else {
      validity = true;
    }


    if (!validity && !isErrorMessage) {
      createErrorMessage(field, errorText);
      field.classList.add(ErrorClass.FIELD);
      field.addEventListener('input', onFieldInput);
    } else if (!validity && isErrorMessage) {
      setErrorMessage(errorMessage, errorText);
      field.classList.add(ErrorClass.FIELD);
      field.addEventListener('input', onFieldInput);
    } else if (validity && isErrorMessage) {
      field.removeEventListener('input', onFieldInput);
      field.classList.remove(ErrorClass.FIELD);
      errorMessage.remove();
    }
  }

  // Может быть нужно добавлять обработчики после активации страницы

  for (var i = 0; i < adFormFields.length; i++) {
    addBlurHandlerOnAdFormFields(adFormFields[i]);
  }


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
