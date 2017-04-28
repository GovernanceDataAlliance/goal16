var _ = require('lodash'),
  Backbone = require('backbone'),
  URI = require('urijs');

var ViewManager = require('./lib/view_manager.js'),
  MobileMenuView = require('./views/common/mobile_menu_view.js'),
  WelcomeView = require('./views/welcome/welcome.js'),
  LocalesView = require('./views/welcome/locales.js'),
  MapView = require('./views/map/map.js'),
  DashboardView = require('./views/map/dashboard.js'),
  CompareView = require('./views/compare/compare.js'),
  DataView = require('./views/data/data.js'),
  AboutView = require('./views/about/about.js'),
  BlogView = require('./views/blog/blog.js'),
  CountriesListView = require('./views/countries/countries-list/countries.js'),
  CountryView = require('./views/countries/country/country.js');
  InfowindowView = require('./views/common/infowindow.js');

var Router = Backbone.Router.extend({

  /*
   * Routes examples:
   * countries: countries?iso=GAB
   * compare: compare?isoA=SPA&isoB=FRA&isoC=ENG
   * map: map?layer=layer-slug&layerType=layer-type&iso=iso
   * data: data?indicator=indicator-slug
   */

  routes: {
    "(/)": "welcome",
    "(es/)": "locales",
    "map(/)(?layerType=:type)(&layer=:layer)(&zoom=:zoom)(&center=:center)": "map",
    "countries(/)(?iso=:iso)": "countries",
    "compare(/)": "compare",
    "data(/)(?indicator=:indicator)": "data",
    "about(/)": "about",
    "blog(/)(*actions)": "blog"
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

  //WELCOME
  welcome: function() {
    if (!this.viewManager.hasView('welcome')) {
      this.viewManager.addView('welcome', WelcomeView);
    }

    this.viewManager.showView('welcome');
  },

  //MAP
  map: function() {
    var view;

    var uri = new URI(window.location),
        params = uri.search(true);

    if (!this.viewManager.hasView('map')) {
      this.viewManager.addView('map', MapView);
    }

    if (!this.viewManager.hasView('dashboard')) {
      this.viewManager.addView('dashboard', DashboardView);
    }

    /*
     We are setting two views in this point, but as they are sharing status,
     I can pick any of them to set the params in.
    */
    view = this.viewManager.getView('map');
    view.status.set(params);

    /*
     As we need map params before set the map,
     but we need to set the layer after the map
     has been created, I have to create two methods for that.
     One here and the other after the 'showView' method
    */
    view.updateMapParams();

    this._setMapDisclaimer();

    this.viewManager.showView('dashboard');
    this.viewManager.showView('map');

    view.setMapLayer();
  },

  _setMapDisclaimer: function() {
    if (!sessionStorage.getItem('alreadyBeenHere')) {
      var options = {
        type: 'map-disclaimer'
      }
      this.disclaimer = new InfowindowView(options);
      sessionStorage.setItem('alreadyBeenHere', true);
    }
  },

  //COUNTRIES
  countries: function(iso) {
    var view;

    if (!iso) {

      if (!this.viewManager.hasView('countries')) {
        this.viewManager.addView('countries', CountriesListView);
      }

      this.viewManager.showView('countries');

    } else {

      if (!this.viewManager.hasView('country')) {
        this.viewManager.addView('country', CountryView);
      }

      view = this.viewManager.getView('country');

      view.status.set({ iso: iso });
      this.viewManager.showView('country');
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

    view.status.set(params);

    this.viewManager.showView('compare');
  },

  // Receives the status (Backbone Model only) of the current view.
  // Updates the URL silently.
  _updateParams: function(status) {
    var params = status.toJSON(),
      uri = new URI(window.location),
      //Careful with this. In pro we have extra params into the path that we should avoid re-append to the url.
      path = SITEURL ? uri.path().split('/')[2] : uri.path().split('/')[1];

    // omit null values
    params = _.omit(params, function(val) {
      return !val || val == '';
    });

    // removes previous params and
    // set object params as query params
    uri.search('')
      .setSearch(params);

    // updates url
    this.navigate(path + '/' + uri.search());
  },

  //DATA
  data: function() {
    var view;

    var uri = new URI(window.location),
        params = uri.search(true);

    if (!this.viewManager.hasView('data')) {
      this.viewManager.addView('data', DataView);
    }

    view = this.viewManager.getView('data');
    view.status.set(params);

    this.viewManager.showView('data');
  },

  // ABOUT
  about: function() {
    if (!this.viewManager.hasView('about')) {
      this.viewManager.addView('about', AboutView);
    }

    view = this.viewManager.getView('about');

    this.viewManager.showView('about');
  },

  // BLOG
  blog: function() {
    if (!this.viewManager.hasView('blog')) {
      this.viewManager.addView('blog', BlogView);
    }

    view = this.viewManager.getView('blog');

    this.viewManager.showView('blog');
  },

  //LOCALES
  locales: function() {
    if (!this.viewManager.hasView('locales')) {
      this.viewManager.addView('locales', LocalesView);
    }

    view = this.viewManager.getView('locales');

    this.viewManager.showView('locales');
  }

});

module.exports = Router;
