'use strict';

(function () {
  window.utils = {
    getRandomElementInArray: function (array) {
      return array[window.utils.getRandomNumberFromRange(0, array.length - 1)];
    },
    getRandomNumberFromRange: function (min, max) {
      return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    },
    removeChilds: function (parent) {
      var children = parent.children;
      while (children.length > 0) {
        children[0].remove();
      }
    },
    toggleStatusOfElements: function (elements, status) {
      elements = Array.from(elements);
      elements.forEach(function (element) {
        element.disabled = status;
      });
    }
  };
})();
