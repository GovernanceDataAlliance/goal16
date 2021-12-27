var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var CategorySelector = Backbone.View.extend({

  defaults: {
    title: 'Events posts from'
  },

  events: {
    'change select': 'onChangeSelect'
  },

  initialize: function() {

    enquire.register("screen and (max-width:768px)", {
      match: _.bind(function(){
        this.mobile = true;
        console.log(this.mobile);
      },this)
    });

    enquire.register("screen and (min-width:769px)", {
      match: _.bind(function(){
        this.mobile = false;
      },this)
    });

    this.blog = $('.l-blog');
    this.posts = $('.l-post');

    if (!this.mobile) {
      this.$('select').chosen();
    }
  },

  setActive: function(cat) {
    if (cat === 'all' || cat === '' || !cat) {
      this.blog.removeClass('-filtering-cat');
      this.posts.each(function() {
        $(this).removeClass('-cat-active');
      })
    } else {
      this.blog.addClass('-filtering-cat');
      this.posts.each(function(index, category) {
        if ($(this).data('category') === cat){
          $(this).addClass('-cat-active');
        } else {
          $(this).removeClass('-cat-active');
        }
      });
    }
  },

  onChangeSelect: function(e) {
    var category = e.currentTarget.value;
    this.setActive(category);
  }

});

module.exports = CategorySelector;
