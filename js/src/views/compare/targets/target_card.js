var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js'),
  ScoresCollection = require('../../../collections/common/scores.js');

var InfoWindowView = require('../../../views/common/infowindow_view.js');

var TargetCardTemplate = require('../../../templates/compare/targets/target_card.hbs'),
  IndicatorTableTemplate = require('../../../templates/compare/targets/indicators_table.hbs');

var TargetCardView = Backbone.View.extend({

  tagName: 'article',
  className: 'm-target-report',

  template: Handlebars.compile(TargetCardTemplate),

  events: {
    'click .more-info' : '_openModal',
    'click .toggle-card' : '_toggleCard'
  },

  initialize: function(settings) {
    this.options = settings || {};


    this.el.id = this.options.target.slug;

    // templates
    this.indicatorTableTemplate = Handlebars.compile(IndicatorTableTemplate);

    // collections
    this.countriesCollection = new CountriesCollection();
    this.scoresCollection = new ScoresCollection();
  },

  _setVars: function() {
    this.$scoresTable = this.$el.find('.indicators-table');
  },

  _getInfo: function() {
    var target_slug = this.options.target.slug,
      countries = this.options.countries;

    this.scoresCollection.getScoresByTarget({
      countries: countries,
      target_slug: target_slug
    }).done(function() {

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
    this._getInfo();
  },

  _openModal: function() {
    // need some options..
    new InfoWindowView();
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

module.exports = TargetCardView;
