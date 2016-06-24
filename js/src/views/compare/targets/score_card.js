var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js'),
  ScoresCollection = require('../../../collections/common/scores.js');

var InfoWindowView = require('../../../views/common/infowindow.js');

var TargetCardTemplate = require('../../../templates/compare/targets/target_card.hbs'),
  IndicatorTableTemplate = require('../../../templates/compare/targets/score_table.hbs');

var FunctionHelper = require('../../../helpers/functions.js');

var ScoreCardView = Backbone.View.extend({

  tagName: 'article',

  className: 'c-score-card',

  template: Handlebars.compile(TargetCardTemplate),

  events: {
    'click .js--target-info': '_toggleCard'
  },

  initialize: function(settings) {
    this.options = settings || {};

    this.status = this.options.status;
    this.target = this.options.target;


    this.el.id = this.target['slug'];

    this.isFirstTime = true;

    this.functionHelper = FunctionHelper;

    // templates
    this.indicatorTableTemplate = Handlebars.compile(IndicatorTableTemplate);

    // collections
    this.countriesCollection = CountriesCollection;
    this.scoresCollection = new ScoresCollection();
  },

  _setVars: function() {
    this.$scoresTable = this.$el.find('#js--score-container');
    this.$openBtn = this.$el.find('.icon-open_arrow')
    this.$closeBtn = this.$el.find('.icon-close');
  },

  _getInfo: function() {
    var targetSlug = this.target['slug'],
      arrayIso = _.values(this.status.toJSON()),
      countries = this.countriesCollection.getCountryData(arrayIso),
      countriesConditional = this.functionHelper.arrayToString(arrayIso);

    this.scoresCollection.getScoresGroupByTarget({
      countries_conditional: countriesConditional,
      target_slug: targetSlug
    }).done(function() {

      this.isFirstTime = false;

      var indicators = this.scoresCollection.toJSON();
      var parsedScores = this._parseScores(indicators);
      var indicatorsByType = this._getIndicatorsByType(parsedScores);

      this.$scoresTable.html(this.indicatorTableTemplate({
        countries: countries,
        officialIndicators: indicatorsByType['official'],
        shadowIndicators: indicatorsByType['shadow']
      }));

    }.bind(this));
  },

  _getIndicatorsByType: function(scores) {
    var indicatorsByType = _.groupBy(scores, 'indicator_type');

    return {
      official: indicatorsByType.hasOwnProperty('official') ? indicatorsByType['official'] : {},
      shadow: indicatorsByType.hasOwnProperty('shadow') ? indicatorsByType['shadow'] : {}
    };
  },

  // parses incoming scores to render them in the table
  _parseScores: function(indicatorsList) {
    var parsedScores = [],
      indicatorsGroup = _.groupBy(indicatorsList, 'indicator_slug'),
      countriesArray = this.status.toJSON(),
      countriesInfo = this.countriesCollection.getCountryData(_.values(countriesArray)),
      arrayKeys = {
        isoA: {
          countryKey: 'countryA',
          scoreKey: 'scoreA'
        },
        isoB: {
          countryKey: 'countryB',
          scoreKey: 'scoreB'
        },
        isoC: {
          countryKey: 'countryC',
          scoreKey: 'scoreC'
        }
      };

    // Loop in every indicator slug available
    for (var indicator in indicatorsGroup) {
      var indicator = indicatorsGroup[indicator] || null,
        parsedScore = {};

      // we create a new object with the common indicator's info
      Object.assign(parsedScore, indicator[0]);

      // loop in every score in the current indicator
      for (var i in indicator) {
        var score = {};

        for (var key in arrayKeys) {
          var scoreIso = indicator[i].iso;

          // the propouse of this is to create identifiable properties
          // in our new object like { countryA: X, scoreA: Y, ... }
          // and keep all scores and their countries in one place.
          if (countriesArray[key] == scoreIso) {
            var scoreKey = arrayKeys[key].scoreKey,
              countryKey = arrayKeys[key].countryKey,
              params = {};

            var currentCountry = countriesInfo.filter(function(country) {
              if (country) {
                return country.iso == scoreIso;
              }
            });

            if (currentCountry.length > 0) {
              params[countryKey] = currentCountry[0].name;
            }

            params[scoreKey] = indicator[i].score;

            Object.assign(parsedScore, params);
          }
        }
      }

      delete parsedScore.score;
      delete parsedScore.iso;

      parsedScores.push(parsedScore);
    }

    return parsedScores;
  },

  removeScores: function() {
    this.$scoresTable.html('');
  },

  resetCard: function() {
    this.$openBtn.removeClass('is-hidden');
    this.$closeBtn.addClass('is-hidden');
    this.$scoresTable.addClass('is-hidden');
  },

  resetScores: function() {
    this.resetCard();
    this.removeScores();

    this.isFirstTime = true;
  },

  _toggleCard: function() {
    this.$openBtn.toggleClass('is-hidden');
    this.$closeBtn.toggleClass('is-hidden');
    this.$scoresTable.toggleClass('is-hidden');


    if (this.isFirstTime) {
      this._getInfo();
    }

  },

  render: function() {
    var target = this.options.target;

    this.$el.html(this.template({
      target: target
    }));

    this._setVars();

    return this;
  }

});

module.exports = ScoreCardView;
