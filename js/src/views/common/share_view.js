var _ = require('lodash');
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var infoWindowView = require('./infowindow.js');

var sharetemplate = Handlebars.compile(require('../../templates/common/share_tpl.hbs'));

var ShareView = infoWindowView.extend({

  template: sharetemplate,

  events: {
    'click .btn-copy': '_copyUrl'
  },

  initialize: function(opt) {},

  _copyUrl: function() {
    var $parent = this.$el.find('.content.active'),
      $url = $parent.find('.url');
      $btn = $parent.find('.btn-copy');
      parentId = $parent[0].id;

    $url.select();

    try {
      var successful = document.execCommand('copy');
      $btn.html('copied');
    } catch(err) {
      throw err;
    }
  },

  render: function(opt) {
    this.$el.append(this.template({
      link: window.location.href,
      blog: this.isBlog
    }));
  }

});

module.exports = ShareView;
