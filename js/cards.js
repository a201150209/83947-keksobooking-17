'use strict';

var FeatureClass = {
  FIRST: 'popup__feature',
  SECOND: 'popup__feature--'
};
var Photo = {
  CLASS: 'popup__photo',
  WIDTH: 45,
  HEIGHT: 40,
  ALT: 'Фотография жилья'
};
var enToRuOfferType = {
  'bungalo': 'Бунгало',
  'flat': 'Квартира',
  'house': 'Дом',
  'palace': 'Дворец'
};
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

function onDocumentKeyup(evt) {
  evt.preventDefault();
  if (window.utils.isEscKeycode(evt)) {
    removeActiveCard();
  }
}

function renderFeatures(features) {
  var fragment = document.createDocumentFragment();
  features.forEach(function (it) {
    var element = document.createElement('li');
    element.classList.add(FeatureClass.FIRST);
    element.classList.add(FeatureClass.SECOND + it);
    fragment.appendChild(element);
  });

  return fragment;
}

function renderPhotos(sources) {
  var fragment = document.createDocumentFragment();
  sources.forEach(function (it) {
    var photo = document.createElement('img');
    photo.classList.add(Photo.CLASS);
    photo.src = it;
    photo.width = Photo.WIDTH;
    photo.height = Photo.HEIGHT;
    photo.alt = Photo.ALT;
    fragment.appendChild(photo);
  });

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
  window.utils.removeChilds(features);
  features.appendChild(renderFeatures(entity.offer.features));
  description.textContent = entity.offer.description;
  window.utils.removeChilds(photos);
  photos.appendChild(renderPhotos(entity.offer.photos));

  closeButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    removeActiveCard();
  });

  return card;
}

function removeActiveCard() {
  var activeCard = window.page.map.querySelector('.popup');
  if (activeCard) {
    activeCard.remove();
    document.removeEventListener('keyup', onDocumentKeyup);
  }
}

window.cards = {
  render: renderCard,
  removeActive: removeActiveCard,
  onDocumentKeyup: onDocumentKeyup
};
