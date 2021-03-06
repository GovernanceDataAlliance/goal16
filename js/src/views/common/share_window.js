var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var infoWindowView = require('./infowindow.js'),
  ShareView = require('./share_view.js'),
  DownloadView = require('./download_view.js');

var shareTemplate = require('../../templates/common/share_window_tpl.hbs');

var ShareWindowView = infoWindowView.extend({

  template: Handlebars.compile(shareTemplate),

  events: {
    'click .js--download' : '_download',
    'click .js--print': '_print',
    'click .js--share': '_share'
  },

  initialize: function(options) {
    this.options = options || {};

    _.extend(this.events, this.constructor.__super__.events());

    // Templates
    this.infoWindowTemplate = Handlebars.compile(this.constructor.__super__.template({isBase: true, isShare: true}));

    // Views
    this.shareView = new ShareView();

    if (!this.options.noDownload) {
      this.downloadView = new DownloadView({
        options: this.options
      });
    }

  },

  _print: function() {
    window.print();
  },

  updateOptions: function(settings) {
    if (!this.downloadView) {
      return;
    }

    this.downloadView.updateParams(settings);
  },

  _setActive: function(e) {
    var buttons = document.querySelectorAll('.share-toolbar .c-button');
    current = e.currentTarget;

    $(buttons).removeClass('-active');
    $(buttons).addClass('-secondary');
    $(current).addClass('-active');
    $(current).removeClass('-secondary');
  },

  _cleanContent: function() {
    var content = document.querySelector('#toolbar-content');
    if (content.hasChildNodes()) {
      $('#toolbar-content').empty();
    }
  },

  _share: function(e) {

    if (!e) {

      $('.js--share').addClass('-active');

    } else {

      if (this._isActive(e)) {
        return;
      }

      this._cleanContent();
      this._setActive(e);
    }

    this.shareView.setElement($('#toolbar-content'));
    this.shareView.render();
  },

  _isActive: function(e) {
    return e && $(e.currentTarget).hasClass('-active');
  },

  _download: function(e) {

    if (e && this._isActive(e)) {
      return;
    }

    this._setActive(e);
    this._cleanContent();

    this.downloadView.setElement($('#toolbar-content'));
    this.downloadView.render();
    this.downloadView.delegateEvents();

  },

  render: function() {
    // take a look later..
    this.$el.append(this.infoWindowTemplate());
    this.$('#modal-content').append(this.template());

    if (this.options.noDownload) {
      $('.share-toolbar').addClass('-no-download');
    }

    if (this.options.noPrint) {
      $('.share-toolbar').addClass('-no-print');
    }

    if (this.options.onlyShare) {
       $('.share-toolbar').addClass('is-hidden');
       $('.title').css({'display': 'block'});
    }

    this.avoidScroll();

    // Share view by default
    this._share();
  },

  close: function() {
    this.constructor.__super__.close();
    this.undelegateEvents();
  }

});

module.exports = ShareWindowView;
