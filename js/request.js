'use strict';

(function () {
  function createXhrRequest(setting) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = setting.responseType;
    xhr.timeout = 3000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        setting.onSuccess(xhr.response);
      } else {
        setting.onError('Не удалось соединиться с сервером. Статус ответа: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      setting.onError('Не удалось соединиться с сервером');
    });

    xhr.addEventListener('timeout', function () {
      setting.onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + ' секунды');
    });

    xhr.open(setting.type, setting.url);
    xhr.send(setting.data);

    return xhr;
  }

  window.request = {
    create: createXhrRequest
  };
})();
