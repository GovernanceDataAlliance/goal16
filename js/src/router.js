var Backbone = require('backbone');
var $ = require('jquery');
var  _ = require('lodash');
var URI = require('urijs');

var ViewManager = require('./lib/view_manager.js'),
  MapView = require('./views/map/map.js'),
  MobileMenuView = require('./views/common/mobile_menu_view.js'),
  CompareView = require('./views/compare/compare.js'),
  CountriesView = require('./views/countries/countries.js'),
  CountryView = require('./views/countries/country.js');

var Router = Backbone.Router.extend({

  /*
   * Routes examples:
   * countries: countries?iso=GAB&year=2015
   * compare: compare?isoA=SPA&isoB=FRA&isoC=ENG
   */

  routes: {
    "(/)": "map",
    "map(/)": "map",
    "countries(/)(?iso=:iso)": "countries",
    "compare(/)(?isoA=:isoA)(&isoB=:isoB)(&isoC=:isoC)": "compare"
  },

  initialize: function(options) {
    this.commonViews();
  },

  //COMMON
  commonViews: function(){
    this.views = new ViewManager();
    new MobileMenuView();
  },

  //MAP
  map: function() {
    var view;

    if (!this.views.hasView('indexMap')) {
      view = new MapView();
      this.views.addView('indexMap', view);
    }
    this.views.showView('indexMap');
  },

  //COUNTRIES
  countries: function(iso) {
    var view;

    if (!iso) {

      if (!this.views.hasView('indexCountries')) {
        view = new CountriesView();
        this.views.addView('indexCountries', view);
      }
      this.views.showView('indexCountries');
    } else {

      if (!this.views.hasView('showCountries')) {
        view = new CountryView();
        this.views.addView('showCountries', view);
      } else {
        view = this.views.getView('showCountries');
      }

      view.status.set({ iso: iso });
      this.views.showView('showCountries');
    }
  },

  //COMPARE
  compare: function(isoA, isoB, isoC) {
    var view;

    if (!this.views.hasView('compare')) {
      view = new CompareView();
      this.views.addView('compare', view);
    } else {
      view = this.views.getView('compare');
    }

    var params = {
      isoA: isoA || null,
      isoB: isoB || null,
      isoC: isoC || null
    }

    view.status.set(params);
    this.views.showView('compare');
  },

  //Update URL
  _updateUrl: function(p) {
    var isCollection = false,
      url = 'countries=';

    if (typeof p.toJSON === 'function') {
      isCollection = true;
      params= p.toJSON();

      params = _.omit(params, function(p) {
        return !p.iso || p.iso == 'no_data' || !p.year || p.year == 'no-data';
      });

      totalData = _.size(params);

    } else {
      params = [];
      _.each(p, function(slide) {

        if(slide.status.get('iso') && slide.status.get('iso') !== 'no_data'
          && slide.status.get('year') && slide.status.get('year') !== 'no-data') {
          params.push(slide.status);
        }

      });

      totalData = params.length;
    }

    if (isCollection) {

      if(totalData == 0) {
        url = 'default';
      }

      _.each(params, function(country, i) {

        url +=  country.iso + ':' + country.year;

        if(Number(i) + 1 < totalData) {
          url += ',';
        }

      }.bind(this));

    } else {

      if(totalData == 0) {
        url = 'default';
      } else {
        url = 'countries=';
      }

      _.each(params, function(slide, i) {
        url += slide.get('iso') + ':' + slide.get('year');

        if(i + 1 < totalData) {
          url += ',';
        }
      });

    }
    this.navigate(url);
  }


});

module.exports = Router;
