var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = require('../../../templates/countries/country/banner.hbs');

var ShareWindowView = require('../../common/share_window.js');

var CountryBanner = Backbone.View.extend({

  className: 'l-banner -section-1 -topsection-countries js--index-banner',

  events: {
    'click #js--share' : '_share'
  },

  template: Handlebars.compile(template),

  initialize: function(settings) {
    this.options = settings || {};

    var shareOptions = {
      isCountry: true,
      iso: this.options.country.iso
    };

    this.shareWindowView = new ShareWindowView(shareOptions);
  },

  _share: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  render: function() {
    var countryName = this.options.country.name,
    regionClass = this.options.regionClass;

    this.$el.html(this.template({
      countryName: countryName
    }));

    this.$el.addClass([regionClass, 'country-shade']);

    return this;
  }

});

module.exports = CountryBanner;
