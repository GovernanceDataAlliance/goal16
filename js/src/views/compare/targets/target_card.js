var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var TargetCardTemplate = require('../../../templates/compare/targets/target_card.hbs');

var TargetCardView = Backbone.View.extend({

  tagName: 'article',
  className: 'c-target-card',

  template: Handlebars.compile(TargetCardTemplate),

  events: {
    'click .more-info' : '_openModal',
    'click .toggle-card' : '_toggleCard'
  },

  initialize: function(settings) {
    this.options = settings || {};
    console.log(this.options);

    this.el.id = this.options.cardOptions.slug;
  },

  _openModal: function() {},

  _toggleCard: function() {},

  render: function() {
    this.$el.html(this.template({
      cardOptions: this.options.cardOptions
    }));

    return this;
  }

});

module.exports = TargetCardView;
