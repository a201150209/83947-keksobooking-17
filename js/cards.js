'use strict';

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
