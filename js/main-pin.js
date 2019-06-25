'use strict';

(function () {
  var STEM_HEIGHT = 19;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var width = mainPin.querySelector('img').offsetWidth;
  var height = mainPin.querySelector('img').offsetHeight;
  var startCoordinates = getCoordinates('round');
  var mapLeftMargin = getMapLeftMargin();

  function getMapLeftMargin() {
    var documentWidth = document.documentElement.clientWidth;
    var mapWidth = map.clientWidth;
    return (documentWidth - mapWidth) / 2;
  }

  function getCoordinates(pinType) {
    var positionLeft = parseInt(mainPin.style.left, 10);
    var positionTop = parseInt(mainPin.style.top, 10);
    var coordinates = {
      x: (Math.floor(positionLeft + width / 2)).toString()
    };

    switch (pinType) {
      case 'round':
        coordinates.y = (Math.floor(positionTop + height / 2)).toString();
        break;
      case 'marker':
        coordinates.y = (Math.floor(positionTop + height + STEM_HEIGHT)).toString();
        break;
    }

    return coordinates;
  }

  function setPosition(coordinates) {
    var pageTopOffset = window.pageYOffset;
    // Устанавливаю центр пина по горизонтали и нижнюю точку пина по вертикали для привязки к курсору
    mainPin.style.left = (coordinates.x - mapLeftMargin - height / 2).toString() + 'px';
    mainPin.style.top = (coordinates.y + pageTopOffset - height - STEM_HEIGHT).toString() + 'px';
  }

  function resetPosition() {
    mainPin.style.left = (startCoordinates.x - width / 2).toString() + 'px';
    mainPin.style.top = (startCoordinates.y - height / 2).toString() + 'px';
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

      if (сoordinates.y + pageTopOffset <= window.pins.location.y.min) {
        сoordinates.y = window.pins.location.y.min - pageTopOffset;
      } else if (сoordinates.y + pageTopOffset >= window.pins.location.y.max) {
        сoordinates.y = window.pins.location.y.max - pageTopOffset;
      }

      window.adForm.setAddressFieldValue('marker');
      setPosition(сoordinates);
      mainPin.removeEventListener('mousedown', onMainPinMouseDown);
    }

    function onDocumentMouseUp(upEvt) {
      upEvt.preventDefault();
      map.removeEventListener('mousemove', onMapMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      mainPin.addEventListener('mousedown', onMainPinMouseDown);
      window.adForm.setAddressFieldValue('marker');
    }

    map.addEventListener('mousemove', onMapMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }

  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.mainPin = {
    isDragged: false,
    getCoordinates: getCoordinates,
    resetPosition: resetPosition
  };
})();
