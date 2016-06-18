var $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var PopUpModel = require('../../models/map/pop_up.js');

var popUpTemplate = Handlebars.compile(require('../../templates/map/pop_up.hbs'));

var PopUpView = Backbone.View.extend({

  initialize: function(options) {
    this.options = options;
    this.model = new PopUpModel();
    this._initData();
  },

  _initData: function() {
    this.model.fetch(this.options).done((response) => {
      //We need to check if response is empty to not draw pop-up in that case.
      if ( Object.keys(response).length ) {
        this.options.data = this.model;
        this.options.mobile ?  this._drawPopUpMobile() : this._drawPopUp();
      } else {
        this.model.clear();
      }
    });
  },

  _drawPopUpMobile: function() {
    this.popUp = this._getContent(this.options);

    $('body').append(this.popUp);
    $('.btn-close').on('click', this._closeInfowindow.bind(this));
  },

  _drawPopUp: function() {
    this.popUp = L.popup({closeButton: false})
      .setLatLng(this.options.latLng)
      .setContent(this._getContent(this.options))
      .openOn(this.options.map);

    this.setEvents();
    // this._panMap();
  },

  setEvents: function() {
    $('.btn-close').on('click', this.closePopUp.bind(this))
  },

  closePopUp: function() {
    this.options.map.closePopup();
    Backbone.Events.trigger('popUp:close');
  },

  _getContent: function(options) {
    var content = popUpTemplate();
  },


});

module.exports = PopUpView;
