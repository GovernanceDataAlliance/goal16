var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = require('../../../templates/countries/country/breadcrumb.hbs');

var CountryBreadcrumb = Backbone.View.extend({

  className: 'm-breadcrumbs -light',

  template: Handlebars.compile(template),

  initialize: function(settings) {
    this.options = settings || {};
  },

  render: function() {
    var countryName = this.options.country.name;

    this.$el.html(this.template({
      countryName: countryName
    }));

    return this;
  }

});

module.exports = CountryBreadcrumb;
