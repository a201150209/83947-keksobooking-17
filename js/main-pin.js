'use strict';

(function () {
  var MainPin = {
    START: 'round',
    AFTER_ACTIVATE: 'marker',
    STEM_HEIGHT: 19
  };
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mainPinWidth = mainPin.querySelector('img').offsetWidth;
  var mainPinHeight = mainPin.querySelector('img').offsetHeight;
  var mainPinCoordinates = {
    start: getCoordinates(MainPin.START),
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
      x: (Math.floor(positionLeft + mainPinWidth / 2)).toString()
    };

    switch (pinType) {
      case MainPin.START:
        currentCoordinates.y = (Math.floor(positionTop + mainPinHeight / 2)).toString();
        break;
      case MainPin.AFTER_ACTIVATE:
        currentCoordinates.y = (Math.floor(positionTop + mainPinHeight + MainPin.STEM_HEIGHT)).toString();
        break;
    }

    return currentCoordinates;
  }

  function setPosition(currentCoordinates) {
    var pageTopOffset = window.pageYOffset;
    // Устанавливаю центр пина по горизонтали и нижнюю точку пина по вертикали для привязки к курсору
    mainPin.style.left = (currentCoordinates.x - mapLeftMargin - mainPinHeight / 2).toString() + 'px';
    mainPin.style.top = (currentCoordinates.y + pageTopOffset - mainPinHeight - MainPin.STEM_HEIGHT).toString() + 'px';
  }

  function resetPosition() {
    mainPin.style.left = (mainPinCoordinates.start.x - mainPinWidth / 2).toString() + 'px';
    mainPin.style.top = (mainPinCoordinates.start.y - mainPinHeight / 2).toString() + 'px';
  }

  function onMainPinMouseDown(evt) {
    evt.preventDefault();
    mainPinCoordinates.current.x = evt.clientX;
    mainPinCoordinates.current.y = evt.clientY;

    if (!window.mainPin.isDragged) {
      window.page.activate();
      window.mainPin.isDragged = true;
    }

    map.addEventListener('mousemove', onMapMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }

  function onMapMouseMove(evt) {
    evt.preventDefault();
    mainPinCoordinates.current.x = evt.clientX;
    mainPinCoordinates.current.y = evt.clientY;

    var pageTopOffset = window.pageYOffset;
    var positionTopTooHigh = (mainPinCoordinates.current.y + pageTopOffset) <= mainPinCoordinates.min.y;
    var positionTopTooLow = (mainPinCoordinates.current.y + pageTopOffset) >= mainPinCoordinates.max.y;

    if (positionTopTooHigh) {
      mainPinCoordinates.current.y = mainPinCoordinates.min.y - pageTopOffset;
    } else if (positionTopTooLow) {
      mainPinCoordinates.current.y = mainPinCoordinates.max.y - pageTopOffset;
    }

    window.adForm.setAddressFieldValue(MainPin.AFTER_ACTIVATE);
    setPosition(mainPinCoordinates.current);
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);
  }

  function onDocumentMouseUp(evt) {
    evt.preventDefault();
    map.removeEventListener('mousemove', onMapMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    window.adForm.setAddressFieldValue(MainPin.AFTER_ACTIVATE);
  }

  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.mainPin = {
    isDragged: false,
    getCoordinates: getCoordinates,
    resetPosition: resetPosition
  };
})();
