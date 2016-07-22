var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  format = require('../../lib/format.js');

var BASE_URL = "http://{0}.cartodb.com/api/v2/sql";
var CartoDBModel = require('../../lib/cartodb_model.js');

var CONFIG = require('../../../config.json');

var layerTitleSQL = Handlebars.compile(require('../../queries/common/layer_title.hbs'));

var LayerNameModel = CartoDBModel.extend({

  indicators_table: CONFIG.cartodb.indicators_table,
  targets_table: CONFIG.cartodb.targets_table,
  user_name: CONFIG.cartodb.user_name,

  _url: function(query) {
    return format(BASE_URL, this.user_name) + "?q=" + query;
  },

  getTitle: function(slug) {
    var query = layerTitleSQL({
      indicators_table: this.indicators_table,
      targets_table: this.targets_table,
      slug: slug
    });

    var url = this._url(query);

    return this.fetch({url: url});
  }

});

module.exports = LayerNameModel;
