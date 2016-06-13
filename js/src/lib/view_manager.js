var Backbone = require('backbone');

var ViewManager = Backbone.Model.extend({

  defaults: {
    views: {}
  },

  el: '#content',

  addView: function(viewName, view) {
    var views = this.get('views');
    views[viewName] = new view();

    this.set('views', views);
  },

  getView: function(viewName) {
    return this.get('views')[viewName];
  },

  showView: function(viewName) {
    var view = this.getView(viewName);

    if (!view) {
      return;
    }

    this._renderView(view);
  },

  hasView: function(viewName) {
    return this.get('views')[viewName] ? true : false;
  },

  _renderView: function(view) {
    $(this.el).html(view.render().el);

    view.show();
    view.delegateEvents();
  }

});


module.exports = ViewManager;
