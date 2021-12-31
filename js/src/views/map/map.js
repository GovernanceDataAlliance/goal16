var $ = require('jquery'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  cartodbProj = require('../../lib/cartodb.proj');

var CONFIG = require('../../../config.json');

var targetLayerSQL = Handlebars.compile(require('../../queries/map/layer_target.hbs')),
    indicatorLayerSQL = Handlebars.compile(require('../../queries/map/layer_indicator.hbs')),
    baseMapSQL = Handlebars.compile(require('../../queries/map/basemap.hbs')),
    baseMapLabelsSQL = Handlebars.compile(require('../../queries/map/labels.hbs'));

var PopUpView = require('./pop_up.js'),
    InfoWindowView = require('../common/infowindow.js'),
    MapLegendview = require('./map_legend.js'),
    ShareWindowView = require('../common/share_window.js');

var status = require ('../../models/map/status.js');

var MapView = Backbone.View.extend({

  id: 'map-container',
  className: 'l-map',

  options: {
    legend: false,
    basemap: 'https://api.tiles.mapbox.com/v4/goal16.9990f1b9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ29hbDE2IiwiYSI6ImNpcGgzaWwzbDAwMW52Mmt3ZG5tMnRwN3gifQ.-e8de3rW2J8gc2Iv3LzMnA',
    // basemap: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    labelsBasemap: 'https://api.tiles.mapbox.com/v4/goal16-labels.d9258038/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiZ29hbDE2LWxhYmVscyIsImEiOiJjaXExMGkzdHQwMDJqaHJuZG94bjAxZ2U4In0.Kdmmeqv8zSGz6F4NJ6bh5w',
    map: {
      center: [11, 4.5],
      zoom: 2,
      scrollWheelZoom: false
    },
    cartodb: {
      user_name: CONFIG.cartodb.user_name,
      noWrap: true,
      cartocss: {
        basemap: '#countries{ polygon-pattern-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/goal16/assets/20160817151317p5_green.png); line-color: #eee; line-width: 0.5; line-opacity: 1;}',
        labels: '@sans: "Open Sans Semibold"; @sans_bold: "Open Sans Bold";@name:"[name]"; @halo_light:#96bf93; @text_light:#FFFFFF; #country_label::countries_labels[zoom>=3][type="countries"] {text-name: @name;text-face-name: @sans;  text-size: 10; text-transform: capitalize; text-wrap-width: 50; text-halo-radius: 0.85; text-halo-fill: @halo_light; text-fill: @text_light; text-align: center; text-clip: false; text-character-spacing: 2;text-opacity: 1; [zoom<=3] [width<500000]{ text-size: 10; text-name: [code];} [zoom<=4] [width<400000]{ text-size: 12; text-name: [code];}[zoom>=5]{text-size: 14;}[zoom>=6]{ text-size: 16; } [zoom>=7]{ text-size: 18; } } #ne_110m_geography_marine_polys::marine_labels[scalerank = 0][type="marine"]{ text-name: @name; text-face-name: @sans_bold; text-placement: point; text-wrap-width: 50; text-transform: capitalize; text-wrap-before: true; text-fill: rgba(128, 147, 151, 0.15); text-opacity: 1; [zoom = 3] { text-size: 20; text-character-spacing: 8; text-line-spacing: 8; } [zoom = 4] { text-size: 25; text-character-spacing: 16; text-line-spacing: 16; } [zoom = 5] { text-size: 30; text-character-spacing: 20; text-line-spacing: 32; }}',
        indicator: '#score{ polygon-pattern-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/goal16/assets/20160711093427color100.png); line-color: #eee; line-width: 0.5; line-opacity: 1;}',
        target: "@100: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/goal16/assets/20160711134917color100%20%281%29.png); @75: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/goal16/assets/20160711134906color75%20%281%29.png); @50:url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/goal16/assets/20160711134858color50%20%281%29.png); @25: url(http://s3.amazonaws.com/com.cartodb.users-assets.production/production/goal16/assets/20160711134847green25%20%281%29.png); #indicators{ polygon-fill: transparent; line-color: #eee; line-width: 1.5; line-opacity: 1; [ score <= 100] { polygon-pattern-file: @100;} [ score <= 75] { polygon-pattern-file: @75;} [ score <= 50] { polygon-pattern-file: @50;} [ score <= 25] { polygon-pattern-file: @25;}}"
      }
    },
    shareWindow: {
      isMap: true
    }
  },

  initialize: function() {
    this.status = status;
  },

  updateMapParams: function() {
    this.options.map.zoom = this.status.get('zoom') || this.options.map.zoom;
    this.options.map.center = this.status.get('lat') && this.status.get('lng') ? [this.status.get('lat'), this.status.get('lng')] : this.options.map.center;
  },

  setMapLayer: function() {
    if (this.status.get('layer')) {
      this.$el.addClass('is-loading -map');
      this._activeLayer();
    }
  },

  show: function() {
    this._setView();
    this._initMap();

    this._setListeners();
    this._setMapListeners();

    // views
    this.shareWindowView;
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
    this.status.on('change:layer', _.bind(this._activeLayer, this));
    this.status.on('change:zoom', _.bind(this._updateMapZoom, this));
    this.status.on('change:lat', _.bind(this._updateMapCenter, this));
    this.status.on('change:lng', _.bind(this._updateMapCenter, this));
    Backbone.Events.on('dashboard:change', _.bind(this._refreshMap, this))
  },

  _setMapListeners: function() {
    this.map.on('click', this._popUpSetUp.bind(this));

    this.map.on('zoomend', _.bind(this._onZoomMap, this));
    this.map.on('dragend', _.bind(this._onDragEndMap, this));
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _popUpSetUp: function(e) {
    this.popUp = new PopUpView({
      layer: this.status.get('layer'),
      layerType: this.status.get('layerType'),
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
    this._updateRouterParams();
  },

  _onZoomMap: function() {
    var zoom = this.map.getZoom();
    this.status.set({zoom: zoom});
    this._updateRouterParams();
  },

  _updateMapZoom: function() {
    this.map.setZoom( this.status.get(this.status.get('zoom')) );
  },

  _updateMapCenter: function() {
    this.map.setView( [this.status.get('lat'), this.status.get('lng') ] );
  },

  _initMap: function() {
    // use proj4 text for desired SRID
    this.options.map.crs =  cartodbProj('+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +a=6371007 +b=6371007 +units=m +no_defs');

    /* Here we create the map with Leafleft... */
    this.map = L.map(this.el, this.options.map);

    this._getBasemapLayer().done(function(){
      this.map.addLayer(this.baseMap);
      this.baseMap.setZIndex(1);
    }.bind(this));

    this._getBasemapLayer('labels').done(function(){
      this.map.addLayer(this.baseMapLabels);
      this.baseMapLabels.setZIndex(2000);
    }.bind(this));

    return this;
  },

  _getBasemapLayer: function(labels) {
    var sql, cartoCss;
    var cartoAccount = this.options.cartodb.user_name;
    var deferred = $.Deferred();

    if (labels) {
      sql = baseMapLabelsSQL();
      cartoCss = this.options.cartodb.cartocss['labels'];
    } else {
      sql = baseMapSQL();
      cartoCss = this.options.cartodb.cartocss['basemap'];
    }

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
      crossOrigin: true,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      url: 'https://'+ cartoAccount +'.carto.com/api/v1/map/',
      data: JSON.stringify(request),
    }).done(_.bind(function(data) {
          var tileUrl = 'https://'+ cartoAccount +'.carto.com/api/v1/map/'+ data.layergroupid + '/{z}/{x}/{y}.png';
          if (labels) {
            this.baseMapLabels = L.tileLayer(tileUrl, { noWrap: true, https: true });
          } else {
            this.baseMap = L.tileLayer(tileUrl, { noWrap: true, https: true });
          }
          return deferred.resolve();
        }, this));

    return deferred;
  },

  _refreshMap: function() {
    var timer;

    clearTimeout(timer);
    timer = setTimeout(function(){
      this.map.invalidateSize();
    }.bind(this), 150);
  },

  _activeLayer: function() {
    if (this.status.get('layer')) {
      this._createLayer().done(_.bind(function() {
        this._addLayer();
      }, this));
    } else {
      this._removeLayer();
      this.options.legend = !this.options.legend;
      this.legend.hide();
    }
  },

  _createLayer: function() {
    var sql = this._getLayerQuery();
    var cartoAccount = this.options.cartodb.user_name;
    var type = this.status.get('layerType');
    var cartoCss = this.options.cartodb.cartocss[type];
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
      crossOrigin: true,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      url: 'https://'+ cartoAccount +'.carto.com/api/v1/map/',
      data: JSON.stringify(request),
    }).done(_.bind(function(data) {
          var tileUrl = 'https://'+ cartoAccount +'.carto.com/api/v1/map/'+ data.layergroupid + '/{z}/{x}/{y}.png';
          this._removeLayer();
          this.layer = L.tileLayer(tileUrl, { noWrap: true, https: true });
          return deferred.resolve();
        }, this));

    return deferred;
  },

  _addLayer: function() {
    var timeOut;

    this.layer.addTo(this.map);
    this.layer.setZIndex(100);

    clearTimeout(timeOut);
    timeOut = setTimeout(function(){
      this.$el.removeClass('is-loading -map');
    }.bind(this), 400)


    if (!this.options.legend) {
      this.legend = new MapLegendview();
      this.options.legend = !this.options.legend;
    }
  },

  _removeLayer: function() {
    Backbone.Events.trigger('popUp:close');
    //TODO - Use something to be sure we are appending the right
    //layer. TimeStamp, loader...
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }
  },

  _getLayerQuery: function() {
    var layer = this.status.get('layer');
    var type = this.status.get('layerType');
    var options = {
      slug: layer
    };

    var query = type === 'target' ? targetLayerSQL(options) : indicatorLayerSQL(options);

    return query;
  },

  _share: function(e) {
    e && e.stopPropagation();

    var shareOptions = this.options.shareWindow,
      layerType = this.status.get('layerType'),
      layer = this.status.get('layer');

    _.extend(shareOptions, {
      type: layerType,
      layer: layer
    });

    this.shareWindowView =  new ShareWindowView(shareOptions)
    this.shareWindowView.render();
    this.shareWindowView.delegateEvents();
  },

  render: function() {
    $('#content').append('<button class="js--btn-share c-btn-share"><svg class="icon-share"><use xlink:href="#icon-share"></use></svg></button>');
    $('.js--btn-share').on('click', this._share.bind(this));
    return this;
  }

});

module.exports = MapView;
