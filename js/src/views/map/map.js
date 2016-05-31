var $ = require('jquery'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var MapView = Backbone.View.extend({

  el: '.js--map-container',

  options: {
    map: {
      center: [39.1, 4.5],
      zoom: 3,
      zoomControl: false,
      minZoom: 2,
      scrollWheelZoom: true,
      worldCopyJump: true
    },
    cartodb: {
      user_name: 'dhakelila',
      type: 'cartodb',
      noWrap: true,
      sublayers: [{
        sql: 'SELECT * FROM buildings_height',
        cartocss: '#buildings_height{  marker-fill-opacity: 0.9;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-placement: point;  marker-multi-policy: largest;  marker-type: ellipse;  marker-fill: #FF5C00;  marker-allow-overlap: true;  marker-clip: false;}#buildings_height [ height <= 829.8] {   marker-width: 25.0;}#buildings_height [ height <= 529.5] {   marker-width: 23.3;}#buildings_height [ height <= 392.5] {   marker-width: 21.7;}#buildings_height [ height <= 348] {   marker-width: 20.0;}#buildings_height [ height <= 257.5] {   marker-width: 18.3;}#buildings_height [ height <= 176.65] {   marker-width: 16.7;}#buildings_height [ height <= 164.5] {   marker-width: 15.0;}#buildings_height [ height <= 151.2] {   marker-width: 13.3;}#buildings_height [ height <= 130] {   marker-width: 11.7;}#buildings_height [ height <= 114.3] {   marker-width: 10.0;}',
        interactivity: 'city, built_name, height'
      }]
    }
  },

  initialize: function() {

    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.mobile = true;
        this.initViews();
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.mobile = false;
        this.initViews();
      },this)
    });
  },

  show: function() {
    this.initViews();
  },

  initViews: function() {
    /* this is the definition for basemap */
    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '<a href="https://www.mapzen.com/rights">Attribution.</a>. Data &copy;<a href="https://openstreetmap.org/copyright">OSM</a> contributors.'
    });

    /* Here we create the map with Leafleft... */
    this.map = L.map(this.el, this.options.map);
    /* ...and we add the basemap layer with Leaflet as well */
    this.map.addLayer(layer);
  }

});

module.exports = MapView;
