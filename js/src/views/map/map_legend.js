var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/map/legend.hbs'))

var MapLegendView = Backbone.View.extend({

  className: 'l-legend',

  initialize: function(options) {
    this.options = options;
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
    this.render();
  }


});

module.exports = MapLegendView;
