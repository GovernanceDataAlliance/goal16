var $ = require('jquery'),
  Backbone = require('backbone');

var Status = require('../../../models/countries/status.js');

var CountryView = Backbone.View.extend({

  initialize: function() {
    console.log('CountryView inits');

    this.status = new Status();
  },

  show: function() {
    // actions after initial render
  },

  render: function() {
    this.$el.html();

    return this;
  }

});

module.exports = CountryView;
