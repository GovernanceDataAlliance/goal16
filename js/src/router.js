var Backbone = require('backbone'),
  URI = require('urijs');

var ViewManager = require('./lib/view_manager.js'),
  MapView = require('./views/map/map.js'),
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
    "compare(/)(?isoA=:isoA)(&isoB=:isoB)(&isoC=:isoC)": "compare"
  },

  initialize: function() {
    this.viewManager = new ViewManager();

    this.commonViews();
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
  compare: function(isoA, isoB, isoC) {
    var view;

    if (!this.viewManager.hasView('compare')) {
      this.viewManager.addView('compare', CompareView);
    }

    view = this.viewManager.getView('compare');

    var params = {
      isoA: isoA || null,
      isoB: isoB || null,
      isoC: isoC || null
    };

    this.viewManager.showView('compare');
    view.status.set(params);
  }

});

module.exports = Router;
