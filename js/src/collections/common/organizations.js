var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var OrganizationsCollection = CartoDBCollection.extend({

  scores_table: CONFIG.cartodb.organizations_table

});

module.exports = OrganizationsCollection;
