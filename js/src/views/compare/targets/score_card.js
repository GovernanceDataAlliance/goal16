var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js'),
  ScoresCollection = require('../../../collections/common/scores.js');

var InfoWindowView = require('../../../views/common/infowindow_view.js');

var TargetCardTemplate = require('../../../templates/compare/targets/target_card.hbs'),
  IndicatorTableTemplate = require('../../../templates/compare/targets/score_table.hbs');

var ScoreCardView = Backbone.View.extend({

  tagName: 'article',

  className: 'c-score-card',

  template: Handlebars.compile(TargetCardTemplate),

  events: {
    'click .toggle-card' : '_toggleCard'
  },

  initialize: function(settings) {
    this.options = settings || {};

    this.status = this.options.status;
    this.target = this.options.target;


    this.el.id = this.target['slug'];

    // templates
    this.indicatorTableTemplate = Handlebars.compile(IndicatorTableTemplate);

    // collections
    this.countriesCollection = CountriesCollection;
    this.scoresCollection = new ScoresCollection();
  },

  _setVars: function() {
    this.$scoresTable = this.$el.find('.score-table');
  },

  _getInfo: function() {
    var targetSlug = this.target['slug'],
      arrayIso = _.compact(_.values(this.status.toJSON())),
      countries = this.countriesCollection.getCountryData(arrayIso);

    this.scoresCollection.getScoresGroupByTarget({
      target_slug: targetSlug
    }).done(function() {

      // shall we show a message saying there's no any score?
      if(this.scoresCollection.isEmpty()) {
        return;
      }

      this.$scoresTable.html(this.indicatorTableTemplate({
        countries: countries,
        scores: this.scoresCollection.toJSON()
      }));

    }.bind(this));
  },

  removeScores: function() {
    this.$scoresTable.html('');
  },

  updateScores: function() {
    this.removeScores();

    this.$scoresTable.addClass('is-hidden');
    this._getInfo();
  },

  _toggleCard: function() {

    if (!this.scoresCollection.isEmpty()) {
      this.$scoresTable.toggleClass('is-hidden');
    } else {
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
