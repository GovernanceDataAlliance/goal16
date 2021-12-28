var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var Status = require('../../../models/countries/status.js');

var CountriesCollection = require('../../../collections/common/countries.js'),
  IndicatorsCollection = require('../../../collections/common/indicators');

var template = require('../../../templates/countries/country/index.hbs');

var BreadcrumbView = require('./country-breadcrumb.js'),
  BannerView = require('./banner.js'),
  TargetCardView = require('./target-card.js'),
  ShareWindowView = require('../../common/share_window.js');

var CountryView = Backbone.View.extend({

  id: 'js--country',

  template: Handlebars.compile(template),

  initialize: function() {
    // models
    this.status = new Status();

    // collections
    this.countriesCollection = CountriesCollection;
    this.indicatorsCollection = new IndicatorsCollection();

    // views
    this.shareWindowView;
  },

  _setListeners: function() {
    $('#js--share').on('click', this._share.bind(this));
  },

  show: function() {
    var iso = this.status.get('iso');

    var shareOptions = {
      isCountry: true,
      iso: iso
    };

    this.shareWindowView = new ShareWindowView(shareOptions);

    this._setVars();
    this._setListeners();

    $.when(
      this.countriesCollection.getCountriesList(),
      this.indicatorsCollection.getAllIndicatorsByCountry(iso)
    ).done(function() {
      this._renderBanner();
      this._renderData();
    }.bind(this))

  },

  _setVars: function() {
    this.$header = $('.l-header');
    this.$banner = $('.l-banner');
    this.$bannerTitle = this.$banner.find('.c-section-title');

    this.$targetList = this.$el.find('#js--target-list');
  },

  _getCountryInfo: function(iso) {
    return this.countriesCollection.getCountryData({iso: iso});
  },

  _share: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  _renderBanner: function() {
    var iso = this.status.get('iso'),
      country = this._getCountryInfo(iso),
      regionClass = '-' + country.region_name.toLowerCase();

    var viewOptions = {
      country: country,
      regionClass: regionClass
    };

    $('.l-banner').remove();
    $('.m-breadcrumbs.-light').remove();

    var breadcrumbView = new BreadcrumbView(viewOptions);
    var bannerView = new BannerView(viewOptions);

    this.$header.after(breadcrumbView.render().el, bannerView.render().el);
  },

  _renderData: function() {
    var iso = this.status.get('iso'),
      country = this._getCountryInfo(iso),
      indicatorsByTarget = this.indicatorsCollection.groupByTarget(),
      openFirst = true;

    for (var targetSlug in indicatorsByTarget) {

      var indicators =  indicatorsByTarget[targetSlug],
        target = {
          code: indicators[0].target_code,
          title: indicators[0].target_title,
          slug: indicators[0].target_slug
        };

      var targetCard = new TargetCardView({
        indicators: indicators,
        status: this.status,
        target: target
      });


      this.$targetList.find('> .wrap').append(targetCard.render().el);

      // targetCard.setSlick(); Triggers Swipe view between Global and Complementary Indicators

      if (openFirst) {
        targetCard.targetCardHeaderView.toggleCard();
        openFirst = !openFirst;
      }
    }
  },

  render: function() {
    this.$el.html(this.template());

    this._setVars();

    return this;
  }

});

module.exports = CountryView;
