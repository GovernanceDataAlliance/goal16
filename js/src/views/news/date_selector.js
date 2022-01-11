var $ = require('jquery');
global.$ = $; // for chosen.js

var chosen = require('chosen-jquery-browserify'),
  _ = require('lodash'),
  enquire = require('enquire.js'),
  Backbone = require('backbone');

var CategorySelector = Backbone.View.extend({

  defaults: {
    title: 'Blog posts from'
  },

  events: {
    'change select': 'onChangeSelect'
  },

  initialize: function() {
    // enquire.register("screen and (max-width:768px)", {
    //   match: _.bind(function(){
    //     this.mobile = true;
    //   },this)
    // });

    // enquire.register("screen and (min-width:769px)", {
    //   match: _.bind(function(){
    //     this.mobile = false;
    //   },this)
    // });

    this.blog = $('.l-blog');
    this.posts = $('.l-post');

    // if (!this.mobile) {
    //   this.$('select').chosen();
    // }

    this.$('select').chosen();
  },

  setActive: function(cat) {
    if (cat === 'all' || cat === '' || !cat) {
      this.blog.removeClass('-filtering-date');
      this.posts.each(function() {
        $(this).removeClass('-date-active');
      })
    } else {
      this.blog.addClass('-filtering-date');
      this.posts.each(function(index, category) {
        if ($(this).data('date') === cat){
          $(this).addClass('-date-active');
        } else {
          $(this).removeClass('-date-active');
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
