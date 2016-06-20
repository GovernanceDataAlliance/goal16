var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js'),
  ScoresCollection = require('../../../collections/common/scores.js');

var InfoWindowView = require('../../../views/common/infowindow.js');

var TargetCardTemplate = require('../../../templates/compare/targets/target_card.hbs'),
  IndicatorTableTemplate = require('../../../templates/compare/targets/score_table.hbs');

var ScoreCardView = Backbone.View.extend({

  tagName: 'article',

  className: 'c-score-card',

  template: Handlebars.compile(TargetCardTemplate),

  events: {
    'click .js--toggle-card' : '_toggleCard'
  },

  initialize: function(settings) {
    this.options = settings || {};

    this.status = this.options.status;
    this.target = this.options.target;


    this.el.id = this.target['slug'];

    this.isFirstTime = true;

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
      arrayIso = _.compact(_.values(this.status.toJSON())),
      countries = this.countriesCollection.getCountryData(arrayIso);

    this.scoresCollection.getScoresGroupByTarget({
      target_slug: targetSlug
    }).done(function() {

      this.isFirstTime = false;

      this.$scoresTable.html(this.indicatorTableTemplate({
        countries: countries,
        scores: this.scoresCollection.toJSON()
      }));

    }.bind(this));
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
