var _ = require('lodash'),
  $ = require('jquery'),
  Backbone = require('backbone');

var TextShortener = Backbone.View.extend({

  events: {
    'click .read-more' : '_onExpandText',
    'click .read-less' : '_onShortText'
  },

  defaultOptions: {
    'maxLength': 350
  },

  initialize: function(settings) {
    this.options = settings ?
      _.extend(this.defaultOptions, settings) : this.defaultOptions;
  },

  _setVars: function() {
    this.$ellipsis = this.$el.find('.ellipsis');
    this.$hiddenText = this.$el.find('.hidden-text');
    this.$readLessBtn = this.$el.find('.read-less');
    this.$readMoreBtn = this.$el.find('.read-more');
  },

  short: function() {
    var maxLength = this.options.maxLength,
      textLength = this.el.innerText.length,
      readMore = document.createElement('span'),
      readLess = document.createElement('span'),
      ellipsis = document.createElement('span'),
      textShow, textHide, hiddenHTML, showHTML;

    readMore.innerText = ' read more';
    readMore.className = 'c-shortener-button read-more';

    readLess.innerText = 'read less';
    readLess.className = 'c-shortener-button read-less';

    ellipsis.innerText = '...';
    ellipsis.className = 'ellipsis';


    if (textLength <= maxLength) {
      return;
    }

    textShow = this.el.innerHTML.substr(0, maxLength);
    textShow = textShow.replace(/<p>/g, '<span>');
    textShow = textShow.replace(/<\/p>/g, '</span>');

    textHide = this.el.innerHTML.substr(maxLength, this.el.innerText.length);

    textHide = textHide.replace(/<p>/g, '<span>');
    textHide = textHide.replace(/<\/p>/g, '</span>');

    showHTML = document.createElement('span');
    hiddenHTML = document.createElement('span');

    showHTML.innerHTML = textShow;
    showHTML.className = 'visible-text';

    hiddenHTML.innerHTML = textHide;
    hiddenHTML.className = 'hidden-text is-hidden';

    $(readLess).appendTo(hiddenHTML);
    $(ellipsis).appendTo(showHTML);
    $(hiddenHTML).appendTo(showHTML);

    $(this.el)
      .html(showHTML)
      .append(readMore);

    this._setVars();
  },

  _onExpandText: function() {
    this.$hiddenText.removeClass('is-hidden');
    this.$ellipsis.addClass('is-hidden');
    this.$readMoreBtn.addClass('is-hidden');
  },

  _onShortText: function() {
    this.$readLessBtn.parent().addClass('is-hidden');
    this.$ellipsis.removeClass('is-hidden');
    this.$readMoreBtn.removeClass('is-hidden');
  },

});

module.exports = TextShortener;
