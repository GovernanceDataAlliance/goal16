var _ = require('lodash'),
    Backbone = require('backbone');

var ViewManager = Backbone.Model.extend({
  defaults: {
    views: {}
  },

  initialize: function() {},

  addView: function(viewName, view) {
    var views = this.get('views');
    views[viewName] = view;

    this.set('views', views);
  },

  getView: function(viewName) {
    return this.get('views')[viewName];
  },

  showView: function(viewName, el) {
    var view = this.get('views')[viewName];
    this.$el = $(el);

    if (view !== undefined) {
      this.set('currentView', view);

      view.show();
      this.$el.html(view.el);
      view.delegateEvents();
    }
  },

  hasView: function(viewName) {
    return (this.get('views')[viewName] !== undefined);
  }
});


module.exports = ViewManager;
