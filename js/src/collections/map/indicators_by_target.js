var Handlebars = require('handlebars');
var _ = require('lodash');
var CartoDBCollection = require('../../lib/cartodb_collection.js');
var CONFIG = require('../../../config.json');

var SQL = Handlebars.compile(require('../../queries/map/indicators_by_target.hbs'));

var IndicatorConfigs = CartoDBCollection.extend({

  url: function() {
    var query = SQL();
    return this._urlForQuery(query);
  }

});

module.exports = IndicatorConfigs;
