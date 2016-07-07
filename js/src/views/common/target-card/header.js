var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var template = require('../../../templates/common/target-card/header.hbs');

var TargetCardHeaderView = Backbone.View.extend({

  className: 'c-target-card',

  events: {
    'click .js--target-info': '_toggleCard'
  },

  template: Handlebars.compile(template),

  initialize: function(settings) {
    this.options = settings || {};

    this.id = this.options.target.slug;
  },

  _setListeners: function() {
    var cardView = this.options.cardView;

    cardView.on('card:reset', this._resetCard.bind(this));
  },

  _setVars: function() {
    this.$closeBtn = this.$el.find('.icon-close');
    this.$openBtn = this.$el.find('.icon-open_arrow')
    this.$scoresTable = this.$el.find('.js--score-container');
  },

  _toggleCard: function() {
    this.$scoresTable.toggleClass('is-closed');

    this.$closeBtn.toggleClass('is-hidden');
    this.$openBtn.toggleClass('is-hidden');

    this.trigger('toggle:card');
  },

  _resetCard: function() {
    this.$scoresTable.addClass('is-closed');

    this.$closeBtn.addClass('is-hidden');
    this.$openBtn.removeClass('is-hidden');
  },

  render: function() {
    var target = this.options.target;

    this.$el.append(this.template({
      target: target
    }));

    this._setVars();

    this._setListeners();

    return this;
  }

});

module.exports = TargetCardHeaderView;
