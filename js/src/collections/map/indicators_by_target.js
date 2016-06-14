var Handlebars = require('handlebars');
var _ = require('lodash');
var CartoDBCollection = require('../../lib/cartodb_collection.js');
var CONFIG = require('../../../config.json');

var SQL = Handlebars.compile(require('../../queries/map/indicators_by_target.hbs'));

var IndicatorConfigs = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,

  url: function() {
    var query = SQL();
    return this._urlForQuery(query);
  },

  parse: function(data) {
    return data.rows;
  }

});

module.exports = IndicatorConfigs;
