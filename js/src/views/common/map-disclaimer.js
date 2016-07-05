var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var disclaimertemplate = require('../../templates/common/disclaimer_tpl.hbs');

var MapDisclaimerView = Backbone.View.extend({

  el: 'body',

  template: Handlebars.compile(disclaimertemplate),

  events: function() {
    if (window.ontouchstart) {
      return  {
        'touchstart .btn-close-modal': 'close',
        'touchstart .modal-background': 'close'
      };
    }
    return {
      'click .btn-close-modal': 'close',
      'click .modal-background': 'close'
    };
  },

  initialize: function() {
    this.render();
    this._setListeners();
  },

  _setListeners: function() {
    $(document).keyup(_.bind(this.onKeyUp, this));
  },

  _remove: function() {
    $(this.el).find('#infowindow-base').remove();
  },

  render: function() {
    this.fixed = true;

    // Renders base template
    this.$el.append(this.template());
    this.toogleState();
  },

  onKeyUp: function(e) {
    // press esc
    if (e.keyCode === 27) {
      this.close(e);
    }
  },

  close: function(e) {
    e && e.stopPropagation();
    this.fixed = false;

    this._remove();
    this.toogleState();
    this._enableScroll();
  },

  toogleState: function() {
    $(this.el).toggleClass('is-inmobile', this.fixed);
    $('html').toggleClass('is-inmobile', this.fixed);
  },

  _enableScroll: function() {
    $('html').removeClass('is-inmobile');
    $('body').removeClass('is-inmobile');
  },

  avoidScroll: function() {
    $('html').addClass('is-inmobile');
    $('body').addClass('is-inmobile');
  }

});

module.exports = MapDisclaimerView;
