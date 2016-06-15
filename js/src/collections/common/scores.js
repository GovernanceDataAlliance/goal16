var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var ScoresCollection = CartoDBCollection.extend({

  scores_table: CONFIG.cartodb.scores_table

});

module.exports = ScoresCollection;
