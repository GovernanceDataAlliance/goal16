var $ = require('jquery'),
  Backbone = require('backbone');

var TargetCardView = require('./target_card');

var TargetListView = Backbone.View.extend({

  el: '#target-list',

  initialize: function(settings) {
    this.options = settings || {};
  },

  _getTargetList: function() {
    var targets = this.options.targets,
      cards = [];

    targets.forEach(function(target) {
      var cardView = this._getTargetCard(target);
      cards.push(cardView);
    }.bind(this));

    return cards;
  },

  _getTargetCard: function(cardOptions) {
    return new TargetCardView({
      cardOptions: cardOptions,
      countries: this.options.countries
    });
  },

  render: function() {
    var cardViews = this._getTargetList();

    cardViews.forEach(function(card) {
      this.$el.append(card.render().el);
    }.bind(this));

    return this;
  }

});

module.exports = TargetListView;
