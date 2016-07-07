var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var infoWindowView = require('./infowindow.js');

var IndicatorsCollection = require('../../collections/common/indicators'),
  ScoresCollection = require('../../collections/common/scores'),
  GeometriesCollection = require('../../collections/map/geometries');

var FunctionHelper = require('../../helpers/functions.js');

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

    // helpers
    this.functionHelper = FunctionHelper;

    // collections
    this.indicatorsCollection = new IndicatorsCollection();
    this.scoresCollection = new ScoresCollection();
    this.geometriesCollection = new GeometriesCollection();

    this._setListeners();
  },

  _setListeners: function() {},

  updateParams: function(settings) {
    _.extend(this.options, settings);
  },

  _getCSV: function() {

    if (this.options.isMap) {
      if (!!this.options.type && !!this.options.layer) {
        var layer = this.options.layer,
          options = {
          layer: layer
        };

        return this.options.type == 'target' ?
          this.geometriesCollection.getGeomsQueryByTarget(options) : this.geometriesCollection.getGeomsQueryByIndicator(options);
      }
    }

    if (this.options.isCountry) {
      var iso = this.options.iso;
      return this.indicatorsCollection.getAllIndicatorsByCountryonCSV(iso);
    }

    if (this.options.isCompare) {
      var countries = _.compact(_.values(this.options.countries)),
        countriesConditional = this.functionHelper.arrayToString(countries);

      var queryOptions = {
        countries_conditional : countriesConditional
      };

      return this.scoresCollection.getScoresGroupByTargetbyCSV(queryOptions);
    }
  },

  _cancel: function(e) {
    e.preventDefault();
    this.constructor.__super__.close();
  },

  _checkCompareDownload: function() {
    if (this.options.isMap) {
      if (! (!!this.options.type && !!this.options.layer)) {
        $('.js--download-btn').addClass('-disabled');
      }
    }

    // if (this.options.compare && this.options.compare.length > 0) {
    //   $('.js--download-btn')
    //     .unbind('click')
    //     .removeClass('-disabled');
    //
    // } else {
    //   $('.js--download-btn').on('click', function(e) {
    //     e.preventDefault();
    //   });
    //
    //   $('.js--download-btn').addClass('-disabled');
    // }
  },

  render: function() {
    this.$el.append(this.template({
      csv: this._getCSV()
    }));

    this._checkCompareDownload();
  }

});

module.exports = DownloadView;
