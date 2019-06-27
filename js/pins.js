'use strict';

(function () {
  var map = document.querySelector('.map');
  var wrapper = map.querySelector('.map__pins');
  var template = document.querySelector('#pin').content.querySelector('.map__pin');

  function Pin(data) {
    this.author = {
      avatar: data.author.avatar
    };
    this.offer = {
      type: data.offer.type
    };
    this.location = {
      x: data.location.x,
      y: data.location.y
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
    for (var i = 0; i < window.pinsData.data.length; i++) {
      var pin = renderPin(new Pin(window.pinsData.data[i]));
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
    render: renderPins,
    delete: deletePins
  };
})();
