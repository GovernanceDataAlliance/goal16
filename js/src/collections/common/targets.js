var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var targetsListSQL = Handlebars.compile(require('../../queries/common/targets_list.hbs'));

var TargetsCollection = CartoDBCollection.extend({

  table: CONFIG.cartodb.targets_table,

  // list of all targets order by code
  getTargetsList: function() {
    var query = targetsListSQL({ table: this.table }),
      url = this._urlForQuery(query);

    return this.fetch({ url: url });
  }

});

module.exports = TargetsCollection;
