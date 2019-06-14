'use strict';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinsWidth = mapPins.clientWidth;
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var mockData = {
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
    type: getRandomElementInArray(mockData.offer.type)
  };
  this.location = {
    x: getRandomNumberFromRange(0, mapPinsWidth),
    y: getRandomNumberFromRange(mockData.location.y.min, mockData.location.y.max)
  };

}

function renderPin(property) {
  var pin = mapPinTemplate.cloneNode(true);
  var authorAvatar = pin.querySelector('img');
  var authorAvatarWidth = authorAvatar.width;
  var authorAvatarHeight = authorAvatar.height;

  pin.style.left = property.location.x + authorAvatarWidth / 2 + 'px';
  pin.style.top = property.location.y - authorAvatarHeight + 'px';
  authorAvatar.src = property.author.avatar;
  authorAvatar.alt = '{{заголовок объявления}}'; // do not forget get alt later

  return pin;
}

function renderPins() {
  var fragment = document.createDocumentFragment();
  for (var i = 1; i <= mockData.numberOfPins; i++) {
    var pin = renderPin(new PinEntity(i));
    fragment.appendChild(pin);
  }
  mapPins.appendChild(fragment);
}

renderPins();
map.classList.remove('map--faded');
