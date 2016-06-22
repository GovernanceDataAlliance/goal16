var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/data/index.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/data/targets.hbs'));
    indicatorsTemplate = Handlebars.compile(require('../../templates/data/indicators.hbs'));data

var DataView = Backbone.View.extend({

  id: 'data-container',
  className: 'l-data',

  events: {
  },

  initialize: function() {},

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
  }
});

module.exports = DataView;
