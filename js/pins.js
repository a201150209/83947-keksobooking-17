'use strict';

(function () {
  var PinsIndex = {
    MAX: 5,
    FIRST_RELATED: 1
  };
  var PinsClass = {
    ACTIVE: 'map__pin--active',
    VISIBLE: 'map__pin--visible',
    INVISIBLE: 'map__pin--invisible'
  };

  var pins;
  var pinsWrapper = window.page.map.querySelector('.map__pins');
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var filtersWrapper = window.page.map.querySelector('.map__filters-container');

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
    var activePin = window.page.map.querySelector('.' + PinsClass.ACTIVE);
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
      window.filterForm.toggleDisability(window.filterForm.status.ACTIVE);
    }

    ads.forEach(function (item, i) {
      if (item.offer) {
        var pin = renderPin(item);
        pin.dataset.id = i;
        window.pins.adsCache[i].id = i;
        addPinClickListener(pin, item);
        fragment.appendChild(pin);
      }
    });

    pinsWrapper.appendChild(fragment);
    pins = Array.from(window.page.map.querySelectorAll('.map__pin'));
    showPins(ads);
  }

  function removePins() {
    window.pins.adsCache.length = 0;
    for (var i = PinsIndex.FIRST_RELATED; i < pins.length; i++) {
      // Начало с 1, чтобы не удалился главный пин
      pins[i].remove();
    }
  }

  function showPins(ads) {
    ads.slice(0, PinsIndex.MAX).forEach(function (item) {
      for (var i = 0; i < pins.length; i++) {
        var isAdAndPinMatched = Number(pins[i].dataset.id) === item.id;
        if (isAdAndPinMatched) {
          pins[i].classList.add(PinsClass.VISIBLE);
          pins[i].classList.remove(PinsClass.INVISIBLE);
          break;
        }
      }
    });
  }

  function hidePins() {
    var activePins = Array.from(window.page.map.querySelectorAll('.' + PinsClass.VISIBLE));
    activePins.forEach(function (item) {
      item.classList.remove(PinsClass.VISIBLE);
      item.classList.add(PinsClass.INVISIBLE);
    });
  }

  window.pins = {
    adsCache: [],
    render: renderPins,
    remove: removePins,
    show: showPins,
    hide: hidePins
  };
})();
