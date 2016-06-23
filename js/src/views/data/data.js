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
    'click .js--toggle-indicator': '_toggleIndicator'
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
  },

  _toggleIndicator: function(e) {
    var $current = $(e.currentTarget);
    $current.find('.js--icon-open').toggleClass('is-hidden');
    $current.find('.js--icon-close').toggleClass('is-hidden');

    var $inidcatorsTable = $current.next('.indicator-info');
    $inidcatorsTable.toggleClass('is-hidden');
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
    var targets = this.targetsCollection;

    this.targetsCollection.each(_.bind(function(target){
      var indicatorsPerTarget = _.where(this.indicatorsCollection.toJSON(), { 'target_slug': target.get('slug') });
      target.set({'indicators': indicatorsPerTarget});
    }, this));

    this.$('#targets-container').html(targetsTemplate({'targets': targets.toJSON()}));
  }

});

module.exports = DataView;
