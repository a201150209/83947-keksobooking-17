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
var mainPinWidth = mainPin.clientWidth;
var mainPinHeight = mainPin.clientHeight;
var mainPinPositionLeft = mainPin.style.left;
var mainPinPositionTop = mainPin.style.top;

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddressField = adForm.querySelector('#address');

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
toggleStatusOfFormsElements(true);

function onClickMapPinMain() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  toggleStatusOfFormsElements(false);
  renderPins();
}
mainPin.addEventListener('click', onClickMapPinMain);

function onMouseUpMapPinMain(evt) {
  adFormAddressField.value = evt.pageX + ', ' + evt.pageY; // will be changed later
}
mainPin.addEventListener('mouseup', onMouseUpMapPinMain);

function getMainPinCoordinates() {
  var x = String(Math.floor(parseInt(mainPinPositionLeft, 10) + mainPinWidth / 2));
  var y = String(Math.floor(parseInt(mainPinPositionTop, 10) + mainPinHeight / 2));
  return x + ', ' + y;
}

function setAddressFieldValue() {
  adFormAddressField.value = getMainPinCoordinates();
}
setAddressFieldValue();

