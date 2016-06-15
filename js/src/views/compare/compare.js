var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  async = require('async'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var CountriesCollection = require('../../collections/common/countries.js');
var TargetsCollection = require('../../collections/common/targets.js');

var Status = require ('../../models/compare/status.js');

var TargetListView = require('./targets/target_list.js');

var template = Handlebars.compile(require('../../templates/compare/index.hbs'));


var CompareView = Backbone.View.extend({

  id: 'js--compare-container',
  className: 'compare-container',

  events: {
    'click #compare-countries' : '_compareCountries'
  },

  initialize: function(settings) {
    this.options = settings || {};

    // models
    this.status = new Status();

    // collections
    this.countriesCollection = new CountriesCollection();
    this.targetsCollection = new TargetsCollection();

    // views
    this.targetListView;
  },

  // this function initializes just before initial render
  show: function() {
    this._setView();
    this._setVars();
    this._setListeners();

    this._checkCompareButton();

    $.when(
      this.countriesCollection.getCountriesList(),
      this.targetsCollection.getTargetsList()
    ).done(function() {
      this._populateSelectors();
      this._renderTargetList();
    }.bind(this));
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _setVars: function() {
    this.$selectors = this.$el.find('#compare-countries-selectors select');
    this.$compareBtn = this.$el.find('#compare-countries');
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

  _setListeners: function() {
    this.$selectors.on('change', this._setCountry.bind(this));
    this.status.on('change', this._checkSelectors.bind(this));
  },

  _populateSelectors: function() {
    var selectOptions;

    this.countriesCollection.forEach(function(countryModel) {
      var country = countryModel.toJSON();
      selectOptions += '<option value="' + country.iso + '">' + country.name + '</option>';
    });

    this.$selectors.each(function(i, selector) {
      $(selector).append(selectOptions);
    });

    var currentCountries = _.uniq(_.values(this.status.toJSON()));

    if (!(_.compact(currentCountries).length)) {
      return;
    }

    this.$selectors.each(function(i, selector) {
      if (!currentCountries[i]) {
        return;
      }

      this.value = currentCountries[i];
    });

    this._checkSelectors();
  },

  _checkSelectors: function() {
    var newCountries = _.values(this.status.toJSON());

    this.$selectors.each(function(i, selector) {

      $(selector).find('option:disabled').removeAttr('disabled');

      _.map(newCountries, function(iso, i) {

        if (iso == '') {
          return;
        }

        $(selector).find('option:not(:selected)[value="' + iso + '"]').attr('disabled', 'disabled');

      }, this);

    }.bind(this));
  },

  // set status with new incoming params
  _setCountry: function(e) {
    var selector = e.currentTarget;
      id = selector.id,
      iso = selector.value;

    var newStatus = this.status.toJSON()
    newStatus[id] = iso;

    this.status.set(newStatus);

    this._checkCompareButton();
  },

  // check if the compare button shoudl be available or not
  _checkCompareButton: function() {
    var settedCountries = _.compact(_.values(this.status.toJSON())),
      totalCountries = settedCountries.length;

    if (totalCountries > 1) {
      if (this.$compareBtn.hasClass('-disabled')) {
        this.$compareBtn.removeClass('-disabled');
      }
    } else {
      if (!this.$compareBtn.hasClass('-disabled')) {
        this.$compareBtn.addClass('-disabled');
      }
    }
  },

  _compareCountries: function() {

    // Think about a way to avoid clicking on compare
    // when countries haven't changed

    this._updateRouterParams();
    this._showTargets();
    this._updateScores();
  },

  _showTargets() {

    if (this.$targetList.hasClass('is-hidden')) {
      this.$targetList.removeClass('is-hidden');
    }
  },

  _getCountriesInfo: function() {
    var isos = _.values(this.status.toJSON()),
      countries = [];

    isos.forEach(function(iso) {
      if (!iso) {
        return;
      }
      var countryData = this.countriesCollection.findWhere({ iso: iso });
      countries.push(countryData.toJSON());
    }.bind(this));

    return countries;
  },

  _renderTargetList: function() {
    var countries = this._getCountriesInfo();

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
