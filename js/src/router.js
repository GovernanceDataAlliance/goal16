var _ = require('lodash'),
  Backbone = require('backbone'),
  URI = require('urijs');

var ViewManager = require('./lib/view_manager.js'),
  MapView = require('./views/map/map.js'),
  DashboardView = require('./views/map/dashboard.js'),
  MobileMenuView = require('./views/common/mobile_menu_view.js'),
  CompareView = require('./views/compare/compare.js'),
  CountriesView = require('./views/countries/countries.js'),
  CountryView = require('./views/countries/country.js');

var Router = Backbone.Router.extend({

  /*
   * Routes examples:
   * countries: countries?iso=GAB
   * compare: compare?isoA=SPA&isoB=FRA&isoC=ENG
   */

  routes: {
    "(/)": "map",
    "map(/)": "map",
    "countries(/)(?iso=:iso)": "countries",
    "compare(/)": "compare"
  },

  initialize: function() {
    this.viewManager = new ViewManager();
    this.commonViews();
    this._setListeners();
  },

  _setListeners: function() {
    Backbone.Events.on('router:update-params', this._updateParams, this);
  },

  //COMMON
  commonViews: function() {
    new MobileMenuView();
  },

  //MAP
  map: function() {
    if (!this.viewManager.hasView('map')) {
      this.viewManager.addView('map', MapView);
    }

    if (!this.viewManager.hasView('dashboard')) {
      this.viewManager.addView('dashboard', DashboardView);
    }

    this.viewManager.showView('dashboard');
    this.viewManager.showView('map');
  },

  //COUNTRIES
  countries: function(iso) {
    var view;

    if (!iso) {

      if (!this.viewManager.hasView('countries')) {
        this.viewManager.addView('countries', CountriesView);
      }

      this.viewManager.showView('countries');

    } else {

      if (!this.viewManager.hasView('country')) {
        this.viewManager.addView('country', CountryView);
      }

      view = this.viewManager.getView('country');

      this.viewManager.showView('country');
      view.status.set({ iso: iso });
    }
  },

  //COMPARE
  compare: function() {
    var view,
      uri = new URI(window.location),
      params = uri.search(true);

    if (!this.viewManager.hasView('compare')) {
      this.viewManager.addView('compare', CompareView);
    }

    view = this.viewManager.getView('compare');

    this.viewManager.showView('compare');

    view.status.set(params, { silent: true });

    // set a valid function to avoid more than X params
    // if (!view.status.isValid()) {
    //   return;
    // }

    console.log('incoming params');
    console.log(view.status.toJSON());
  },

  // Receives the status (Backbone Model only) of the current view.
  // Updates the URL silently.
  _updateParams: function(status) {
    var params = status.toJSON(),
      uri = new URI(window.location),
      path = uri.path();

    // omit null values
    params = _.omit(params, function(val) {
      return !val || val == '';
    });

    // removes previous params and
    // set object params as query params
    uri.search('')
      .setSearch(params);

    // updates url
    this.navigate(path + uri.search());
  }

});

module.exports = Router;
