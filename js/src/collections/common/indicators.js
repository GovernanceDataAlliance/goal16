var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars'),
    _ = require('lodash');

var CONFIG = require('../../../config.json');

var indicatorsByTargetSQL = Handlebars.compile(require('../../queries/common/indicators_by_target.hbs')),
    targetOfIndicatorSQL = Handlebars.compile(require('../../queries/common/target_of_indicator.hbs'))

var IndicatorsCollection = CartoDBCollection.extend({

  indicators_table: CONFIG.cartodb.indicators_table,

  // list of all indicators for a target
  getInidcatorsByTarget: function(targetSlug) {
    var query = indicatorsByTargetSQL({ table: this.indicators_table, slug: targetSlug }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  },

  groupByType: function() {
    return _.groupBy(this.toJSON(), 'type');
  },

  getTargetOfIndicator: function(indicatorSlug) {
    var query = targetOfIndicatorSQL({ table: this.indicators_table, slug: indicatorSlug }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  }

});

module.exports = IndicatorsCollection;
