var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/welcome/welcome.hbs'));

var WelcomeView = Backbone.View.extend({

  id: 'welcome-container',
  className: 'l-welcome',

  events: {
  },

  initialize: function() {},

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
    this.render();
  }
});

module.exports = WelcomeView;
