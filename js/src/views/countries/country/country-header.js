var _ = require('lodash');
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = require('../../../templates/countries/country/stickyheader.hbs');

var CountryHeaderView = Backbone.View.extend({

  className: "country-header",

  template: Handlebars.compile(template),

  events: {
    'click #toggle-btns' : '_toggleBtn'
  },

  initialize: function(opt) {
    this.options = opt || {};

    console.log("countryheaderview options", this.options);
  },

  _toggleBtn: function() {
    console.log('Toggle here');
    this.$buttonContainer = this.$el.find('.buttons-trigger');

    this.$buttonContainer.toggle(); // Toggles the map/compare buttons
  },


  render: function(opt) {
    this.$el.html(this.template({
      country: this.options.country.name,
      iso: this.options.country.iso,
      siteurl: SITEURL
    }));
    return this;
  }

});

module.exports = CountryHeaderView;
