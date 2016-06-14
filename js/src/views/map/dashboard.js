var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var TargetsCollection = require('../../collections/map/indicators_by_target.js');

var template = Handlebars.compile(require('../../templates/map/dashboard.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/map/targets.hbs'));

var DashboardView = Backbone.View.extend({

  id: 'dashboard-container',
  className: 'l-dashboard',

  events: {
    'click .js--toggle-dashboard' : '_toggleDashboard',
    'click .js--target' : '_selectTarget',
  },

  initialize: function() {
    this.targets = new TargetsCollection();
    this.listenTo(this.targets, 'sync', this._renderTargets);
  },

  _toggleDashboard: function(e) {
    $('body').toggleClass('is-dashboard-close');
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  _renderTargets: function() {
    this.$('#targets-container').append(targetsTemplate())
  },

  show: function() {
    this.targets.getIndicatorsByTarget();
  },

  _selectTarget: function() {
    var $currentTarget = $(e.currentTarget).data('slug');
    $currentTarget.addClass('is-active');
  }

});

module.exports = DashboardView;
