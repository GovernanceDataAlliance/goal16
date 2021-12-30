var $ = require('jquery'),
  Backbone = require('backbone');

var FunctionHelper = require('../../helpers/functions.js');
var ShareThisView = require('../common/share_this.js');

var ReportsView = Backbone.View.extend({

  el: '.js-reports',

  initialize: function() {
    this.FunctionHelper = FunctionHelper;

    // if (! !!$('body').hasClass('is-post-page')) {
    //   this._category();
    // };

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

  show: function() {
  }

});

module.exports = ReportsView;
