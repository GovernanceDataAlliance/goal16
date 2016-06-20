var Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  format = require('../../lib/format.js');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";
var CartoDBModel = require('../../lib/cartodb_model.js');

var popUpSQL = Handlebars.compile(require('../../queries/map/pop_up.hbs'));

var PopUp = CartoDBModel.extend({

  _getQuery: function() {
    return popUpSQL();
  },

});

module.exports = PopUp;
