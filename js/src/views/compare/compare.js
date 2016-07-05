var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../collections/common/countries.js');
var TargetsCollection = require('../../collections/common/targets.js');

var Status = require ('../../models/compare/status.js');

var SelectorsView = require('./selectors/selectors.js'),
  TargetListView = require('./targets/target_list.js'),
  ShareWindowView = require('../common/share_window.js');

var template = Handlebars.compile(require('../../templates/compare/index.hbs'));

var CompareView = Backbone.View.extend({

  id: 'compare-container',
  className: 'compare-container',

  events: {
    'click #compare-countries' : '_compareCountries'
  },

  initialize: function(settings) {
    this.options = settings || {};

    // models
    this.status = new Status();

    // collections
    this.countriesCollection = CountriesCollection;
    this.targetsCollection = TargetsCollection;

    // views
    this.selectorsView = new SelectorsView({
      status: this.status
    });

    this.shareWindowView = new ShareWindowView();

    this.targetListView = new TargetListView({
      status: this.status
    });
  },

  // this function initializes just before initial render
  show: function() {
    this._setView();
    this._setVars();
    this._setListeners();

    this.$shareSection.toggleClass('is-hidden');

    $.when(
      this.countriesCollection.getCountriesList(),
      this.targetsCollection.getTargetsList()
    ).done(function() {
      this._renderSelectors();
      this._renderTargetList();
    }.bind(this));
  },

  _setVars: function() {
    this.$shareSection = $('.l-share');
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _setListeners: function() {
    $('#js--share').on('click', this._share.bind(this));
  },

  _setView: function() {
    enquire.register("screen and (max-width:767px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });
  },

  _renderSelectors: function() {
    this.$el.find('#selectors-container').html(this.selectorsView.render().el);

    this.selectorsView.setView();
  },

  _compareCountries: function() {
    this._updateRouterParams();
    this.targetListView.resetScores();

    this.targetListView.showList();
    this.$shareSection.removeClass('is-hidden');
  },

  _share: function() {
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  _renderTargetList: function() {
    var countries = _.compact(_.values(this.status.toJSON()));

    this.$el.find('#target-list-container').html(this.targetListView.render().el);

    if (countries.length > 1) {
      this.targetListView.toggleList();
      this.$shareSection.removeClass('is-hidden');
    }
  },

  render: function() {
    this.$el.html(template());

    return this;
  }

});

module.exports = CompareView;
