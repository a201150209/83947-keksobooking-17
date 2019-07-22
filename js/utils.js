'use strict';

(function () {
  window.utils = {
    removeChilds: function (parent) {
      var children = parent.children;
      while (children.length > 0) {
        children[0].remove();
      }
    },
    toggleElementsDisability: function (elements, status) {
      elements = Array.from(elements);
      elements.forEach(function (element) {
        element.disabled = status;
      });
    },
    isEscKeycode: function (evt) {
      var ESC_KEYCODE = 27;
      return evt.keyCode === ESC_KEYCODE;
    }
  };
})();
