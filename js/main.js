'use strict';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinsWidth = mapPins.clientWidth;
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

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
    x: getRandomNumberFromRange(0, mapPinsWidth),
    y: getRandomNumberFromRange(pinMockData.location.y.min, pinMockData.location.y.max)
  };

}

function renderPin(entity) {
  var pin = mapPinTemplate.cloneNode(true);
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
  mapPins.appendChild(fragment);
}

renderPins();
map.classList.remove('map--faded');
