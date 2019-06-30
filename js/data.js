'use strict';

(function () {
  function createXhrRequest(data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = data.responseType;
    xhr.timeout = data.timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        data.onLoad(xhr.response);
      } else {
        data.onError('Произошла ошибка загрузки данных. Статус ответа: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      data.onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      data.onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(data.type, data.url);
    xhr.send();

    return xhr;
  }

  window.data = {
    request: createXhrRequest
  };
})();
