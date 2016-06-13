var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var template = Handlebars.compile(require('../../templates/map/dashboard.hbs'));

var DashboardView = Backbone.View.extend({

  id: 'dashboard-container',
  className: 'l-dashboard',

  events: {
    'click .js--toggle-dashboard' : '_toggleDashboard'
  },

  initialize: function() {
  },

  _toggleDashboard: function(e) {
    $('body').toggleClass('is-dashboard-close');
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
  }

});

module.exports = DashboardView;
