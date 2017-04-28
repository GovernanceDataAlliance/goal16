var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var WelcomeView = Backbone.View.extend({

  id: 'welcome-container',
  className: 'l-welcome',

  events: {
  },

  initialize: function() {
  },

  render: function() {
    return this;
  },

  show: function() {
    this.getLocale();
  },

  getLocale: function() {
    var language = window.navigator.userLanguage || window.navigator.language;

    switch(language) {
      case 'es-ES':
        window.location.href = '/spanish';
        break
      case 'es':
        window.location.href = '/spanish';
        break
      case 'fr-FR':
        window.location.href = '/french';
        break
      case 'fr':
        window.location.href = '/french';
        break
      case 'ar':
        window.location.href = '/arabic';
        break
      case 'ru':
        window.location.href = '/rusian';
        break
      case 'zh':
        window.location.href = '/chinese';
        break
    }
  }
});

module.exports = WelcomeView;
