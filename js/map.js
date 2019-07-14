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

  var previousFilter;
  var filteredPinsCache = [];

  var filtersWrapper = map.querySelector('.map__filters-container');

  var Maps = [
    {
      filter: filtersWrapper.querySelector('#housing-type'),
      filterPins: function (rule) {
        filteredData = filteredPinsCache.filter(function (data) {
          return data.offer.type === rule;
        });
      }
    },
    {
      filter: filtersWrapper.querySelector('#housing-price'),
      filterPins: function (rule) {
        if (rule === 'low') {
          filteredData = filteredPinsCache.filter(function (data) {
            return data.offer.price < 10000;
          });
        } else if (rule === 'middle') {
          filteredData = filteredPinsCache.filter(function (data) {
            return data.offer.price > 10000 && data.offer.price < 50000;
          });
        } else if (rule === 'high') {
          filteredData = filteredPinsCache.filter(function (data) {
            return data.offer.price > 50000;
          });
        }
      }
    },
    {
      filter: filtersWrapper.querySelector('#housing-rooms'),
      filterPins: function (rule) {
        filteredData = filteredPinsCache.filter(function (data) {
          return data.offer.rooms === Number(rule);
        });
      }
    },
    {
      filter: filtersWrapper.querySelector('#housing-guests'),
      filterPins: function (rule) {
        filteredData = filteredPinsCache.filter(function (data) {
          return data.offer.guests === Number(rule);
        });
      }
    },
    new FeatureFilters(filtersWrapper.querySelector('#filter-wifi')),
    new FeatureFilters(filtersWrapper.querySelector('#filter-dishwasher'))
  ];

  console.log(Maps);

  function FeatureFilters(filter) {
    this.filter = filter;
  }
  FeatureFilters.prototype.filterPin = function (rule) {
    filteredData = filteredPinsCache.filter(function (data) {
      for (var i = 0; i < data.offer.features.length; i++) {
        return data.offer.features[i] === rule;
      }
    });
  };

  var Filter = {
    housingType: filtersWrapper.querySelector('#housing-type'),
    housingPrice: filtersWrapper.querySelector('#housing-price'),
    housingRooms: filtersWrapper.querySelector('#housing-rooms'),
    housingGuests: filtersWrapper.querySelector('#housing-guests'),
    wifi: filtersWrapper.querySelector('#filter-wifi'),
    dishwasher: filtersWrapper.querySelector('#filter-dishwasher'),
    parking: filtersWrapper.querySelector('#filter-parking'),
    washer: filtersWrapper.querySelector('#filter-washer'),
    elevator: filtersWrapper.querySelector('#filter-elevator'),
    conditioner: filtersWrapper.querySelector('#filter-conditioner')
  };

  filtersWrapper.addEventListener('change', function (evt) {
    evt.preventDefault();
    var currentFilter = evt.target;
    console.log(currentFilter);
    var currentFilterRule = currentFilter.value;
    var isAnotherFilterWasChanged = currentFilter !== previousFilter;

    if (!isAnotherFilterWasChanged) {
      filteredPinsCache = pinsCache.slice();
    } else if (isAnotherFilterWasChanged) {
      filteredPinsCache = [];
    }

    Maps.forEach(function (item) {
      if (currentFilter === item.filter) {
        console.log(item);
        item.filterPins(currentFilterRule);
      }
    });

    /* if (currentFilter === Filter.housingType) {
      filteredData = filteredPinsCache.filter(function (data) {
        return data.offer.type === currentFilterRule;
      });
    }

    if (currentFilter === Filter.housingPrice) {
      if (currentFilterRule === 'low') {
        filteredData = filteredPinsCache.filter(function (data) {
          return data.offer.price < 10000;
        });
      } else if (currentFilterRule === 'middle') {
        filteredData = filteredPinsCache.filter(function (data) {
          return data.offer.price > 10000 && data.offer.price < 50000;
        });
      } else if (currentFilterRule === 'high') {
        filteredData = filteredPinsCache.filter(function (data) {
          return data.offer.price > 50000;
        });
      }
    }

    if (currentFilter === Filter.housingRooms) {
      filteredData = filteredPinsCache.filter(function (data) {
        return data.offer.rooms === Number(currentFilterRule);
      });
    }

    if (currentFilter === Filter.housingGuests) {
      filteredData = filteredPinsCache.filter(function (data) {
        return data.offer.guests === Number(currentFilterRule);
      });
    }

    if (currentFilter === Filter.wifi ||
      currentFilter === Filter.dishwasher ||
      currentFilter === Filter.parking ||
      currentFilter === Filter.washer ||
      currentFilter === Filter.elevator ||
      currentFilter === Filter.conditioner) {
      filteredData = filteredPinsCache.filter(function (data) {
        for (var i = 0; i < data.offer.features.length; i++) {
          return data.offer.features[i] === currentFilterRule;
        }
      });
    }*/
    console.log(filteredData);
    removePins();
    renderPins(filteredData);
    previousFilter = evt.target;

  }, true);

  var filteredData = [];

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
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = renderPin(data[i]);
      addPinClickListener(pin, data[i]);
      fragment.appendChild(pin);

      if (i > MAX_PIN_INDEX) {
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

  /* function addChangeEventListenerForFilter(filter) {
    filter.addEventListener('change', onFilterChange);
  }


   function onFilterChange(evt) {
    evt.preventDefault();
    removePins();
    filterPins(evt.target, evt.target.value);
    renderPins(filteredData);
  }


  function filterPins(filter, condition) {
    var copy = pinsCache.slice();

    if (filter === Filter.housingType) {
      filteredData = copy.filter(function (data) {
        return data.offer.type === condition;
      });
    }

    if (filter === Filter.housingPrice) {
      if (condition === 'low') {
        filteredData = copy.filter(function (data) {
          return data.offer.price < 10000;
        });
      } else if (condition === 'middle') {
        filteredData = copy.filter(function (data) {
          return data.offer.price > 10000 && data.offer.price < 50000;
        });
      } else if (condition === 'high') {
        filteredData = copy.filter(function (data) {
          return data.offer.price > 50000;
        });
      }
    }

    if (filter === Filter.housingRooms) {
      filteredData = copy.filter(function (data) {
        return data.offer.rooms === Number(condition);
      });
    }

    if (filter === Filter.housingGuests) {
      filteredData = copy.filter(function (data) {
        return data.offer.guests === Number(condition);
      });
    }

    if (filter === Filter.wifi ||
      filter === Filter.dishwasher ||
      filter === Filter.parking ||
      filter === Filter.washer ||
      filter === Filter.elevator ||
      filter === Filter.conditioner) {
      filteredData = copy.filter(function (data) {
        for (var i = 0; i < data.offer.features.length; i++) {
          return data.offer.features[i] === condition;
        }
      });
    }

    if (condition === 'any') {
      filteredData = pinsCache.slice();
    }

    console.log(filteredData);
  }

  for (var filter in Filter) {
    if (filter) {
      addChangeEventListenerForFilter(Filter[filter]);
    }
  }*/


  window.map = {
    requestData: xhrRequestData,
    renderPins: renderPins,
    removePins: removePins,
    removeActivePopup: removeActivePopup
  };
})();
