var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars'),
    _ = require('lodash');

var CONFIG = require('../../../config.json');

var indicatorsByTargetSQL = Handlebars.compile(require('../../queries/common/indicators_by_target.hbs')),
    targetOfIndicatorSQL = Handlebars.compile(require('../../queries/common/target_of_indicator.hbs')),
    allIndicatorsSQL = Handlebars.compile(require('../../queries/indicators/all_indicators.hbs')),
    indicatorsByCountrytSQL = Handlebars.compile(require('../../queries/indicators/indicators_by_country.hbs'));

var IndicatorsCollection = CartoDBCollection.extend({

  targets_table: CONFIG.cartodb.targets_table,
  indicators_table: CONFIG.cartodb.indicators_table,
  scores_table: CONFIG.cartodb.scores_table,
  sources_table: CONFIG.cartodb.sources_table,

  // Get all indicators for a country
  getAllIndicatorsByCountry: function(iso) {
    var query = indicatorsByCountrytSQL({
      iso: iso,
      indicators_table: this.indicators_table,
      scores_table: this.scores_table,
      sources_table: this.sources_table,
      targets_table: this.targets_table
    }),
    url = this._urlForQuery(query);

    return this.fetch({ url: url });
  },

  getAllIndicatorsByCountryonCSV: function(iso) {
    var query = indicatorsByCountrytSQL({
      iso: iso,
      indicators_table: this.indicators_table,
      scores_table: this.scores_table,
      sources_table: this.sources_table,
      targets_table: this.targets_table
    }),
    queryOptions = '&format=csv&filename=indicators_for_' + iso,
    url = this._urlForQuery(query);

    url+=queryOptions;

    return url;
  },

  // list of all indicators for a target
  getInidcatorsByTarget: function(targetSlug) {
    var query = indicatorsByTargetSQL({ table: this.indicators_table, slug: targetSlug }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  },

  getAllIndicators: function() {
    var query = allIndicatorsSQL({
      indicators_table: this.indicators_table ,
      sources_table: this.sources_table
    }),
    url = this._urlForQuery(query);

    return this.fetch({ url: url });
  },

  groupByType: function() {
    return _.groupBy(this.toJSON(), 'type');
  },

  groupByTarget: function() {
    return _.groupBy(this.toJSON(), 'target_slug');
  },

  getTargetOfIndicator: function(indicatorSlug) {
    var query = targetOfIndicatorSQL({ table: this.indicators_table, slug: indicatorSlug }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  }

});

module.exports = IndicatorsCollection;
