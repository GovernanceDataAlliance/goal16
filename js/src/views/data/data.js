var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var targetsCollection = require('../../collections/common/targets.js'),
    IndicatorsCollection = require('../../collections/common/indicators.js');

var template = Handlebars.compile(require('../../templates/data/index.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/data/targets.hbs')),
    indicatorsTemplate = Handlebars.compile(require('../../templates/data/indicators.hbs'));

var DataView = Backbone.View.extend({

  id: 'data-container',
  className: 'l-data',

  events: {
    'click .js--open-target': '_showIndicatorsPerTarget',
    'click .js--close-target': '_hideIndicators'
  },

  initialize: function() {
    this.targetsCollection = targetsCollection;
    this.indicatorsCollection = new IndicatorsCollection();
  },

  _renderTargets: function() {
    var targets = this.targetsCollection.toJSON();
    this.$('#targets-container').append(targetsTemplate({targets: targets}));

    this._setVars();
  },

  _setVars: function() {
    this.$targetsWrapper = $('.m-dashboard-target');
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  show: function() {
    var targetsCollection = this.targetsCollection.getTargetsList();
    var indicatorsCollection = this.indicatorsCollection.getAllIndicators()

    $.when(targetsCollection, indicatorsCollection).then(_.bind(function() {
      var targetsWithIndicators = this._matchIndicatorsWithTarget();
    }, this));
  },

  _matchIndicatorsWithTarget: function() {
    var targets = this.targetsCollection.toJSON();

    $.each(targets, _.bind(function(i, target){
      var indicatorsPerTarget = _.where(this.indicatorsCollection.toJSON(), {'target_slug': target.slug});
      target.indicators = indicatorsPerTarget;
    }, this));

    console.log(targets)
    this.$('#targets-container').html(targetsTemplate({'targets': targets}));
  }

});

module.exports = DataView;
