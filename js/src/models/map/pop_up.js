var Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  format = require('../../lib/format.js');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";
var CartoDBModel = require('../../lib/cartodb_model.js');

var CONFIG = require('../../../config.json');

var popUpTargetsSQL = Handlebars.compile(require('../../queries/map/pop_up_targets.hbs')),
    popUpIndicatorsSQL = Handlebars.compile(require('../../queries/map/pop_up_targets.hbs'));

var PopUp = CartoDBModel.extend({

  indicators_table: CONFIG.cartodb.indicators_table,
  target_table: CONFIG.cartodb.targets_table,
  user_name: CONFIG.cartodb.user_name,

  _url: function(query) {
    return format(BASE_URL, this.user_name) + "?q=" + query;
  },

  _getPopUpInfo: function(options) {
    console.log(options)
    var template = options.layerType === 'target' ? popUpTargetsSQL : popUpIndicatorsSQL;

    var query = template({
      indicators_table: this.indicators_table,
      targets_table: this.targets_table,
      slug: options.layer,
      lat: options.latLng.lat,
      lng: options.latLng.lng
    });

    var url = this._url(query);

    return this.fetch({url: url});
  }

});

module.exports = PopUp;

