
var _ = require('lodash');

var FunctionHelper = {

  debounce: function (func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  arrayToString: function(array) {
    var string = '',
      compactedArray = _.compact(array),
      arrayLength = compactedArray.length;

    if (!arrayLength) {
      return;
    }

    if (arrayLength == 1) {
      if(array[0]) {
        string = "'" + array[0] + "'";
        return string;
      }
    }

    compactedArray.forEach(function(elem, index) {
      if (arrayLength - 1 == index) {
        string += "'" + elem + "'";
      } else {
        string += "'" + elem + "',";
      }
    });

    return string;

  },

  scrollTop: function() {
    document.querySelector('body').scrollTop = 0;
  }
};

module.exports = FunctionHelper;
