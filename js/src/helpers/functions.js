
var _ = require('lodash');

// used only for indicators with a letter as score
var _setLetterScore = function(score) {
  if (score) {

    switch(score) {
      case '1':
        return 'A';

      case '2':
        return 'B';

      case '3':
        return 'C';
    }
  }
};

var FunctionHelper =  {

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

          if (!!indicator['units'] && indicator.score !== null) {
            var score = indicator.score.toString();

            if (indicator['units'] == 'Yes/No') {

              indicator.literalScore = score === '1' ? 'Yes' : 'No';
            }

            if (indicator['units'] == 'grade') {

              indicator.literalScore = _setLetterScore(score);
            }
          }
        }
      }
    // Object
    } else {

      if (!!indicators['units'] && indicators.score !== null) {
        var score = indicators.score.toString();

        if (indicators['units'] == 'Yes/No') {

          indicators.literalScore = score === '1' ? 'Yes' : 'No';
        }

        if (indicators['units'] == 'grade') {

          indicators.literalScore = _setLetterScore(score);
        }
      }
    }
  },

  setLiteralScoreCompare: function(indicators) {
    if (indicators && indicators.length > 0) {

      for (var i = 0; i < indicators.length; i++) {

        var indicator = indicators[i];

        if (!!indicator['units']) {

          if (indicator.hasOwnProperty('scoreA') && indicator.scoreA !== null) {
            var score = indicator.scoreA.toString();

            if (score) {

              if (indicator['units'] == 'Yes/No') {
                indicator.literalScoreA = score === '1' ? 'Yes' : 'No';
              }

              if (indicator['units'] == 'grade') {
                indicator.literalScoreA = _setLetterScore(score);
              }
            }
          }

          if (indicator.hasOwnProperty('scoreB') && indicator.scoreB !== null) {
            var score = indicator.scoreB.toString();

            if (score) {
              if (indicator['units'] == 'Yes/No') {
                indicator.literalScoreB = score === '1' ? 'Yes' : 'No';
              }

              if (indicator['units'] == 'grade') {
                indicator.literalScoreB = _setLetterScore(score);
              }
            }
          }

          if (indicator.hasOwnProperty('scoreC') && indicator.scoreC !== null) {
            var score = indicator.scoreC.toString();

            if (score) {
              if (indicator['units'] == 'Yes/No') {
                indicator.literalScoreC = score === '1' ? 'Yes' : 'No';
              }

              if (indicator['units'] == 'grade') {
                indicator.literalScoreC = _setLetterScore(score);
              }
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
