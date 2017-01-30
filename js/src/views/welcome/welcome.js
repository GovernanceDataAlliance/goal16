var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var WelcomeView = Backbone.View.extend({

  id: 'welcome-container',
  className: 'l-welcome',

  events: {
  },

  initialize: function() {
    console.log('hola')
  },

  render: function() {
    return this;
  },

  show: function() {
    console.log('shoe')
    this.getLocale();
  },

  getLocale: function() {
    var language = window.navigator.userLanguage || window.navigator.language;
    console.log(language);

    // switch(language) {
    //   case 'en-US':
    //     window.location.href = '/es';
    //     break
    // }
  }
});

module.exports = WelcomeView;
