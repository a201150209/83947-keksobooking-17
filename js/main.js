'use strict';

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters');

var pins = map.querySelector('.map__pins');
var pinsWidth = pins.clientWidth;
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinMockData = {
  numberOfPins: 8,
  offer: {
    type: [
      'palace',
      'flat',
      'house',
      'bungalo'
    ]
  },
  location: {
    y: {
      min: 130,
      max: 630
    }
  }
};

var mainPin = map.querySelector('.map__pin--main');
var mainPinWidth = mainPin.querySelector('img').offsetWidth;
var mainPinHeight = mainPin.querySelector('img').offsetHeight;
var mainPinPositionLeft = parseInt(mainPin.style.left, 10);
var mainPinPositionTop = parseInt(mainPin.style.top, 10);
var mainPinCoordinates = getMainPinCoordinates();
var MAIN_PIN_STEM_HEIGHT = 22;

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddressField = adForm.querySelector('#address');
var adFormPriceField = adForm.querySelector('#price');
var adFormTypeField = adForm.querySelector('#type');
var adFormTimeInField = adForm.querySelector('#timein');
var adFormTimeOutField = adForm.querySelector('#timeout');

var offer = {
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

function getRandomElementInArray(array) {
  return array[getRandomNumberFromRange(0, array.length - 1)];
}

function getRandomNumberFromRange(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function PinEntity(number) {
  this.author = {
    avatar: 'img/avatars/user' + '0' + String(number) + '.png'
  };
  this.offer = {
    type: getRandomElementInArray(pinMockData.offer.type)
  };
  this.location = {
    x: getRandomNumberFromRange(0, pinsWidth),
    y: getRandomNumberFromRange(pinMockData.location.y.min, pinMockData.location.y.max)
  };

}

function renderPin(entity) {
  var pin = pinTemplate.cloneNode(true);
  var authorAvatar = pin.querySelector('img');
  var authorAvatarWidth = authorAvatar.width;
  var authorAvatarHeight = authorAvatar.height;

  pin.style.left = entity.location.x + authorAvatarWidth / 2 + 'px';
  pin.style.top = entity.location.y - authorAvatarHeight + 'px';
  authorAvatar.src = entity.author.avatar;
  authorAvatar.alt = '{{заголовок объявления}}'; // do not forget get alt later

  return pin;
}

function renderPins() {
  var fragment = document.createDocumentFragment();
  for (var i = 1; i <= pinMockData.numberOfPins; i++) {
    var pin = renderPin(new PinEntity(i));
    fragment.appendChild(pin);
  }
  pins.appendChild(fragment);
}

function toggleStatusOfFormsElements(status) {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = status;
  }
  mapFilters.disabled = status;
}

function onClickMainPin() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  toggleStatusOfFormsElements(false);
  renderPins();
  mainPin.removeEventListener('click', onClickMainPin);
}

function onMouseUpMainPin() {
  // Меняю координаты, потому что у метки появился острый конец
  var x = mainPinPositionLeft + mainPinWidth / 2;
  var y = mainPinPositionTop + mainPinHeight + MAIN_PIN_STEM_HEIGHT;
  adFormAddressField.value = String(x) + ', ' + String(y);
}

function getMainPinCoordinates() {
  var x = String(Math.floor(mainPinPositionLeft + mainPinWidth / 2));
  var y = String(Math.floor(mainPinPositionTop + mainPinHeight / 2));
  return x + ', ' + y;
}

function setAddressFieldValue(coordinates) {
  adFormAddressField.value = coordinates;
}

function setMinPrice(offerType) {
  adFormPriceField.min = offer[offerType].minPrice;
  adFormPriceField.placeholder = offer[offerType].minPrice;
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

toggleStatusOfFormsElements(true);
mainPin.addEventListener('click', onClickMainPin);
mainPin.addEventListener('mouseup', onMouseUpMainPin);
setAddressFieldValue(mainPinCoordinates);
setMinPrice(adFormTypeField.value);
adFormTypeField.addEventListener('change', onAdFormTypeFieldChange);
adFormTimeInField.addEventListener('change', onAdFormTimeInFieldChange);
adFormTimeOutField.addEventListener('change', onAdFormTimeOutFieldChange);

