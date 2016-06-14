var Handlebars = require('handlebars');
var CartoDBCollection = require('../../lib/cartodb_collection.js');
var CONFIG = require('../../../config.json');

var indicatorsByTargetSQL = Handlebars.compile(require('../../queries/map/indicators_by_target.hbs'));

var IndicatorConfigs = CartoDBCollection.extend({

  indicators_table: CONFIG.cartodb.indicators_table,
  targets_table: CONFIG.cartodb.targets_table,

  //Gets all the inidcators grouped by target.
  getIndicatorsByTarget: function() {
    var query = indicatorsByTargetSQL({ indicators_table: this.indicators_table, targets_table: this.targets_table });
    url = this._urlForQuery(query);

    return this.fetch({url: url});
  }

});

module.exports = IndicatorConfigs;
