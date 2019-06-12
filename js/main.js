'use strict';

var NUMBER_OF_RELATED_PINS = 8;
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinsWidth = mapPins.clientWidth;
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var relatedPinsProperty = [];
var relatedPins = [];
var relatedPinsData = {
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

function getRandomElementInArray(array) {
  var min = 0;
  var max = array.length - 1;
  return array[getRandomNumberFromRange(min, max)];
}

function getRandomNumberFromRange(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function getNumberOfImage(number) {
  var imageNumber = number + 1;
  imageNumber = '0' + String(imageNumber);
  return imageNumber;
}

function PinProperty(number) {
  this.author = {
    avatar: 'img/avatars/user' + getNumberOfImage(number) + '.png'
  };
  this.offer = {
    type: getRandomElementInArray(relatedPinsData.offer.type)
  };
  this.location = {
    x: getRandomNumberFromRange(0, mapPinsWidth),
    y: getRandomNumberFromRange(relatedPinsData.location.y.min, relatedPinsData.location.y.max)
  };
}

function createPinProperty(number) {
  relatedPinsProperty.push(new PinProperty(number));
}

function createPin(property) {
  var pin = mapPinTemplate.cloneNode(true);
  var authorAvatar = pin.querySelector('img');
  var authorAvatarWidth = authorAvatar.width;
  var authorAvatarHeight = authorAvatar.height;

  pin.style.left = property.location.x + authorAvatarWidth / 2 + 'px';
  pin.style.top = property.location.y - authorAvatarHeight + 'px';
  authorAvatar.src = property.author.avatar;
  authorAvatar.alt = '{{заголовок объявления}}'; // do not forget get alt later
  relatedPins.push(pin);
}

function createPins() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_OF_RELATED_PINS; i++) {
    createPinProperty(i);
    createPin(relatedPinsProperty[i]);
    fragment.appendChild(relatedPins[i]);
  }
  mapPins.appendChild(fragment);
}

createPins();
map.classList.remove('map--faded');

