var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var GeomsQueryByTarget = Handlebars.compile(require('../../queries/map/layer_target.hbs')),
  GeomsQueryByIndicator = Handlebars.compile(require('../../queries/map/layer_indicator.hbs'));

var GeometriesCollection = CartoDBCollection.extend({

  indicators_table: CONFIG.cartodb.indicators_table,
  scores_table: CONFIG.cartodb.scores_table,
  sources_table: CONFIG.cartodb.sources_table,

  getGeomsQueryByTarget: function(settings) {
    var query = GeomsQueryByTarget({
      slug: settings.layer
    }),
    queryOptions = '&format=topojson&filename=geoms_' + settings.layer;
    url = this._urlForQuery(query);

    url+= queryOptions;

    return url;
  },

  getGeomsQueryByIndicator: function(settings) {
    var query = GeomsQueryByIndicator({
      slug: settings.layer
    }),
    queryOptions = '&format=topojson&filename=geoms_' + settings.layer;
    url = this._urlForQuery(query);

    url+= queryOptions;

    return url;
  },

});

module.exports = GeometriesCollection;
