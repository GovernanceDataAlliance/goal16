var _ = require('lodash'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

var CountriesCollection = require('../../../collections/common/countries.js');

var template = Handlebars.compile(require('../../../templates/countries/countries-list/country_list.hbs'));

var CountryListView = Backbone.View.extend({

  events: {
    'click .js--list-handler' : '_openList'
  },

  initialize: function(options) {
    options = options || {};
<<<<<<< HEAD:js/src/views/countries/country_list.js
    this.countries = options.countries;
    this.listenTo(this.countries, 'sync', this.render);

    if (this.countries.length === 0) {
      this.countries.getCountriesList();
    }
=======
>>>>>>> 22e2b52b23f4657a80e5408a7ce8977eace177f3:js/src/views/countries/countries-list/countries_list.js

    this.countriesCollection = CountriesCollection;
  },

  _divideCols: function() {
    var regions = this._getRegions(),
      cols = window.innerWidth > 1400 ? 4 : 3,
      list = {};

    if (!Object.keys(regions).length > 0) {
      return;
    };

    _.each(regions, function(region, regionName) {
      if (region.length > 0) {

        list[regionName] = [];

        var divisor = Math.round(region.length / cols);
        var x = 0;
        for (var i = 0; i < cols; i++) {

          if (i < 1 && region.length % cols > 0) {
            divisor += 1;
          }

          list[regionName].push(region.slice(x, divisor));
          x = divisor;
          divisor += Math.round(region.length / cols);
        }
      }
    });

    return list;
  },

  render: function() {
    var list = this._divideCols();

    if (!this.tablet) {
      this.$el.html(template({
        countriesByRegion: list
      }));
    } else {
      this.$el.html(templateMb({
        countriesByRegion: this._getRegions()
      }));
    }
    return this;
  },

  _getRegions: function() {
<<<<<<< HEAD:js/src/views/countries/country_list.js
    var groupedRegions = this.countries.getCountriesByRegion();
=======
    var groupedRegions = this.countriesCollection.getCountriesByRegion();
>>>>>>> 22e2b52b23f4657a80e5408a7ce8977eace177f3:js/src/views/countries/countries-list/countries_list.js
    var sortedRegions = _.mapValues(groupedRegions, function(countries, region) {
      return _.sortBy(countries, 'name');
    });

    return sortedRegions;
  },

  _openList: function(e) {
    $(e.currentTarget).toggleClass('list-open');
  }
});

module.exports = CountryListView;
