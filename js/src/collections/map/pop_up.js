var Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  format = require('../../lib/format.js');

var BASE_URL = "https://{0}.cartodb.com/api/v2/sql";
var CartoDBCollection = require('../../lib/cartodb_model.js');

var CONFIG = require('../../../config.json');

var popUpTargetsSQL = Handlebars.compile(require('../../queries/map/pop_up_targets.hbs')),
    popUpIndicatorsSQL = Handlebars.compile(require('../../queries/map/pop_up_indicators.hbs'));

var PopUp = CartoDBCollection.extend({

  indicators_table: CONFIG.cartodb.indicators_table,
  countries_table: CONFIG.cartodb.countries_table,
  scores_table: CONFIG.cartodb.scores_table,
  user_name: CONFIG.cartodb.user_name,

  _url: function(query) {
    return format(BASE_URL, this.user_name) + "?q=" + query;
  },

  getPopUpInfo: function(options) {
    var template = options.layerType === 'target' ? popUpTargetsSQL : popUpIndicatorsSQL;

    var query = template({
      indicators_table: this.indicators_table,
      countries_table: this.countries_table,
      scores_table: this.scores_table,
      slug: options.layer,
      lat: options.latLng.lat,
      lng: options.latLng.lng
    });

    var url = this._url(query);

    return this.fetch({url: url});
  },

  parse: function(data) {
    return data.rows;
  }

});

module.exports = PopUp;

