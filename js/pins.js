'use strict';

(function () {
  var map = document.querySelector('.map');
  var wrapper = map.querySelector('.map__pins');
  var wrapperWidth = wrapper.clientWidth;
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var location = {
    y: {
      min: 130,
      max: 630
    }
  };

  function Pin(number) {
    this.author = {
      avatar: 'img/avatars/user' + '0' + number.toString() + '.png'
    };
    this.offer = {
      type: window.utils.getRandomElementInArray(window.mockData.offer.type)
    };
    this.location = {
      x: window.utils.getRandomNumberFromRange(0, wrapperWidth),
      y: window.utils.getRandomNumberFromRange(location.y.min, location.y.max)
    };
  }

  function renderPin(entity) {
    var pin = template.cloneNode(true);
    var avatar = pin.querySelector('img');
    var avatarWidth = avatar.width;
    var avatarHeight = avatar.height;

    pin.style.left = entity.location.x + avatarWidth / 2 + 'px';
    pin.style.top = entity.location.y - avatarHeight + 'px';
    avatar.src = entity.author.avatar;
    avatar.alt = '{{заголовок объявления}}'; // do not forget get alt later

    return pin;
  }

  function renderPins() {
    var fragment = document.createDocumentFragment();
    for (var i = 1; i <= window.mockData.numberOfPins; i++) {
      var pin = renderPin(new Pin(i));
      fragment.appendChild(pin);
    }
    wrapper.appendChild(fragment);
  }

  function deletePins() {
    var pins = map.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  window.pins = {
    location: location,
    render: renderPins,
    delete: deletePins
  };
})();
