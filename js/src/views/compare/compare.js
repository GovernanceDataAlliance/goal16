var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  async = require('async'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../collections/common/countries.js');
var TargetsCollection = require('../../collections/common/targets.js');

var Status = require ('../../models/compare/status.js');

var SelectorsView = require('./selectors/selectors.js'),
  TargetListView = require('./targets/target_list.js');

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
    this.targetsCollection = new TargetsCollection();

    // views
    this.targetListView;
    this.selectorsView = new SelectorsView({
      status: this.status
    });
  },

  // this function initializes just before initial render
  show: function() {
    this._setView();
    this._setVars();

    $.when(
      this.countriesCollection.getCountriesList(),
      this.targetsCollection.getTargetsList()
    ).done(function() {
      this._renderSelectors();
      this._renderTargetList();
    }.bind(this));
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _setVars: function() {
    this.$targetList = this.$el.find('#target-list');
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
  },

  _compareCountries: function() {

    // Think about a way to avoid clicking on compare
    // when countries haven't been modified

    this._updateRouterParams();
    this._showTargets();
    this._updateScores();
  },

  _showTargets() {

    if (this.$targetList.hasClass('is-hidden')) {
      this.$targetList.removeClass('is-hidden');
    }
  },

  _renderTargetList: function() {
    var isoArray = _.compact(_.values(this.status.toJSON())),
      countries = this.countriesCollection.getCountryData(isoArray);

    this.targetListView = new TargetListView({
      countries: countries,
      targets: this.targetsCollection.toJSON()
    }).render();

    if (_.compact(countries).length > 0) {
      this._showTargets();
    }
  },

  _updateScores: function() {
    var countries = this._getCountriesInfo();

    this.targetListView.updateScores({
      countries: countries
    });
  },

  render: function() {
    this.$el.html(template());

    return this;
  }

});

module.exports = CompareView;
