var $ = require('jquery'),
  Backbone = require('backbone');

var CategorySelector = require('./category_selector.js');
var FunctionHelper = require('../../helpers/functions.js');

var BlogView = Backbone.View.extend({

  el: '.js-blog',

  events: {
  },

  initialize: function() {

    this.FunctionHelper = FunctionHelper;

    if (! !!$('body').hasClass('is-post-page')) {
      this._category();
    };

    this.FunctionHelper.scrollTop();
  },

  _category: function() {
    new CategorySelector({
      el: '#categorySelector'
    });
  }

});

module.exports = BlogView;
