var  $ = require('jquery'),
    _ = require('lodash'),
    Backbone = require('backbone'),
    format = require('./format.js');

var CONFIG = require('../../config.json');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";

var CartoDBCollection = Backbone.Collection.extend({

  user_name: CONFIG.cartodb.user_name,

  url: function() {
    return this._urlForQuery(this._getQuery());
  },

  _urlForQuery: function(query) {
    return format(BASE_URL, this.user_name) + "?q=" + query;
  },

  _getQuery: function() {
    var columns = "*";

    if (this.columns !== undefined && this.columns.length > 0) {
      columns = this.columns.join(", ");
    }

    return format("SELECT {0} FROM {1}", columns, this.table);
  },

  isEmpty: function() {
    return _.compact(_.values(this.toJSON())).length > 0 ? false : true;
  },

  parse: function(data) {
    return data.rows;
  }

});

module.exports = CartoDBCollection;
