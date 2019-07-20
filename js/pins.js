'use strict';

(function () {
  var PINS_MAX_INDEX = 5;
  var PinsClass = {
    ACTIVE: 'map__pin--active',
    VISIBLE: 'map__pin--visible',
    INVISIBLE: 'map__pin--invisible'
  };

  var map = document.querySelector('.map');
  var pins;
  var pinsWrapper = map.querySelector('.map__pins');
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var filtersWrapper = map.querySelector('.map__filters-container');
  var xhrData = {
    type: 'GET',
    url: 'https://js.dump.academy/keksobooking/data',
    data: {},
    responseType: 'json',
    onSuccess: renderPins,
    onError: window.page.showError
  };

  function renderPin(entity) {
    var pin = pinsTemplate.cloneNode(true);
    var avatar = pin.querySelector('img');
    var avatarWidth = avatar.width;
    var avatarHeight = avatar.height;

    pin.style.left = entity.location.x + avatarWidth / 2 + 'px';
    pin.style.top = entity.location.y - avatarHeight + 'px';
    avatar.src = entity.author.avatar;
    avatar.alt = entity.offer.title;

    pin.classList.add(PinsClass.INVISIBLE);
    return pin;
  }

  function toggleActivePin(pin) {
    var activePin = map.querySelector('.' + PinsClass.ACTIVE);
    if (activePin) {
      activePin.classList.remove(PinsClass.ACTIVE);
    }
    pin.classList.add(PinsClass.ACTIVE);
  }

  function toggleActiveCard(cardData) {
    window.cards.removeActive();
    filtersWrapper.insertAdjacentElement('beforebegin', window.cards.render(cardData));
    document.addEventListener('keyup', window.cards.onDocumentKeyup);
  }

  function addPinClickListener(pin, cardData) {
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      var isPinActive = pin.classList.contains(PinsClass.ACTIVE);
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
      window.pins.adsCache = ads;
      window.filterForm.toggleFilters(window.filterForm.filterStatus.ACTIVATE);
    }

    ads.forEach(function (entity, number) {
      var pin = renderPin(entity);
      pin.dataset.id = number;
      window.pins.adsCache[number].id = number;
      addPinClickListener(pin, entity);
      fragment.appendChild(pin);
    });

    pinsWrapper.appendChild(fragment);
    pins = Array.from(map.querySelectorAll('.map__pin'));
    showPins(ads);
  }

  function removePins() {
    window.pins.adsCache.length = 0;
    for (var i = 1; i < pins.length; i++) {
      // Начало с 1, чтобы не удалился главный пин
      pins[i].remove();
    }
  }

  function showPins(ads) {
    ads.slice(0, PINS_MAX_INDEX).forEach(function (ad) {
      for (var i = 0; i < pins.length; i++) {
        if (Number(pins[i].dataset.id) === ad.id) {
          pins[i].classList.add(PinsClass.VISIBLE);
          pins[i].classList.remove(PinsClass.INVISIBLE);
          break;
        }
      }
    });
  }

  function hidePins() {
    var activePins = Array.from(map.querySelectorAll('.' + PinsClass.VISIBLE));
    activePins.forEach(function (pin) {
      pin.classList.remove(PinsClass.VISIBLE);
      pin.classList.add(PinsClass.INVISIBLE);
    });
  }

  window.pins = {
    requestData: xhrData,
    adsCache: [],
    render: renderPins,
    remove: removePins,
    show: showPins,
    hide: hidePins
  };
})();
