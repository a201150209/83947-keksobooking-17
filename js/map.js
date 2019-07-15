'use strict';

(function () {
  var MAX_PIN_INDEX = 4;
  var map = document.querySelector('.map');
  var pinsWrapper = map.querySelector('.map__pins');
  var pinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsCache = [];
  var xhrRequestData = {
    type: 'GET',
    url: 'https://js.dump.academy/keksobooking/data',
    data: {},
    responseType: 'json',
    onSuccess: renderPins,
    onError: window.page.renderError
  };

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var enToRuOfferType = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };

  var filtersWrapper = map.querySelector('.map__filters-container');

  function renderPin(entity) {
    var pin = pinsTemplate.cloneNode(true);
    var avatar = pin.querySelector('img');
    var avatarWidth = avatar.width;
    var avatarHeight = avatar.height;

    pin.style.left = entity.location.x + avatarWidth / 2 + 'px';
    pin.style.top = entity.location.y - avatarHeight + 'px';
    avatar.src = entity.author.avatar;
    avatar.alt = entity.offer.title;

    return pin;
  }

  function addPinClickListener(pin, cardData) {
    pin.addEventListener('click', function (evt) {
      evt.preventDefault();
      removeActivePopup();
      var card = renderCard(cardData);
      filtersWrapper.insertAdjacentElement('beforebegin', card);
      document.addEventListener('keyup', onDocumentKeyup);
    });
  }

  function renderPins(data) {
    if (pinsCache.length === 0) {
      pinsCache = data;
      window.map.pinsCache = pinsCache;
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = renderPin(data[i]);
      addPinClickListener(pin, data[i]);
      fragment.appendChild(pin);

      if (i >= MAX_PIN_INDEX) {
        break;
      }
    }
    pinsWrapper.appendChild(fragment);
  }

  function removePins() {
    var pins = map.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  function removeChilds(parent) {
    var children = parent.children;
    while (children.length > 0) {
      children[0].remove();
    }
  }

  function renderFeatures(features) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + features[i]);
      fragment.appendChild(feature);
    }

    return fragment;
  }

  function renderPhotos(sources) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < sources.length; i++) {
      var photo = document.createElement('img');
      photo.classList.add('popup__photo');
      photo.src = sources[i];
      photo.width = 45;
      photo.height = 40;
      photo.alt = 'Фотография жилья';
      fragment.appendChild(photo);
    }
    return fragment;
  }

  function renderCard(entity) {
    var card = cardTemplate.cloneNode(true);
    var avatar = card.querySelector('.popup__avatar');
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capacity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var features = card.querySelector('.popup__features');
    var description = card.querySelector('.popup__description');
    var photos = card.querySelector('.popup__photos');
    var closeButton = card.querySelector('.popup__close');

    avatar.src = entity.author.avatar;
    title.textContent = entity.offer.title;
    address.textContent = entity.offer.address;
    price.textContent = entity.offer.price + '₽/ночь';
    type.textContent = enToRuOfferType[entity.offer.type];
    capacity.textContent = entity.offer.rooms + ' комнаты для ' + entity.offer.guests + ' гостей';
    time.textContent = 'Заезд после ' + entity.offer.checkin + ', выезд до ' + entity.offer.checkout;
    removeChilds(features);
    features.appendChild(renderFeatures(entity.offer.features));
    description.textContent = entity.offer.description;
    removeChilds(photos);
    photos.appendChild(renderPhotos(entity.offer.photos));

    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      removeActivePopup();
    });

    return card;
  }

  function removeActivePopup() {
    var activePopup = map.querySelector('.popup');
    if (activePopup) {
      activePopup.remove();
    }
  }

  function onDocumentKeyup(evt) {
    evt.preventDefault();
    if (evt.keyCode === window.page.KeyCode.ESC) {
      removeActivePopup();
      document.removeEventListener('keyup', onDocumentKeyup);
    }
  }

  window.map = {
    requestData: xhrRequestData,
    pinsCache: pinsCache,
    renderPins: renderPins,
    removePins: removePins,
    removeActivePopup: removeActivePopup
  };
})();
