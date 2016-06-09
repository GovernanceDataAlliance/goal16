var Backbone = require('backbone');
var $ = require('jquery');
var  _ = require('lodash');
var URI = require('urijs');

var ViewManager = require('../lib/view_manager.js'),
  WelcomeView = require('../views/welcome/welcome.js'),
  MapView = require('../views/map/map.js'),
  MobileMenuView = require('../views/common/mobile_menu_view.js'),
  CompareView = require('../views/compare/compare.js'),
  CountryView = require('../views/countries/country.js'),
  CountriesView = require('../views/countries/countries.js');

var Router = Backbone.Router.extend({

  routes: {
    "(/)": "map",
    "map(/)": "map",
    "countries(/)": "countriesIndex",
    "countries/:params": "countriesShow",
    "compare(/)(:params)": "compareIndex"
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
    if (!this.views.hasView('index')) {
      var view = new MapView();
      this.views.addView('index', view);
    }

    var el = '.js--map-container';

    this.views.showView('index', el);
  },

  //COUNTRIES
  countriesIndex: function() {
    if (!this.views.hasView('index')) {
      var view = new CountriesView();
      this.views.addView('index', view);
    }

    var el = '.js--country-container';

    this.views.showView('index', el);
    this.setListenersCountries();
  },

  countriesShow: function(params) {
    console.log(params)
    console.log('countries');

    var configView = {
      iso: params.split("&")[0],
      year: params.split("&")[1] || null
    };

    if (!this.views.hasView('show')) {
      var view = new CountryView(configView);
      this.views.addView('show', view);
    } else {
      this.views.getView('show')._updateParams(configView)
    }

    this.views.showView('show');
    this.setListenersCountries();
  },


  setListenersCountries: function() {
      Backbone.Events.on('year:selected', this.updateParams, this);
    },

  //Update params
  updateParams: function(year) {
    this.year = year;
    this.updateUrl();
  },

  //Update URL
  updateUrl: function() {
    var stringYear = '',
      iso = window.location.hash.split('&')[0].slice(1);

    if (this.year) {
      stringYear = '&' + this.year;
    }

    this.navigate(iso + stringYear);
  },

  //COMPARE
  compareIndex: function(params) {
    var params =  URI("?" + window.location.hash.split("#")[1]).query(true);
    var data = {};


    if (params.countries) {
      var c = params.countries;
      data = c.split(',');
    }

    var el = '.js--compare-container';

    if (!this.views.hasView('compare')) {
      this.views.addView('compare', new CompareView(data));
    } else {
      this.views.getView('compare').update(data);
    }

    this.views.showView('compare', el);
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
