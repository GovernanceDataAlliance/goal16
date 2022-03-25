var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var CategorySelector = Backbone.View.extend({

  defaults: {
    title: 'Blog posts from'
  },

  events: {
    'change select': 'onChangeSelect'
  },

  initialize: function() {
    this.$('select').chosen();
  },

  onChangeSelect: function(e) {
    var category = e.currentTarget.value;
    console.log(category);
    this._navigate(category);
  },

  _navigate: function(value) {
    var $target = $('#'+ value);
    var margin = value === "partners" ? 40 : 90;

    $('html, body').animate({
        scrollTop: $target.offset().top - margin
    }, 1000);
  },

});

module.exports = CategorySelector;
