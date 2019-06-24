'use strict';

(function () {
  var adFormElement = document.querySelector('.ad-form');
  var adFormAddressField = adFormElement.querySelector('#address');
  var adFormPriceField = adFormElement.querySelector('#price');
  var adFormTypeField = adFormElement.querySelector('#type');
  var adFormTimeInField = adFormElement.querySelector('#timein');
  var adFormTimeOutField = adFormElement.querySelector('#timeout');
  var adFormResetButton = adFormElement.querySelector('.ad-form__reset');
  var addFormOffer = {
    palace: {
      minPrice: 10000
    },
    house: {
      minPrice: 5000
    },
    flat: {
      minPrice: 1000
    },
    bungalo: {
      minPrice: 0
    }
  };

  function setMinPrice(offerType) {
    adFormPriceField.min = addFormOffer[offerType].minPrice;
    adFormPriceField.placeholder = addFormOffer[offerType].minPrice;
  }

  function onAdFormTypeFieldChange(evt) {
    setMinPrice(evt.target.value);
  }

  function onAdFormTimeInFieldChange(evt) {
    adFormTimeOutField.value = evt.target.value;
  }

  function onAdFormTimeOutFieldChange(evt) {
    adFormTimeInField.value = evt.target.value;
  }

  function onAdFormResetButtonClick() {
    window.page.deactivate();
  }

  window.adForm = {
    setAddressFieldValue: function (pinType) {
      var pinCoordinates = window.mainPin.getCoordinates(pinType);
      adFormAddressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    }
  };

  setMinPrice(adFormTypeField.value);
  window.adForm.setAddressFieldValue('round');
  adFormTypeField.addEventListener('change', onAdFormTypeFieldChange);
  adFormTimeInField.addEventListener('change', onAdFormTimeInFieldChange);
  adFormTimeOutField.addEventListener('change', onAdFormTimeOutFieldChange);
  adFormResetButton.addEventListener('click', onAdFormResetButtonClick);
})();
