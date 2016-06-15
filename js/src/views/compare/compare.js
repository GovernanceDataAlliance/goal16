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
  },

  // this function initializes just before initial render
  show: function() {
    this._setView();
    this._setVars();
    this._setListeners();

    this.countriesCollection.getCountriesList().done(this._populateSelectors.bind(this));
    this.targetsCollection.getTargetsList().done(this._renderTargets.bind(this));
  },

  _updateRouterParams() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _setVars: function() {
    this.$selectors = this.$el.find('#compare-countries-selectors select');
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
  },

  _compareCountries: function() {
    this._updateRouterParams();
    this._showTargets();
  },

  _showTargets() {

    if (this.$targetList.hasClass('is-hidden')) {
      this.$targetList.removeClass('is-hidden');
    }
  },

  _renderTargets: function() {
    var countries = _.values(this.status.toJSON());

    new TargetListView({
      targets: this.targetsCollection.toJSON(),
      countries: countries
    }).render();

    // show target list if countries are already setted
    if (_.compact(countries).length > 0) {
      this._showTargets();
    }
  },

  render: function() {
    this.$el.html(template());

    return this;
  }

});

module.exports = CompareView;
