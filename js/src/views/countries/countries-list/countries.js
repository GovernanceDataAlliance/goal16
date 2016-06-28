var _ = require('lodash'),
    enquire = require('enquire.js'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js');
var CountryListView = require('./countries_list.js');

var SearchView = require('../../common/search/search_view.js'),
  SearchMobileView = require('../../common/search/search_mobile_view.js');

require('../../common/slick.min');


var CountriesView = Backbone.View.extend({

  className: 'js--countries-list',

  initialize: function() {
    // collections
    this.countriesCollection = CountriesCollection;
  },

  _setViews: function() {
    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
        this.initViews();
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
      match: _.bind(function(){
        this.mobile = false;
        this.initViews();
      },this)
    });
  },

  _setVars: function() {
    this.$share = $('.l-share');
    this.$banner = $('.l-banner');
  },

  renderCountryList: function() {
    this.countriesCollection.getCountriesList().done(function() {
      this.$el.html(new CountryListView().render().el);
    }.bind(this));
  },

  initViews: function() {
    if (!this.mobile) {
      new SearchView({ el: $('.js--search') });
    } else {
      new SearchMobileView({ el: $('.js--search') });
    }
  },

  show: function() {
    this.$share.toggleClass('is-hidden');
    this.$banner.removeClass('is-hidden');
    
    this._setViews();
    this.renderCountryList();
  },

  render: function() {
    this.$el.html();

    this._setVars();

    return this;
  }

});

module.exports = CountriesView;
