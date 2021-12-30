var Backbone = require('backbone'),
    _ = require('lodash'),
    Handlebars = require('handlebars');

var Status = require ('../../models/data/status.js');

var targetsCollection = require('../../collections/common/targets.js'),
    IndicatorsCollection = require('../../collections/common/indicators.js');

var TextShortener = require('../../views/common/text_shortener.js');

var template = Handlebars.compile(require('../../templates/data/index.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/data/targets.hbs'));

var DataView = Backbone.View.extend({

  id: 'data-container',
  className: 'l-data',

  events: {
    'click .js--toggle-indicator': '_toggleIndicator',
    'click .js--toggle-header': '_toggleParentIndicator'
  },

  initialize: function() {
    this.status =  new Status();
    this.targetsCollection = targetsCollection;
    this.indicatorsCollection = new IndicatorsCollection();
  },

  _setViews: function() {
    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
        // this._shortTexts();
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });
  },

  _renderTargets: function() {
    var targets = this.targetsCollection.toJSON();
    this.$('#targets-container').append(targetsTemplate({targets: targets}));

    this._setVars();
  },

  _setVars() {

  },

  _revealFirstIndicator: function() {
    // 1st Parent Indicator
    this.$firstIndicatorsWrapper = this.$el.find('.js--indicators-wrapper').first();
    this.$firstCloseBtn = this.$el.find('.icon-close').first();
    this.$firstOpenBtn = this.$el.find('.icon-open_arrow').first();

    this.$firstIndicatorsWrapper.toggleClass('is-closed');
    this.$firstCloseBtn.toggleClass('is-hidden');
    this.$firstOpenBtn.toggleClass('is-hidden');

    // 1st Child Indicator of Parent
    this.$firstChildIndicator = this.$el.find('.indicator-info').first();
    this.$firstChildCloseBtn = this.$el.find('.js--icon-close').first();
    this.$firstChildOpenBtn = this.$el.find('.js--icon-open').first();

    this.$firstChildIndicator.toggleClass('is-hidden');
    this.$firstChildCloseBtn.toggleClass('is-hidden');
    this.$firstChildOpenBtn.toggleClass('is-hidden');
  },

  _toggleParentIndicator: function(e) {
    var $indicatorsWrapper = $(e.currentTarget).next('.js--indicators-wrapper');
    var $closeBtn = $(e.currentTarget).find('.icon-close');
    var $openBtn = $(e.currentTarget).find('.icon-open_arrow');

    $indicatorsWrapper.toggleClass('is-closed');
    $closeBtn.toggleClass('is-hidden');
    $openBtn.toggleClass('is-hidden');
  },

  _toggleIndicator: function(e) {
    var $current = $(e.currentTarget);
    $current.find('.js--icon-open').toggleClass('is-hidden');
    $current.find('.js--icon-close').toggleClass('is-hidden');

    var $inidcatorsTable = $current.next('.indicator-info');
    $inidcatorsTable.toggleClass('is-hidden');

    this.status.set({ 'indicator': $current.data('slug') })

    this._updateRouterParams();
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _shortTexts: function() {
    var elem = document.querySelector('.m-static-content');

    new TextShortener({
      el: elem
    }).short();
  },

  render: function() {
    this.$el.html(template());
    this._setViews();

    return this;
  },

  show: function() {
    var targetsCollection = this.targetsCollection.getTargetsList();
    var indicatorsCollection = this.indicatorsCollection.getAllIndicators()

    $.when(targetsCollection, indicatorsCollection).then(function() {
      this._matchIndicatorsWithTarget();
    }.bind(this));
  },

  _matchIndicatorsWithTarget: function() {
    var targets = this.targetsCollection;

    this.targetsCollection.each(_.bind(function(target){
      var indicatorsPerTarget = _.filter(this.indicatorsCollection.toJSON(), { 'target_slug': target.get('slug') });
      target.set({'indicators': indicatorsPerTarget});
    }, this));

    this.$('#targets-container').html(targetsTemplate({'targets': targets.toJSON()}));

    var currentInd = this.status.get('indicator')
    currentInd && this._setSelectedIndicator(currentInd);

    this._revealFirstIndicator();
  },

  _setSelectedIndicator: function(currentInd) {
    var $indicator = $('#indicator-'+currentInd);
    var top = $indicator.offset().top - 30;

    $indicator.find('.indicator-info').removeClass('is-hidden');
    $('body, html').animate({'scrollTop': top}, 200);

    $indicator.find('.js--icon-open').toggleClass('is-hidden');
    $indicator.find('.js--icon-close').toggleClass('is-hidden');
  }

});

module.exports = DataView;
