var $ = require('jquery'),
  Backbone = require('backbone');

var CategorySelector = require('./category_selector.js');
var DateSelector = require('./date_selector.js');
// var ShareWindowView = require('../common/share_window.js');
var FunctionHelper = require('../../helpers/functions.js');
var ShareThisView = require('../common/share_this.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
    'click #js--share' : '_share'
  },

  initialize: function() {
    this.FunctionHelper = FunctionHelper;

    if (! !!$('body').hasClass('is-post-page')) {
      this._category();
      this._year();
    };

    this.shareOptions = {
      noDownload: true,
      noPrint: true,
      onlyShare: true
    };

    // this.shareWindowView = new ShareWindowView(this.shareOptions);
    this.shareThisView = new ShareThisView({el: "#js--sharethis"});
    this.shareThisView.render();

    this.FunctionHelper.scrollTop();
  },

  _category: function() {
    new CategorySelector({
      el: '#categorySelector'
    });
  },

  _year: function() {
    new DateSelector({
      el: '#dateSelector'
    });
  },

  _share: function() {
    // this.shareWindowView.render(this.shareOptions);
    // this.shareWindowView.delegateEvents();
  },

  show: function() {
  }

});

module.exports = BlogView;
