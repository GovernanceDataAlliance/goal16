var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var PopUpModel = require('../../models/map/pop_up.js');

var popUpTargetTemplate = Handlebars.compile(require('../../templates/map/pop_up_target.hbs')),
    popUpIndicatorTemplate = Handlebars.compile(require('../../templates/map/pop_up_indicator.hbs'));

var PopUpView = Backbone.View.extend({

  initialize: function(options) {
    this.options = options;
    this.model = new PopUpModel();
    this._initData();
  },

  _initData: function() {
    this.model._getPopUpInfo(this.options).done(_.bind(function(response) {
      //We need to check if response is empty to not draw pop-up in that case.
      if ( response.rows.length > 0) {
        this.options.data = this.model;
        this.template = this.options.layerType === 'target' ? popUpTargetTemplate : popUpIndicatorTemplate;
        this.options.mobile ?  this._drawPopUpMobile() : this._drawPopUp();
      } else {
        this.model.clear();
      }
    }, this));
  },

  _drawPopUpMobile: function() {
    this.popUp = this._getContent(this.options);
    $('body').append(this.popUp);
    $("#popup-background").css("display","block");
    $('.btn-close').on('click', this._closeInfowindow.bind(this));
  },

  _drawPopUp: function() {
    this.popUp = L.popup({closeButton: false})
      .setLatLng(this.options.latLng)
      .setContent(this._getContent(this.options))
      .openOn(this.options.map);

    this.setEvents();
  },

  setEvents: function() {
    $('.btn-close').on('click', this.closePopUp.bind(this))
  },

  closePopUp: function() {
    this.options.map.closePopup();
    Backbone.Events.trigger('popUp:close');
  },

  _closeInfowindow: function() {
    $('.btn-close').off('click');
    $('.m-popup').remove();
    $("#popup-background").css("display","none");
  },

  _getContent: function(options) {
    return this.template(options);
  },


});

module.exports = PopUpView;
