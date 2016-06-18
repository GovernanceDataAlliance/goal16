var $ = require('jquery'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var targetLayerSQL = Handlebars.compile(require('../../queries/map/layer_target.hbs')),
    indicatorLayerSQL = Handlebars.compile(require('../../queries/map/layer_indicator.hbs'));

var PopUpView = require('./pop_up.js');

var status = require ('../../models/map/status.js');

var MapView = Backbone.View.extend({

  id: 'map-container',
  className: 'l-map',

  options: {
    basemap: 'https://api.tiles.mapbox.com/v4/goal16.9990f1b9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ29hbDE2IiwiYSI6ImNpcGgzaWwzbDAwMW52Mmt3ZG5tMnRwN3gifQ.-e8de3rW2J8gc2Iv3LzMnA',
    map: {
      center: [39.1, 4.5],
      zoom: 2,
      scrollWheelZoom: false,
      worldCopyJump: true
    },
    cartodb: {
      user_name: CONFIG.cartodb.user_name,
      noWrap: true,
      css: '#score_test{ polygon-fill: #82bf72; polygon-opacity: 0.7; line-color: #f6faf9; line-width: 0.5; line-opacity: 1; }'
    }
  },

  initialize: function() {
    this.status = status;
    this._setListeners();
  },

  show: function() {
    this._setView();
    this._initMap();
    this._setMapListeners();
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
    this.status.on('change:layer', _.bind(this._activeLayer, this))
    Backbone.Events.on('dashboard:change', _.bind(this._refreshMap, this))
  },

  _setMapListeners: function() {
    this.map.on('click', this._popUpSetUp.bind(this));

    this.map.on('zoomend', _.bind(this._onZoomMap, this));
    this.map.on('dragend', _.bind(this._onDragEndMap, this));
  },

  _popUpSetUp: function(e) {
    this.popUp = new PopUpView({
      layer: this.status.get('layer'),
      latLng: e.latlng,
      map: this.map,
      zoom: this.map.getZoom(),
      mobile: this.mobile
    });
  },

  _onDragEndMap: function() {
    var position = this.map.getCenter();
    this.status.set({
      lat: position.lat,
      lng: position.lng
    });
  },

  _onZoomMap: function() {
    var zoom = this.map.getZoom();
    this.status.set({ zoom });
  },

  _initMap: function() {
    /* this is the definition for basemap */
    var baseMap = L.tileLayer(this.options.basemap, {
      attribution: '<a href="https://www.mapzen.com/rights">Attribution.</a>. Data &copy;<a href="https://openstreetmap.org/copyright">OSM</a> contributors.'
    });
    /* Here we create the map with Leafleft... */
    this.map = L.map(this.el, this.options.map);
    /* ...and we add the basemap layer with Leaflet as well */
    this.map.addLayer(baseMap);

    return this;
  },

  _refreshMap: function() {
    this.map.invalidateSize();
  },

  _activeLayer: function() {
    this._createLayer().done(_.bind(function() {
      //We remove the previous layer just when the new one arrive.
      //This way, we are sure we only have one layer at a time.

      this._addLayer();
    }, this));
  },

  _createLayer: function() {
    var sql = this._getLayerQuery();
    var cartoAccount = this.options.cartodb.user_name;
    var cartoCss = this.options.cartodb.css || '#table_score_test{ polygon-fill: #FF6600; polygon-opacity: 0.7; line-color: #FFF; line-width: 0.5; line-opacity: 1; }';
    var deferred = $.Deferred();

    var request = {
      layers: [{
        'user_name': cartoAccount,
        'type': 'cartodb',
        'options': {
          'sql': sql,
          'cartocss': cartoCss,
          'cartocss_version': '2.3.0'
        }
      }]
    };

    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      url: 'http://'+ cartoAccount +'.cartodb.com/api/v1/map/',
      data: JSON.stringify(request),
    }).done(data => {
      var tileUrl = 'http://'+ cartoAccount +'.cartodb.com/api/v1/map/'+ data.layergroupid + '/{z}/{x}/{y}.png32';
      this._removeLayer();
      this.layer = L.tileLayer(tileUrl, { noWrap: true });
      return deferred.resolve();
    });

    return deferred;
  },

  _addLayer: function() {
    this.layer.addTo(this.map);
  },

  _removeLayer: function() {
    //TODO - Use something to be sure we are appending the right
    //layer. TimeStamp, loader...
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }
  },

  _getLayerQuery: function() {
    var query;
    var layer = this.status.get('layer');
    var type = this.status.get('layerType');

    if (type === 'target') {
      query = targetLayerSQL({layer: layer})
    } else {
      query = indicatorLayerSQL({layer: layer})
    }

    // return query;

    // We are temporary returning this because we do not have data.
    return 'SELECT * FROM score_test';
  }

});

module.exports = MapView;
