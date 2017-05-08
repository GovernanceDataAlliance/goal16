var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var LocalesView = Backbone.View.extend({

  id: 'welcome-container',
  className: 'l-welcome',

  events: {
  },

  initialize: function() {},

  render: function() {
    return this;
  },

  show: function() {
    console.log('locales')
  }
});

module.exports = LocalesView;
