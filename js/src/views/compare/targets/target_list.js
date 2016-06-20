var $ = require('jquery'),
  Backbone = require('backbone');

var ScoreCardView = require('./score_card');

var TargetsCollection = require('../../../collections/common/targets.js');

var TargetListView = Backbone.View.extend({

  id: 'js--target-list',
  className: 'target-list',

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

  resetScores: function() {
    this.scoreCardViews.forEach(function(card) {
      card.resetScores();
    });
  },

  toggleList: function() {
    this.$el.toggleClass('is-hidden');
  },

  showList: function() {
    this.$el.removeClass('is-hidden');
  },

  render: function() {
    this._getTargetList();

    this.scoreCardViews.forEach(function(card) {
      this.$el.append(card.render().el);
    }.bind(this));

    this.toggleList();

    return this;
  }

});

module.exports = TargetListView;
