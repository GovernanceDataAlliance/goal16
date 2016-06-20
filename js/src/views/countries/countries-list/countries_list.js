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
    var groupedRegions = this.countriesCollection.getCountriesByRegion();
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
