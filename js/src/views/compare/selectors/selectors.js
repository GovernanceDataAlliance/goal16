var $ = require('jquery');
global.$ = $; // for chosen.js

var _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars'),
  chosen = require('chosen-jquery-browserify');


var CountriesCollection = require('../../../collections/common/countries.js');

var SelectorsTemplate = require('../../../templates/compare/selectors/selectors.hbs');

var SelectorsView = Backbone.View.extend({

  className: 'js--selectors',

  template: Handlebars.compile(SelectorsTemplate),

  events: {
    'change select' : '_setCountry'
  },

  initialize: function(settings) {
    this.options = settings || {};
    this.status = this.options.status;

    // collections
    this.countriesCollection = CountriesCollection;
  },

  _setListeners: function() {
    this.status.on('change',function() {
      this._checkSelectors();
      this._checkCompareButton();
    }.bind(this));
  },

  setView: function() {
    // enquire.register("screen and (max-width:767px)", {
    //   match: _.bind(function(){
    //     this._destroyChosen();
    //   },this)
    // });

    this._setChosen();

    // enquire.register("screen and (min-width:768px)", {
    //   match: _.bind(function(){
    //     this._setChosen();
    //   },this)
    // });
  },

  _setVars: function() {
    this.$selectors = this.$el.find('select');
    this.$compareBtn = this.$el.find('#compare-countries');
  },

  // set status with new incoming params from selectors.
  _setCountry: function(e) {
    var selector = e.currentTarget;
      id = selector.id,
      iso = selector.value;

    var newStatus = this.status.toJSON()
    newStatus[id] = iso;

    this.status.set(newStatus);
  },

  // populates selectors with countries.
  // if there are countries already setted, they will be setted in selectors also.
  _populateSelectors: function() {
    var selectOptions;

    this.countriesCollection.forEach(function(countryModel) {
      var country = countryModel.toJSON();
      selectOptions += '<option value="' + country.iso + '">' + country.name + '</option>';
    });

    this.$selectors.each(function(i, selector) {
      $(selector).append(selectOptions);
    });

    var currentCountries = _.uniq(_.values(this.status.toJSON()));

    if (!(_.compact(currentCountries).length)) {
      return;
    }

    this.$selectors.each(function(i, selector) {
      if (!currentCountries[i]) {
        return;
      }

      this.value = currentCountries[i];
    });

    this._checkSelectors();
  },

  // enable/disable selector's options based on
  // the current status of the application
  _checkSelectors: function() {
    var newCountries = _.values(this.status.toJSON());

    this.$selectors.each(function(i, selector) {

      $(selector).find('option:disabled').removeAttr('disabled');

      _.map(newCountries, function(iso, i) {

        if (iso == '') {
          return;
        }

        $(selector).find('option:not(:selected)[value="' + iso + '"]').attr('disabled', 'disabled');
        $(selector).trigger('liszt:updated');

      }, this);

    }.bind(this));
  },

  // check if the compare button shoudl be available or not
  // based on the number of countries selected
  _checkCompareButton: function() {
    var settedCountries = _.compact(_.values(this.status.toJSON())),
      totalCountries = settedCountries.length;

    if (totalCountries > 1) {
      if (this.$compareBtn.hasClass('-disabled')) {
        this.$compareBtn.removeClass('-disabled');
      }
    } else {
      if (!this.$compareBtn.hasClass('-disabled')) {
        this.$compareBtn.addClass('-disabled');
      }
    }
  },

  _setChosen: function() {
    this.$selectors.each(function() {
      $(this).chosen();
    });
  },

  _destroyChosen: function() {
    this.$selectors.each(function() {
      $(this).removeClass('chzn-done')
      $(this).siblings('.chzn-container').remove();
      $(this).removeAttr('style');
    });
  },

  render: function() {
    this.$el.html(this.template());

    this._setVars();
    this._setListeners();

    this._populateSelectors();

    this._checkCompareButton();

    return this;
  }

});

module.exports = SelectorsView;
