var $ = require('jquery'), _ = require('lodash');

var CartoDBCollection = require('../../lib/cartodb_collection.js');
var CONFIG = require('../../../config.json');

var Handlebars = require('handlebars');

var countriesListSQL = Handlebars.compile(require('../../queries/countries/countries_list.hbs'));

var CountriesCollection = CartoDBCollection.extend({

  countries_table: CONFIG.cartodb.countries_table,

  // list of countries (no filters)
  getCountriesList: function() {
    var query = countriesListSQL({ countries_table: this.countries_table }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  },

  // get country information, once collection is loaded previously,
  // through an iso array
  getCountryData: function(isos) {
    var countries = [];

    if (isos.hasOwnProperty('length')) {

      isos.forEach(function(iso) {
        if (!iso) {
          countries.push(null);
          return;
        }

        var countryData = this.findWhere({ iso: iso });
        countries.push(countryData.toJSON());

      }.bind(this));

    } else {
      countries = this.findWhere({ iso: isos.iso }).toJSON();
    }

    return countries;
  },

  // list of countries by region
  getCountriesByRegion: function() {
    return _.groupBy(_.sortBy(this.toJSON(), 'region_name'), 'region_name');
  }

});

module.exports = new CountriesCollection();
