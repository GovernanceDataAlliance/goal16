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
    'click .js--toggle-dashboard': '_toggleDashboard',
    'click js--toggle-target': '_toogleIndicators',
    'click .js--target': '_selectTarget',
    'change .js--indicator-selector': '_selectIndicator',
  },

  initialize: function() {
    this.status = status;

    //We will keep in this array the slug of the target
    // which indicators has already been requested in order to avoid asking twice for the same info;
    this.requestedTargets = [];

    this.targets = new TargetsCollection();
    this.listenTo(this.targets, 'sync', this._renderTargets);
  },

  show: function() {
    this.targets.getIndicatorsByTarget();
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _toggleDashboard: function(e) {
    $('body').toggleClass('is-dashboard-close');
  },

  _toogleIndicators: function(e) {
    //1 - Check if the indicator has already been requested.
    //2 - if so, open target. If not, request indicators and open target.
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.data('slug');

    if ( _.includes(this.requestedTargets, currentTargetSlug) ) {
      $currentTarget.parents('.m-dashboard-target').toogleClass('is-open');
    } else {
      this.indicators.getIndicatorsForTarget().done(function(indicators) {
        this._addIndicators(indicators);
        this.requestedTargets.push(currentTargetSlug);
        $currentTarget.parents('.m-dashboard-target').toogleClass('is-open');
      })
    }
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  _renderTargets: function() {
    this.$('#targets-container').append(targetsTemplate())
  },

  _selectTarget: function(e) {
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.data('slug');

    $currentTarget.addClass('is-active');

    this._setActiveLayer('target', currentTargetSlug);
  },

  _selectIndicator: function(e) {
     var $currentIndicatorSlug = $(e.currentTarget).val();
     this._setActiveLayer('indicator', $currentIndicatorSlug);
  },

  _setActiveLayer: function(type, layer) {
    this.status.set({layer: layer, layerType: type});
    this._updateRouterParams();
  }

});

module.exports = DashboardView;
