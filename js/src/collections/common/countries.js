var $ = require('jquery'), _ = require('lodash');

var CartoDBCollection = require('../../lib/cartodb_collection.js');
var CONFIG = require('../../../config.json');

var Handlebars = require('handlebars');

var countriesListSQL = Handlebars.compile(require('../../queries/common/countries_list_sql.hbs'));

var Countries = CartoDBCollection.extend({
  user_name: CONFIG.cartodb.user_name,
  table: CONFIG.cartodb.country_table_name,

  url: function() {
    var query = countriesListSQL({ table: this.table });
    return this._urlForQuery(query);
  },

  //For general list at /countries.
  groupByRegion: function() {
    return _.groupBy(_.sortBy(this.toJSON(), 'region_name'), 'region_name');
  },


  /*
   * Adding color schema.
   */
  parse: function(rawData) {

  }
});

module.exports = Countries;
