var _ = require('lodash'),
    enquire = require('enquire.js'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

<<<<<<< HEAD:js/src/views/countries/countries.js
var countries = require('../../collections/common/countries.js');
var CountryList = require('./country_list.js');
=======
var CountriesCollection = require('../../../collections/common/countries.js');
var CountryListView = require('./countries_list.js');
>>>>>>> 22e2b52b23f4657a80e5408a7ce8977eace177f3:js/src/views/countries/countries-list/countries.js

var SearchView = require('../../common/search/search_view.js'),
  SearchMobileView = require('../../common/search/search_mobile_view.js');


var CountriesView = Backbone.View.extend({

  className: 'js--countries-list',

  initialize: function() {
<<<<<<< HEAD:js/src/views/countries/countries.js
    this.countries = countries;
=======
>>>>>>> 22e2b52b23f4657a80e5408a7ce8977eace177f3:js/src/views/countries/countries-list/countries.js

    // collections
    this.countriesCollection = CountriesCollection;
  },

  _setViews: function() {
    enquire.register("screen and (max-width:769px)", {
      match: _.bind(function(){
        this.mobile = true;
         this.initViews();
      },this)
    });

    enquire.register("screen and (min-width:770px)", {
      match: _.bind(function(){
        this.mobile = false;
         this.initViews();
      },this)
    });
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
    this._setViews();
    this.initViews()
    this.renderCountryList();
  },

  render: function() {
    this.$el.html();

    return this;
  }

});

module.exports = CountriesView;
