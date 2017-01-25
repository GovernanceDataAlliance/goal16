var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var AboutView = Backbone.View.extend({

  el: '#l-about',

  events: {
    'click .js-about-link' : 'onClickNavigate'
  },

  initialize: function() {},

  render: function() {
    return this;
  },

  show: function() {
  },

  onClickNavigate: function(e) {
    var $section = $(e.currentTarget).data('section');
    var $target = $('#'+ $section);
    var margin = $section === "partners" ? 0 : 40;

    $('html, body').animate({
        scrollTop: $target.offset().top - margin
    }, 1000);
  }
});

module.exports = AboutView;
