var $ = require('jquery'),
  Backbone = require('backbone');

var TargetCardView = require('./target_card');

var TargetListView = Backbone.View.extend({

  el: '#target-list',

  initialize: function(settings) {
    this.options = settings || {};

    this.cardViews = [];

    this._getTargetList();
  },

  _getTargetList: function() {
    var targets = this.options.targets;

    targets.forEach(function(target) {
      var cardView = this._getTargetCard(target);
      this.cardViews.push(cardView);
    }.bind(this));
  },

  _getTargetCard: function(target) {
    return new TargetCardView({
      countries: this.options.countries,
      target: target
    });
  },

  updateScores: function(settings) {
    var countries = settings.countries;
    this.cardViews.forEach(function(cardView) {
      cardView.options.countries = countries;
      cardView.updateScores();
    });
  },

  render: function() {
    this.cardViews.forEach(function(card) {
      this.$el.append(card.render().el);
    }.bind(this));

    return this;
  }

});

module.exports = TargetListView;
