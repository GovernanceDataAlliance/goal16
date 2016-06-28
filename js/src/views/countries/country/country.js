var $ = require('jquery'),
  Backbone = require('backbone');

var Status = require('../../../models/countries/status.js');

var CountriesCollection = require('../../../collections/common/countries.js'),
  IndicatorsCollection = require('../../../collections/common/indicators');

var TargetCardView = require('./target-card.js'),
  ShareWindowView = require('../../common/share_window.js');

var CountryView = Backbone.View.extend({

  id: 'js--country',

  initialize: function() {
    // models
    this.status = new Status();

    // collections
    this.countriesCollection = CountriesCollection;
    this.indicatorsCollection = new IndicatorsCollection();

    // views
    this.shareWindowView = new ShareWindowView();
  },

  _setListeners: function() {
    $('#js--share').on('click', this._share.bind(this));
  },

  show: function() {
    var iso = this.status.get('iso');

    this._setVars();
    this._setListeners();

    $.when(
      this.countriesCollection.getCountriesList(),
      this.indicatorsCollection.getAllIndicatorsByCountry(iso)
    ).done(function() {
      this._setBanner();
      this._renderData();
    }.bind(this))

  },

  _setVars: function() {
    this.$banner = $('.l-banner');
    this.$bannerTitle = this.$banner.find('.c-section-title');
  },

  _getCountryInfo: function(iso) {
    return this.countriesCollection.getCountryData({iso: iso});
  },

  _share: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },
  
  _setBanner: function() {
    var iso = this.status.get('iso'),
      country = this._getCountryInfo(iso),
      regionClass = '-' + country.region_name.toLowerCase();

    this.$banner.addClass(regionClass);
    this.$bannerTitle.text(country.name);
  },

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
    }
  },

  render: function() {
    this.$el.html();

    this._setVars();

    return this;
  }

});

module.exports = CountryView;
