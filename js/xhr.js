'use strict';

(function () {
  var STATUS_OK = 200;
  var TIMEOUT_MS = 3000;
  var TIMEOUT_SEC = TIMEOUT_MS / 1000;

  var pinsConfig = {
    type: 'GET',
    url: 'https://js.dump.academy/keksobooking/data',
    data: {},
    responseType: 'json',
    onSuccess: window.pins.render,
    onError: window.popup.showError
  };

  var adFormConfig = {
    type: 'POST',
    url: 'https://js.dump.academy/keksobooking',
    data: {},
    responseType: 'json',
    onSuccess: window.popup.showSuccess,
    onError: window.popup.showError
  };

  function createXhrRequest(setting) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = setting.responseType;
    xhr.timeout = TIMEOUT_MS;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        setting.onSuccess(xhr.response);
      } else {
        setting.onError('Не удалось соединиться с сервером. Статус ответа: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      setting.onError('Не удалось соединиться с сервером');
    });

    xhr.addEventListener('timeout', function () {
      setting.onError('Запрос не успел выполниться за ' + TIMEOUT_SEC + ' секунды');
    });

    xhr.open(setting.type, setting.url);
    xhr.send(setting.data);

    return xhr;
  }

  window.xhr = {
    pinsConfig: pinsConfig,
    adFormConfig: adFormConfig,
    create: createXhrRequest
  };
})();
