var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var infoWindowView = require('./infowindow.js');

var tpl = Handlebars.compile(require('../../templates/common/download_tpl.hbs'));

var DownloadView = infoWindowView.extend({

  template: tpl,

  events: {
    'click .js--download-btn': '_getDownload',
    'click .js--cancel-btn': '_cancel'
  },

  initialize: function(settings) {
    var options = settings && settings.options ? settings.options : settings;
    this.options = _.extend({}, options);

    _.extend(this.options, {
      id: window.indicatorId
    });

    this._setListeners();
  },

  _setListeners: function() {
    // Backbone.Events.on('compare:download-data', this._setDownloadData, this);
  },

  // _setDownloadData: function(countries) {
  //   this.options.compare = countries;
  // },

  _getCSV: function() {
    if (this.options.id) {
      return this.countriesCollection.downloadCountriesForIndicator(
        this.options.id, this.options.year, this.options.categoryGroup, this.options.categoryName);
    } else if (this.options.compare) {

      if (!this.options.compare.length > 0) {
        return;
      }

      $('.js--download-btn')
        .unbind('click')
        .removeClass('disabled');

      // return this.indicatorsCollection.downloadForCountries({
      //   countries: this.options.compare
      // });

    } else {

      // return this.indicatorsCollection.downloadForCountry({
      //   iso: this.options.iso,
      //   year: this.options.year
      // });

    }
  },

  _cancel: function(e) {
    e.preventDefault();
    this.constructor.__super__.close();
  },

  _checkCompareDownload: function() {
    if (window.location.pathname !== '/compare') {
      return;
    }

    if (this.options.compare && this.options.compare.length > 0) {
      $('.js--download-btn')
        .unbind('click')
        .removeClass('-disabled');

    } else {
      $('.js--download-btn').on('click', function(e) {
        e.preventDefault();
      });

      $('.js--download-btn').addClass('-disabled');
    }
  },

  render: function() {
    this.$el.append(this.template({
      csv: this._getCSV(),
      siteURL: SITEURL || null
    }));

    this._checkCompareDownload();
  }

});

module.exports = DownloadView;
