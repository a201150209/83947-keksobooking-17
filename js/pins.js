'use strict';

(function () {
  var Pin = {
    MAX_INDEX: 4,
    AVATAR_SELECTOR: 'img',
    ACTIVE_CLASS: 'map__pin--active'
  };
  var map = document.querySelector('.map');
  var pinsWrapper = map.querySelector('.map__pins');
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var filtersWrapper = map.querySelector('.map__filters-container');
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
    var avatar = pin.querySelector(Pin.AVATAR_SELECTOR);
    var avatarWidth = avatar.width;
    var avatarHeight = avatar.height;

    pin.style.left = entity.location.x + avatarWidth / 2 + 'px';
    pin.style.top = entity.location.y - avatarHeight + 'px';
    avatar.src = entity.author.avatar;
    avatar.alt = entity.offer.title;

    return pin;
  }

  function toggleActivePin(pin) {
    var activePin = map.querySelector('.' + Pin.ACTIVE_CLASS);
    if (activePin) {
      activePin.classList.remove(Pin.ACTIVE_CLASS);
    }
    pin.classList.add(Pin.ACTIVE_CLASS);
  }

  function toggleActiveCard(cardData) {
    window.cards.removeActive();
    filtersWrapper.insertAdjacentElement('beforebegin', window.cards.render(cardData));
    document.addEventListener('keyup', window.cards.onDocumentKeyup);
  }

  function addPinClickListener(pin, cardData) {
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      var isPinActive = pin.classList.contains(Pin.ACTIVE_CLASS);
      if (!isPinActive) {
        toggleActivePin(pin);
        toggleActiveCard(cardData);
      }
    });
  }

  function renderPins(ads) {
    var fragment = document.createDocumentFragment();
    var isDataFromServer = window.pins.adsCache.length === 0;

    if (isDataFromServer) {
      window.pins.cache = ads;
      window.filterForm.toggleFilters(window.filterForm.filterStatus.ACTIVATE);
    }

    ads.forEach(function (entity) {
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

  function showPins(pins) {
    pins.slice(0, Pin.MAX_INDEX);
  }

  window.pins = {
    requestData: xhrData,
    adsCache: [],
    render: renderPins,
    remove: removePins
  };
})();
