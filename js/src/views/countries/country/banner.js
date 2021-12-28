var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = require('../../../templates/countries/country/banner.hbs');

var CountryBanner = Backbone.View.extend({

  className: 'l-banner -section-1 -topsection-countries js--index-banner',

  template: Handlebars.compile(template),

  initialize: function(settings) {
    this.options = settings || {};
  },

  render: function() {
    var countryName = this.options.country.name,
      regionClass = this.options.regionClass;

    this.$el.html(this.template({
      countryName: countryName
    }));

    this.$el.addClass(regionClass);

    this.$el.addClass('country-shade');

    return this;
  }

});

module.exports = CountryBanner;
