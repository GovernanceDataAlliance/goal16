var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var IndicatorsCollection = CartoDBCollection.extend({

  indicators_table: CONFIG.cartodb.indicators_table

});

module.exports = IndicatorsCollection;
