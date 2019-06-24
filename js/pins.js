'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinsWrapper = map.querySelector('.map__pins');
  var pinsWrapperWidth = pinsWrapper.clientWidth;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');


  function PinEntity(number) {
    this.author = {
      avatar: 'img/avatars/user' + '0' + number.toString() + '.png'
    };
    this.offer = {
      type: window.utils.getRandomElementInArray(window.pins.mockData.offer.type)
    };
    this.location = {
      x: window.utils.getRandomNumberFromRange(0, pinsWrapperWidth),
      y: window.utils.getRandomNumberFromRange(window.pins.mockData.location.y.min, window.pins.mockData.location.y.max)
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

  window.pins = {
    mockData: {
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
    },
    render: function () {
      var fragment = document.createDocumentFragment();
      for (var i = 1; i <= window.pins.mockData.numberOfPins; i++) {
        var pin = renderPin(new PinEntity(i));
        fragment.appendChild(pin);
      }
      pinsWrapper.appendChild(fragment);
    },
    delete: function () {
      var pins = map.querySelectorAll('.map__pin');
      for (var i = 1; i < pins.length; i++) {
        pins[i].remove();
      }
    }
  };
})();
