var $ = require('jquery'), _ = require('lodash');

var CartoDBCollection = require('../../lib/cartodb_collection.js');
var CONFIG = require('../../../config.json');

var Handlebars = require('handlebars');

var countriesListSQL = Handlebars.compile(require('../../queries/common/countries_list.hbs'));

var CountriesCollection = CartoDBCollection.extend({

  table: CONFIG.cartodb.countries_table,

  // list of countries (no filters)
  getCountriesList: function() {
    var query = countriesListSQL({ table: this.table }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  },

  // list of countries by region
  getCountriesByRegion: function() {
    return _.groupBy(_.sortBy(this.toJSON(), 'region_name'), 'region_name');
  }

});

module.exports = CountriesCollection;
