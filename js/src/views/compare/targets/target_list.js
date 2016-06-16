var $ = require('jquery'),
  Backbone = require('backbone');

var ScoreCardView = require('./score_card');

var TargetsCollection = require('../../../collections/common/targets.js');

var TargetListView = Backbone.View.extend({

  id: 'target-list',

  initialize: function(settings) {
    this.options = settings || {};
    this.status = this.options.status;

    this.scoreCardViews = [];

    this.targetsCollection = TargetsCollection;
  },

  _getTargetList: function() {
    var targets = this.targetsCollection.toArray();

    targets.forEach(function(target) {
      var cardView = new ScoreCardView({
        status: this.status,
        target: target.toJSON()
      });

      this.scoreCardViews.push(cardView);

    }.bind(this));
  },

  updateScores: function() {
    this.scoreCardViews.forEach(function(card) {
      card.updateScores();
    });
  },

  showTargets: function() {
    if (this.$el.hasClass('is-hidden')) {
      this.$el.removeClass('is-hidden');
    }
  },

  render: function() {
    this._getTargetList();

    this.scoreCardViews.forEach(function(card) {
      this.$el.append(card.render().el);
    }.bind(this));

    return this;
  }

});

module.exports = TargetListView;
