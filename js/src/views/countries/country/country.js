var $ = require('jquery'),
  Backbone = require('backbone');

var Status = require('../../../models/countries/status.js');

var CountriesCollection = require('../../../collections/common/countries.js'),
  IndicatorsCollection = require('../../../collections/common/indicators');

var TargetCardView = require('./target-card.js');

var CountryView = Backbone.View.extend({

  id: 'js--country',

  initialize: function() {
    // models
    this.status = new Status();

    // collections
    this.countriesCollection = CountriesCollection;
    this.indicatorsCollection = new IndicatorsCollection();
  },

  _setListeners: function() {
    $('#js--share').on('click', this._share);
  },

  show: function() {
    var iso = this.status.get('iso');

    this._setVars();
    this._setListeners();

    $.when(
      this.countriesCollection.getCountriesList(),
      this.indicatorsCollection.getAllIndicatorsByCountry(iso)
    ).done(function() {
      this._renderData();
    }.bind(this))

  },

  _setVars: function() {},

  _getCountryInfo: function(iso) {
    return this.countriesCollection.getCountryData({iso: iso});
  },

  _share: function() {},

  _renderData: function() {
    var iso = this.status.get('iso'),
      country = this._getCountryInfo(iso),
      indicatorsByTarget = this.indicatorsCollection.groupByTarget();

    for (var targetSlug in indicatorsByTarget) {
      var indicators =  indicatorsByTarget[targetSlug],
        target = {
          title: indicators[0].target_title,
          slug: indicators[0].target_slug
        };

      var targetCard = new TargetCardView({
        indicators: indicators,
        status: this.status,
        target: target
      });

      this.$el.append(targetCard.render().el);

      // this.$(".slider-indicator").each(function() {
      //   $(this).slick({
      //     dots: true,
      //     arrows: false,
      //     infinite: true,
      //     speed: 500,
      //     fade: true
      //   });
      // });
    }
  },

  render: function() {
    this.$el.html();

    return this;
  }

});

module.exports = CountryView;
