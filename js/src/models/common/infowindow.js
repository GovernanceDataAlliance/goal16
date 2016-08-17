var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  format = require('../../lib/format.js');

var BASE_URL = "https://{0}.cartodb.com/api/v2/sql";
var CartoDBModel = require('../../lib/cartodb_model.js');

var CONFIG = require('../../../config.json');

var infoIndicatorSQL = Handlebars.compile(require('../../queries/common/indicator_info.hbs'));

var InfowindowModel = CartoDBModel.extend({

  indicators_table: CONFIG.cartodb.indicators_table,
  user_name: CONFIG.cartodb.user_name,

  _url: function(query) {
    return format(BASE_URL, this.user_name) + "?q=" + query;
  },

  _getIndicatorInfo: function(slug) {
    var query = infoIndicatorSQL({
      table: this.indicators_table,
      indicator_slug: slug
    });

    var url = this._url(query);

    return this.fetch({url: url});
  }

});

module.exports = InfowindowModel;
