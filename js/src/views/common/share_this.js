var _ = require('lodash');
  $ = require('jquery'),
  Backbone = require('backbone'),
  Handlebars = require('handlebars');

var sharetemplate = Handlebars.compile(require('../../templates/common/share_this_tpl.hbs'));

var ShareView = Backbone.View.extend({

  template: sharetemplate,

  events: {
    'click #copy_url': '_copyUrl'
  },

  initialize: function(opt) {},

  _copyUrl: function() {
    $url = this.$el.find('#copy_url')
    $getUrlText = $url.data('url');

    navigator.clipboard.writeText($getUrlText);
  },

  render: function(opt) {
    this.$el.append(this.template({
      link: window.location.href,
    }));
  }

});

module.exports = ShareView;
