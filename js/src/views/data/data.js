var Backbone = require('backbone'),
    Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/data/index.hbs'));

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
