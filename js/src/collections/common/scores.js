var CartoDBCollection = require('../../lib/cartodb_collection.js');
var Handlebars = require('handlebars');

var CONFIG = require('../../../config.json');

var ScoresGroupByTargetSQL = Handlebars.compile(require('../../queries/scores/scores_by_target.hbs'));

var ScoresCollection = CartoDBCollection.extend({

  scores_table: CONFIG.cartodb.scores_table,
  indicators_table: CONFIG.cartodb.indicators_table,

  getScoresGroupByTarget: function(settings) {
    var query = ScoresGroupByTargetSQL({
      indicators_table: this.indicators_table,
      scores_table: this.scores_table,
      countries_conditional: null,
      target_slug: settings.target_slug,
    }),
    url = this._urlForQuery(query);

    return this.fetch({ url: url });
  }

});

module.exports = ScoresCollection;
