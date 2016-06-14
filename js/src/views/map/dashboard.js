var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var TargetsCollection = require('../../collections/map/indicators_by_target.js');

var status = require ('../../models/map/status.js');

var template = Handlebars.compile(require('../../templates/map/dashboard.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/map/targets.hbs'));

var DashboardView = Backbone.View.extend({

  id: 'dashboard-container',
  className: 'l-dashboard',

  events: {
    'click .js--toggle-dashboard' : '_toggleDashboard',
    'click .js--target' : '_selectTarget',
    'change .js--indicator-selector' : '_selectIndicator',

  },

  initialize: function() {
    this.status = status;

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

  _selectTarget: function(e) {
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.data('slug');

    $currentTarget.addClass('is-active');

    this._setActiveLayer(currentTargetSlug, 'target');
  },

  _selectIndicator: function(e) {
     var $currentIndicatorSlug = $(e.currentTarget).val();
     this._setActiveLayer($currentIndicatorSlug, 'indicator');
  },

  _setActiveLayer: function(layer, type) {
    this.status.set({'layerConfig': {layer: layer, type: type}});
  }

});

module.exports = DashboardView;
