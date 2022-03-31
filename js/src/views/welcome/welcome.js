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
    this._setVars();
    return this;
  },

  show: function() {
    // this.getLocale();
  },

  _setVars: function() {
    this.$dropdownBtn = $('.dropdown-btn');
    this.$dropdownContent = $('#js-dropdown');

    this.$window = $(window);

    this.$dropdownBtn.on('click', this._toggleDropdown.bind(this));
    this.$window.on('click', this._onOutsideDropdown.bind(this));
  },

  _toggleDropdown: function(e) {
    this.$dropdownContent.toggleClass('show');
  },

  _onOutsideDropdown(e) {
    // Checks if the div (lang-dropdown) contains the targeted DOM element
    if (!document.getElementsByClassName('lang-dropdown')[0].contains(e.target)) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  },

  // getLocale: function() {
  //   var language = window.navigator.userLanguage || window.navigator.language;

  //   switch(language) {
  //     case 'es-ES':
  //       window.location.href = '/spanish';
  //       break
  //     case 'es':
  //       window.location.href = '/spanish';
  //       break
  //     case 'fr-FR':
  //       window.location.href = '/french';
  //       break
  //     case 'fr':
  //       window.location.href = '/french';
  //       break
  //     case 'ar':
  //       window.location.href = '/arabic';
  //       break
  //     case 'ru':
  //       window.location.href = '/russian';
  //       break
  //     case 'zh':
  //       window.location.href = '/chinese';
  //       break
  //   }
  // }
});

module.exports = WelcomeView;
