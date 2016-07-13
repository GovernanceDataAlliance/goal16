var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js'),
  ScoresCollection = require('../../../collections/common/scores.js');

var InfoWindowView = require('../../../views/common/infowindow.js'),
  TargetCardHeaderView = require('../../../views/common/target-card/header.js');

var IndicatorTableTemplate = require('../../../templates/compare/targets/score_table.hbs');

var FunctionHelper = require('../../../helpers/functions.js');

var ScoreCardView = Backbone.View.extend({

  className: 'c-score-card',

  tagName: 'article',

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

  _setListeners: function() {
    this.targetCardHeaderView.on('toggle:card', function() {
      if (this.isFirstTime) {
        this.$toggleCard.addClass('is-loading -compare');
        this._getInfo();
      }

    }.bind(this));
  },

  _setVars: function() {
    this.$scoresTable = this.$el.find('.js--score-container');
    this.$toggleCard = this.$el.find('.js--toggle-card');
  },

  _getInfo: function() {
    var targetSlug = this.target['slug'],
      arrayIso = _.values(this.status.toJSON()),
      countriesConditional = this.functionHelper.arrayToString(arrayIso);

      this.countries = this.countriesCollection.getCountryData(arrayIso);

    this.scoresCollection.getScoresGroupByTarget({
      countries_conditional: countriesConditional,
      target_slug: targetSlug
    }).done(function() {

      this.isFirstTime = false;

      var indicators = this.scoresCollection.toJSON();
      var parsedScores = this._parseScores(indicators);

      var indicatorsByType = this._getIndicatorsByType(parsedScores),
        officialIndicators = indicatorsByType['official'],
        shadowIndicators = indicatorsByType['shadow'],
        setLiteralScoreCompare = this.functionHelper.setLiteralScoreCompare;

      setLiteralScoreCompare(officialIndicators);
      setLiteralScoreCompare(shadowIndicators);

      this.$toggleCard.removeClass('is-loading -compare');

      console.log(officialIndicators);
      console.log(shadowIndicators);

      console.log(this.countries);

      this.$scoresTable.html(this.indicatorTableTemplate({
        countries: this.countries,
        officialIndicators: officialIndicators,
        shadowIndicators: shadowIndicators,
        siteurl: SITEURL
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

      //If a country has no score, at least, keep an object with it iso
      //to fullfill the grid
      // this.countries.map(function(country) {
      //   if(country) {
      //     var myiso = _.find(indicator, {iso: country.iso});
      //
      //     if(!myiso) {
      //       var params = {
      //         iso: country.iso,
      //       }
      //       indicator['iso'] = country.iso
      //     }
      //   }
      // });

      // we create a new object with the common indicator's info
      _.extend(parsedScore, indicator[0]);

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

            _.extend(parsedScore, params);
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
    this.trigger('card:reset');
  },

  resetScores: function() {
    this.resetCard();
    this.removeScores();

    this.isFirstTime = true;
  },

  render: function() {
    var target = this.options.target,
      siteurl = window.SITEURL;

    var viewOptions = {
      target: target,
      cardView: this
    };

    this.targetCardHeaderView = new TargetCardHeaderView(viewOptions);

    this.$el.html(this.targetCardHeaderView.render().el);

    this._setVars();
    this._setListeners();

    return this;
  }

});

module.exports = ScoreCardView;
