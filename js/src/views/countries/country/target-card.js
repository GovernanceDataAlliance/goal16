var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');


var template = require('../../../templates/countries/country/indicator-card.hbs');

var IndicatorCardView = Backbone.View.extend({

  className: 'l-target-card',

  template: Handlebars.compile(template),

  initialize: function(settings) {
    this.options = settings || {};

    console.log(this.options);

    this.status = this.options.status;
    this.id = this.options.target.slug;
  },

  _getIndicatorsByType: function() {
    var officialIndicators = null,
      shadowIndicators = null;
    var indicatorsByType = _.groupBy(this.options.indicators, function(indicator) {
      return indicator.type;
    });

    if (indicatorsByType.hasOwnProperty('official')) {
      officialIndicators = indicatorsByType['official']
    }

    if (indicatorsByType.hasOwnProperty('shadow')) {
      shadowIndicators = indicatorsByType['shadow'];
    }

    return [officialIndicators, shadowIndicators];
  },

  render: function() {
    var target = this.options.target,
      indicatorsByType = this._getIndicatorsByType(),
      officialIndicators = indicatorsByType[0],
      shadowIndicators = indicatorsByType[1],
      iso = this.status.get('iso');

    console.log(officialIndicators);
    console.log(shadowIndicators);

    this.$el.html(this.template({
      iso: iso,
      officialIndicators: officialIndicators,
      shadowIndicators: shadowIndicators,
      target: target
    }));

    return this;
  }

});

module.exports = IndicatorCardView;
