var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var Country = require('../../models/country.js'),
    InfoWindowModel = require('../../models/infowindow.js'),
    Indicators = require('../../collections/indicators.js');

var FunctionHelper = require('../../helpers/functions.js');

var CountryHeaderView = require('./country_header.js'),
    IndicatorListView = require('./indicator_list.js'),
    CountryToolbarView = require('./country_toolbar.js'),
    ModalWindowView = require('../common/infowindow_view.js')
    ShareWindowView = require('../common/share_window_view.js');

var template = Handlebars.compile(require('../../templates/countries/country.hbs'));

var status = new (Backbone.Model.extend({
  defaults: {
    iso: null
  }
}));

var CountryView = Backbone.View.extend({

  id: 'js--country-container',

  events: {
    'click .btn-info': 'showModalWindow',
    'click .js--view-share': '_openShareWindow'
  },

  initialize: function() {
    // Models
    this.status = status;
    this.infoWindowModel = new InfoWindowModel();

    this.functionHelper = FunctionHelper;
    this.shareWindowView = new ShareWindowView();

    this.country = new Country({id: this.status.get('iso')});
    this.indicators = new Indicators();
    // this.country.fetch();

    // this._setListeners();
  },

  _setListeners: function() {
    // Collections listeners
    this.listenTo(this.indicators, 'sync', this._renderIndicators);
    this.listenTo(this.country, 'sync', this._renderCountry);
  },

  _openShareWindow: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  render: function() {
    this._hideBanner();

    this.$el.html(template());
    this._renderToolbars();

    this.functionHelper.scrollTop();

    return this;
  },

  _renderCountry: function() {
    var headerView = new CountryHeaderView({
      country: this.country
    });

    this.$('.js--country-header').html(headerView.render().el);
  },

  _renderToolbars: function() {
    this.countryToolbar = new CountryToolbarView({
      el: this.$el.find('.js--toolbar-display')
    });

    this.$el.find('.js--country-toolbar').find('.wrap').append(this.countryToolbar.render().el);
  },

  _renderIndicators: function() {
    new IndicatorListView({
      'indicators': this.indicators
    }).render();
  },

  _hideBanner: function() {
    //Trick to hidde the countries index header.
    //As we are ussing the same Jekyll template, we need to do it.
    if (!$('.js--index-banner').hasClass('is-hidden')) {
      $('.js--index-banner').addClass('is-hidden');
    }
  },

  _updateCompareLink: function() {
    var link = document.querySelector('.l-aside-content a'),
      iso = this.status.get('iso');
      link.href = '/compare/?isoA=' + iso;
  },

  _getIndicatorInfo: function(opts) {
    return this.infoWindowModel.getIndicator(opts);
  },

  showModalWindow: function(e) {
    var indicator = $(e.currentTarget).data('indicator');
    if (!indicator) {
      return;
    }

    this._getIndicatorInfo({
      indicator: indicator
    }).done(function() {

      new ModalWindowView({
        'type': 'info-infowindow',
        'data': this.infoWindowModel.toJSON()
      });

    }.bind(this));
  }

});

module.exports = CountryView;
