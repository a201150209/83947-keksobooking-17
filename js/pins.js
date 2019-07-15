'use strict';

(function () {
  var Pins = {
    MAX_INDEX: 4,
    AVATAR_SELECTOR: 'img'
  };
  var map = document.querySelector('.map');
  var pinsWrapper = map.querySelector('.map__pins');
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var xhrData = {
    type: 'GET',
    url: 'https://js.dump.academy/keksobooking/data',
    data: {},
    responseType: 'json',
    onSuccess: renderPins,
    onError: window.page.renderError
  };

  function renderPin(entity) {
    var pin = pinsTemplate.cloneNode(true);
    var avatar = pin.querySelector(Pins.AVATAR_SELECTOR);
    var avatarWidth = avatar.width;
    var avatarHeight = avatar.height;

    pin.style.left = entity.location.x + avatarWidth / 2 + 'px';
    pin.style.top = entity.location.y - avatarHeight + 'px';
    avatar.src = entity.author.avatar;
    avatar.alt = entity.offer.title;

    return pin;
  }

  function addPinClickListener(pin, cardData) {
    var filtersWrapper = map.querySelector('.map__filters-container');
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.cards.removeActive();
      filtersWrapper.insertAdjacentElement('beforebegin', window.cards.render(cardData));
      document.addEventListener('keyup', window.cards.onDocumentKeyup);
    });
  }

  function renderPins(data) {
    var fragment = document.createDocumentFragment();
    var isDataFromServer = window.pins.cache.length === 0;

    if (isDataFromServer) {
      window.pins.cache = data;
      window.filterForm.toggleFilters('activate');
    }

    data.slice(0, Pins.MAX_INDEX).forEach(function (entity) {
      var pin = renderPin(entity);
      addPinClickListener(pin, entity);
      fragment.appendChild(pin);
    });

    pinsWrapper.appendChild(fragment);
  }

  function removePins() {
    var pins = map.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      // Начало с 1, чтобы не удалился главный пин
      pins[i].remove();
    }
  }

  window.pins = {
    requestData: xhrData,
    cache: [],
    render: renderPins,
    remove: removePins
  };
})();
