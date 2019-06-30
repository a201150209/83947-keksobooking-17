'use strict';

(function () {
  var MAX_QUANTITY = 4;
  var map = document.querySelector('.map');
  var wrapper = map.querySelector('.map__pins');
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var xhrRequestData = {
    type: 'GET',
    url: 'https://js.dump.academy/keksobooking/data',
    responseType: 'json',
    timeout: 3000,
    onLoad: renderPins,
    onError: renderPinsError
  };
  var downloadedData = [];

  var housingTypeFilter = map.querySelector('#housing-type');

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

  function renderPins(data) {
    if (downloadedData.length === 0) {
      downloadedData = data;
    }

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      var pin = renderPin(new Pin(data[i]));
      fragment.appendChild(pin);

      if (i > MAX_QUANTITY) {
        break;
      }
    }
    wrapper.appendChild(fragment);
  }

  function renderPinsError(data) {
    var errorTemplate = document.querySelector('#error').content;
    var error = errorTemplate.cloneNode(true);
    var errorMessage = error.querySelector('.error__message');
    errorMessage.textContent = data;
    var main = document.querySelector('main');
    main.appendChild(error);
  }

  function deletePins() {
    var pins = map.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  function filterData(condititon) {
    return downloadedData.slice().filter(function (data) {
      return data.offer.type === condititon;
    });
  }

  housingTypeFilter.addEventListener('change', function (evt) {
    deletePins();
    var filteredData = filterData(evt.target.value);
    renderPins(filteredData);
  });

  window.pins = {
    requestData: xhrRequestData,
    render: renderPins,
    renderError: renderPinsError,
    delete: deletePins
  };
})();
