var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var TargetsCollection = require('../../collections/common/targets.js');
    IndicatorsCollection = require('../../collections/common/indicators.js');

var status = require ('../../models/map/status.js');

var template = Handlebars.compile(require('../../templates/map/dashboard.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/map/targets.hbs'));
    indicatorsTemplate = Handlebars.compile(require('../../templates/map/indicators.hbs'));

var DashboardView = Backbone.View.extend({

  id: 'dashboard-container',
  className: 'l-dashboard',

  events: {
    'click .js--toggle-dashboard': '_toggleDashboard',
    'click .js--toggle-target': '_toogleIndicators',
    'click .js--target': '_selectTarget',
    'change .js--indicator-selector': '_selectIndicator',
  },

  initialize: function() {
    this.status = status;

    //We will keep in this array the slug of the target
    // which indicators has already been requested in order to avoid asking twice for the same info;
    this.requestedTargets = [];

    this.targetsCollection = new TargetsCollection();
    this.indicatorsCollection = new IndicatorsCollection();
    // this.listenTo(this.targetsCollection, 'sync', this._renderTargets);
  },

  show: function() {
    this.targetsCollection.getTargetsList().done(_.bind(function() {
      this._renderTargets();
    }, this));
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
      // $currentTarget.parent('.m-dashboard-target').toogleClass('is-open');
    } else {
      this.indicatorsCollection.getInidcatorsByTarget(currentTargetSlug).done(_.bind(function() {
        this._renderIndicators(currentTargetSlug);
        this.requestedTargets.push(currentTargetSlug);
        // $currentTarget.parent('.m-dashboard-target').toogleClass('is-open');
      }, this))
    }
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  _renderTargets: function() {
    var targets = this.targetsCollection.toJSON();
    this.$('#targets-container').append(targetsTemplate({targets: targets}))
  },

  _selectTarget: function(e) {
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.data('slug');

    $currentTarget.addClass('is-active');

    this._setActiveLayer('target', currentTargetSlug);
  },

  _renderIndicators: function(targetSlug) {
    var indicatorsGrupedByType = this.indicatorsCollection.groupByType();

    this.$('#' + targetSlug).find('.js--indicators').html(indicatorsTemplate(indicatorsGrupedByType))
  },

  _selectIndicator: function(e) {
     var $currentIndicatorSlug = $(e.currentTarget).val();
     this._setActiveLayer('indicator', $currentIndicatorSlug);
  },

  _setActiveLayer: function(type, layer) {
    this.status.set({layerType: type, layer: layer});
    this._updateRouterParams();
  }

});

module.exports = DashboardView;
