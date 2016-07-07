var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var TargetCardHeaderView = require('../../../views/common/target-card/header.js');

var template = require('../../../templates/countries/country/indicator-card.hbs');

require('../../common/slick.min');


var IndicatorCardView = Backbone.View.extend({

  className: 'c-score-card',

  tagName: 'article',

  template: Handlebars.compile(template),

  initialize: function(settings) {
    this.options = settings || {};

    this.status = this.options.status;
    this.id = this.options.target.slug;
  },

  _setViews: function() {
    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });
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

  setSlick: function() {

    if (!this.mobile) {
      return;
    }

    this.$('.card-container').slick({
      dots: true,
      arrows:false,
      infinite: true,
      speed: 500,
      fade: true
      // appendDots: $(".slick-list")
    });
  },

  render: function() {
    var target = this.options.target,
      indicatorsByType = this._getIndicatorsByType(),
      officialIndicators = indicatorsByType[0],
      shadowIndicators = indicatorsByType[1],
      iso = this.status.get('iso');

    var optionsView = {
      target: target,
      cardView: this
    };

    this.targetCardHeaderView = new TargetCardHeaderView(optionsView);

    this.$el.append(this.targetCardHeaderView.render().el);

    this.$el.find('.js--score-container').html(this.template({
      iso: iso,
      officialIndicators: officialIndicators,
      shadowIndicators: shadowIndicators,
      baseulr: SITEURL
    }));

    this._setViews();

    return this;
  }

});

module.exports = IndicatorCardView;
