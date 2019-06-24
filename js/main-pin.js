'use strict';

(function () {
  var MAIN_PIN_STEM_HEIGHT = 19;
  var map = document.querySelector('.map');
  var mainPinElement = map.querySelector('.map__pin--main');
  var mainPinWidth = mainPinElement.querySelector('img').offsetWidth;
  var mainPinHeight = mainPinElement.querySelector('img').offsetHeight;
  var mapLeftMargin = getMapLeftMargin();

  window.mainPin = {
    isDragged: false,
    getCoordinates: function (pinType) {
      var positionLeft = parseInt(mainPinElement.style.left, 10);
      var positionTop = parseInt(mainPinElement.style.top, 10);
      var coordinates = {
        x: (Math.floor(positionLeft + mainPinWidth / 2)).toString()
      };

      switch (pinType) {
        case 'round':
          coordinates.y = (Math.floor(positionTop + mainPinHeight / 2)).toString();
          break;
        case 'marker':
          coordinates.y = (Math.floor(positionTop + mainPinHeight + MAIN_PIN_STEM_HEIGHT)).toString();
          break;
      }

      return coordinates;
    },
    resetPosition: function () {
      var startCoordinates = window.mainPin.getCoordinates('round');
      mainPinElement.style.left = (startCoordinates.x - mainPinWidth / 2).toString() + 'px';
      mainPinElement.style.top = (startCoordinates.y - mainPinHeight / 2).toString() + 'px';
    }
  };

  function getMapLeftMargin() {
    var documentWidth = document.documentElement.clientWidth;
    var mapWidth = map.clientWidth;
    return (documentWidth - mapWidth) / 2;
  }

  function setMainPinPosition(coordinates) {
    var pageTopOffset = window.pageYOffset;
    // Устанавливаю центр пина по горизонтали и нижнюю точку пина по вертикали для привязки к курсору
    mainPinElement.style.left = (coordinates.x - mapLeftMargin - mainPinHeight / 2).toString() + 'px';
    mainPinElement.style.top = (coordinates.y + pageTopOffset - mainPinHeight - MAIN_PIN_STEM_HEIGHT).toString() + 'px';
  }

  function onMainPinMouseDown(evt) {
    evt.preventDefault();

    var pageTopOffset = window.pageYOffset;
    var сoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    if (!window.mainPin.isDragged) {
      window.page.activate();
      window.mainPin.isDragged = true;
    }

    function onMapMouseMove(moveEvt) {
      moveEvt.preventDefault();
      pageTopOffset = window.pageYOffset;

      сoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (сoordinates.y + pageTopOffset <= window.pins.mockData.location.y.min) {
        сoordinates.y = window.pins.mockData.location.y.min - pageTopOffset;
      } else if (сoordinates.y + pageTopOffset >= window.pins.mockData.location.y.max) {
        сoordinates.y = window.pins.mockData.location.y.max - pageTopOffset;
      }

      window.adForm.setAddressFieldValue('marker');
      setMainPinPosition(сoordinates);
      mainPinElement.removeEventListener('mousedown', onMainPinMouseDown);
    }

    function onDocumentMouseUp(upEvt) {
      upEvt.preventDefault();
      map.removeEventListener('mousemove', onMapMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      mainPinElement.addEventListener('mousedown', onMainPinMouseDown);
      window.adForm.setAddressFieldValue('marker');
    }

    map.addEventListener('mousemove', onMapMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }

  mainPinElement.addEventListener('mousedown', onMainPinMouseDown);
})();
