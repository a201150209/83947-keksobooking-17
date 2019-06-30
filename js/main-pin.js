'use strict';

(function () {
  var STEM_HEIGHT = 19;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var width = mainPin.querySelector('img').offsetWidth;
  var height = mainPin.querySelector('img').offsetHeight;
  var coordinates = {
    start: getCoordinates('round'),
    current: {
      x: undefined,
      y: undefined
    },
    min: {
      y: 130
    },
    max: {
      y: 630
    }
  };
  var mapLeftMargin = getMapLeftMargin();

  function getMapLeftMargin() {
    var documentWidth = document.documentElement.clientWidth;
    var mapWidth = map.clientWidth;
    return (documentWidth - mapWidth) / 2;
  }

  function getCoordinates(pinType) {
    var positionLeft = parseInt(mainPin.style.left, 10);
    var positionTop = parseInt(mainPin.style.top, 10);
    var currentCoordinates = {
      x: (Math.floor(positionLeft + width / 2)).toString()
    };

    switch (pinType) {
      case 'round':
        currentCoordinates.y = (Math.floor(positionTop + height / 2)).toString();
        break;
      case 'marker':
        currentCoordinates.y = (Math.floor(positionTop + height + STEM_HEIGHT)).toString();
        break;
    }

    return currentCoordinates;
  }

  function setPosition(currentCoordinates) {
    var pageTopOffset = window.pageYOffset;
    // Устанавливаю центр пина по горизонтали и нижнюю точку пина по вертикали для привязки к курсору
    mainPin.style.left = (currentCoordinates.x - mapLeftMargin - height / 2).toString() + 'px';
    mainPin.style.top = (currentCoordinates.y + pageTopOffset - height - STEM_HEIGHT).toString() + 'px';
  }

  function resetPosition() {
    mainPin.style.left = (coordinates.start.x - width / 2).toString() + 'px';
    mainPin.style.top = (coordinates.start.y - height / 2).toString() + 'px';
  }

  function onMainPinMouseDown(evt) {
    evt.preventDefault();
    coordinates.current.x = evt.clientX;
    coordinates.current.y = evt.clientY;

    if (!window.mainPin.isDragged) {
      window.page.activate();
      window.mainPin.isDragged = true;
    }

    map.addEventListener('mousemove', onMapMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }

  function onMapMouseMove(evt) {
    evt.preventDefault();
    coordinates.current.x = evt.clientX;
    coordinates.current.y = evt.clientY;

    var pageTopOffset = window.pageYOffset;
    var positionTopTooHigh = (coordinates.current.y + pageTopOffset) <= coordinates.min.y;
    var positionTopTooLow = (coordinates.current.y + pageTopOffset) >= coordinates.max.y;

    if (positionTopTooHigh) {
      coordinates.current.y = coordinates.min.y - pageTopOffset;
    } else if (positionTopTooLow) {
      coordinates.current.y = coordinates.max.y - pageTopOffset;
    }

    window.adForm.setAddressFieldValue('marker');
    setPosition(coordinates.current);
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);
  }

  function onDocumentMouseUp(evt) {
    evt.preventDefault();
    map.removeEventListener('mousemove', onMapMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    window.adForm.setAddressFieldValue('marker');
  }

  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.mainPin = {
    isDragged: false,
    getCoordinates: getCoordinates,
    resetPosition: resetPosition
  };
})();
