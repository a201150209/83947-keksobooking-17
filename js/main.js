'use strict';
var MAIN_PIN_STEM_HEIGHT = 19;

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters');

var pinsWrapper = map.querySelector('.map__pins');
var pinsWrapperWidth = pinsWrapper.clientWidth;
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
var isMainPinDragged = false;
var mainPinStartCoordinates = getMainPinCoordinates('round');

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddressField = adForm.querySelector('#address');
var adFormPriceField = adForm.querySelector('#price');
var adFormTypeField = adForm.querySelector('#type');
var adFormTimeInField = adForm.querySelector('#timein');
var adFormTimeOutField = adForm.querySelector('#timeout');
var adFormResetButton = adForm.querySelector('.ad-form__reset');

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
    avatar: 'img/avatars/user' + '0' + number.toString() + '.png'
  };
  this.offer = {
    type: getRandomElementInArray(pinMockData.offer.type)
  };
  this.location = {
    x: getRandomNumberFromRange(0, pinsWrapperWidth),
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
  pinsWrapper.appendChild(fragment);
}

function toggleStatusOfFormsElements(status) {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = status;
  }
  mapFilters.disabled = status;
}

function activatePage() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  toggleStatusOfFormsElements(false);
  renderPins();
}

function getMainPinCoordinates(pinType) {
  var mainPinPositionLeft = parseInt(mainPin.style.left, 10);
  var mainPinPositionTop = parseInt(mainPin.style.top, 10);
  var x = (Math.floor(mainPinPositionLeft + mainPinWidth / 2)).toString();
  var y;

  switch (pinType) {
    case 'round':
      y = (Math.floor(mainPinPositionTop + mainPinHeight / 2)).toString();
      break;
    case 'marker':
      y = (Math.floor(mainPinPositionTop + mainPinHeight + MAIN_PIN_STEM_HEIGHT)).toString();
      break;
  }

  return {x: x, y: y};
}

function setAddressFieldValue(pinType) {
  var pinCoordinates = getMainPinCoordinates(pinType);
  adFormAddressField.value = pinCoordinates.x + ', ' + pinCoordinates.y;
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

function onMainPinMouseDown(evt) {
  evt.preventDefault();

  var documentWidth = document.documentElement.clientWidth;
  var mapWidth = map.clientWidth;
  var mapLeftMargin = (documentWidth - mapWidth) / 2;
  var pageTopOffset = window.pageYOffset;
  var startCoordinates = {
    x: evt.clientX,
    y: evt.clientY
  };

  if (!isMainPinDragged) {
    activatePage();
    isMainPinDragged = true;
  }

  function setMainPinPosition() {
    pageTopOffset = window.pageYOffset;
    // Устанавливаю центр пина по горизонтали и нижнюю точку пина по вертикали для привязки к курсору
    mainPin.style.left = (startCoordinates.x - mapLeftMargin - mainPinHeight / 2).toString() + 'px';
    mainPin.style.top = (startCoordinates.y + pageTopOffset - mainPinHeight - MAIN_PIN_STEM_HEIGHT).toString() + 'px';
  }

  function onMapMouseMove(moveEvt) {
    moveEvt.preventDefault();
    pageTopOffset = window.pageYOffset;

    startCoordinates = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    if (startCoordinates.y + pageTopOffset <= pinMockData.location.y.min) {
      startCoordinates.y = pinMockData.location.y.min - pageTopOffset;
    } else if (startCoordinates.y + pageTopOffset >= pinMockData.location.y.max) {
      startCoordinates.y = pinMockData.location.y.max - pageTopOffset;
    }

    setMainPinPosition();
    setAddressFieldValue('marker');
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);
  }

  function onDocumentMouseUp(upEvt) {
    upEvt.preventDefault();
    map.removeEventListener('mousemove', onMapMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    setAddressFieldValue('marker');
  }

  setMainPinPosition();
  map.addEventListener('mousemove', onMapMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
}

function deletePins() {
  var pins = map.querySelectorAll('.map__pin');
  for (var i = 1; i < pins.length; i++) {
    pins[i].remove();
  }
}

function deactivatePage() {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  toggleStatusOfFormsElements(true);
  deletePins();
  isMainPinDragged = false;
  mainPin.style.left = (mainPinStartCoordinates.x - mainPinWidth / 2).toString() + 'px';
  mainPin.style.top = (mainPinStartCoordinates.y - mainPinHeight / 2).toString() + 'px';
  setAddressFieldValue('round');
}

function onAdFormResetButtonClick() {
  deactivatePage();
}

toggleStatusOfFormsElements(true);
mainPin.addEventListener('mousedown', onMainPinMouseDown);
setAddressFieldValue('round');
setMinPrice(adFormTypeField.value);
adFormTypeField.addEventListener('change', onAdFormTypeFieldChange);
adFormTimeInField.addEventListener('change', onAdFormTimeInFieldChange);
adFormTimeOutField.addEventListener('change', onAdFormTimeOutFieldChange);
adFormResetButton.addEventListener('click', onAdFormResetButtonClick);

