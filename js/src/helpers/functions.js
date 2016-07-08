
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

  setLiteralScore: function(indicators) {
    if (!indicators) {
      return;
    }

    // Array
    if (_.isArray(indicators)) {
      if (indicators.length > 0) {
        for (var i = 0; i < indicators.length; i++) {
          var indicator = indicators[i];

          if (!!indicator['units'] && indicator['units'] == 'Yes/No') {

            if (indicator.score !== null) {
              var score = indicator.score.toString();

              if (score) {
                indicator.literalScore = score === '1' ? 'Yes' : 'No';
              }
            }
          }
        }
      }
    // Object
    } else {

      if (!!indicators['units'] && indicators['units'] == 'Yes/No') {
        if (indicators.score !== null) {
          var score = indicators.score.toString();

          if (score) {
            indicators.literalScore = score === '1' ? 'Yes' : 'No';
          }
        }
      }
    }
  },

  setLiteralScoreCompare: function(indicators) {
    if (indicators && indicators.length > 0) {

      for (var i = 0; i < indicators.length; i++) {

        var indicator = indicators[i];

        if (!!indicator['units'] && indicator['units'] == 'Yes/No') {

          if (indicator.hasOwnProperty('scoreA') && indicator.scoreA !== null) {

            var score = indicator.scoreA.toString();

            if (score) {
              indicator.literalScoreA = score === '1' ? 'Yes' : 'No';
            }
          }

          if (indicator.hasOwnProperty('scoreB') && indicator.scoreB !== null) {

            var score = indicator.scoreB.toString();

            if (score) {
              indicator.literalScoreB = score === '1' ? 'Yes' : 'No';
            }
          }

          if (indicator.hasOwnProperty('scoreC') && indicator.scoreC !== null) {

            var score = indicator.scoreC.toString();

            if (score) {
              indicator.literalScoreC = score === '1' ? 'Yes' : 'No';
            }
          }
        }
      }
    }
  },

  scrollTop: function() {
    document.querySelector('body').scrollTop = 0;
  }
};

module.exports = FunctionHelper;
