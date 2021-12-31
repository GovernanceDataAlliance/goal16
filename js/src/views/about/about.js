var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var AboutSelector = require('./about_selector.js');

var AboutView = Backbone.View.extend({

  el: '#l-about',

  events: {
    'click .js-about-link' : 'onClickNavigate'
  },

  initialize: function() {
    this._selectOptions();
    $('.js-about-link').first().addClass('active');
  },

  render: function() {
    return this;
  },

  show: function() {
  },

  onClickNavigate: function(e) {
    var $section = $(e.currentTarget).data('section');
    var $target = $('#'+ $section);
    var margin = $section === "partners" ? 40 : 90;

    $('html, body').animate({
        scrollTop: $target.offset().top - margin
    }, 1000);

    $('.js-about-link').removeClass('active');
    $(e.currentTarget).addClass('active');

  },

  _selectOptions: function() {
    new AboutSelector({
      el: '#aboutSelector'
    });
  },
});

module.exports = AboutView;
