var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/map/legend.hbs'))

var MapLegendView = Backbone.View.extend({

  el: '#content',

  initialize: function(options) {
    this.options = options;
    this.render()
  },

  render: function() {
    this.$el.append(template());
  },

  show: function() {
    this.render();
  }


});

module.exports = MapLegendView;
