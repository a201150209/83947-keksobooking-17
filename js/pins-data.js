'use strict';

(function () {
  function getPinsData() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      try {
        window.pinsData.data = JSON.parse(xhr.responseText);
        window.pins.render();
      } catch (err) {
        var template = document.querySelector('#error').content;
        var error = template.cloneNode(true);
        var main = document.querySelector('main');
        main.appendChild(error);
      }
    });

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  }

  window.pinsData = {
    getPinsData: getPinsData
  };
})();
