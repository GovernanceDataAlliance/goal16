
var _ = require('lodash');

var FunctionHelper = {

  concatenateCountries: function(array) {
    var string = '',
      compactedArray = _.compact(array),
      arrayLength = compactedArray.length;

    if (arrayLength == 0) {
      return;
    }

    if (arrayLength == 1) {
      if(array[0]) {
        string = " iso='" + array[0] + "'";
      }
    }

    compactedArray.forEach(function(elem, index) {

      if (arrayLength - 1 == index) {
        string += "iso='" + elem + "'";
      } else {
        string += " iso='" + elem + "' or ";
      }

    });

    return string;
  },

  scrollTop: function() {
    document.querySelector('body').scrollTop = 0;
  }
};

module.exports = FunctionHelper;
