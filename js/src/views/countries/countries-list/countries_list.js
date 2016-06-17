var $ = require('jquery'),
  Backbone = require('backbone');

var CountriesListView = Backbone.View.extend({

  initialize: function() {
    console.log('CountriesListView inits');
  },
  
  show: function() {
    // actions after initial render
  },

  render: function() {
    this.$el.html();

    return this;
  }

});

module.exports = CountriesListView;
