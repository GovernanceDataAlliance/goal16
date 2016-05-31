var Backbone = require('backbone');

var ViewManager = require('../lib/view_manager.js'),
  MapView = require('../views/map/map.js'),
  MobileMenuView = require('../views/common/mobile_menu_view.js');

var Router = Backbone.Router.extend({

  routes: {
    "": "map",
  },

  initialize: function(options) {
    this.views = new ViewManager({ $el: options.$el });
  },

  map: function() {
    new MapView();
    new MobileMenuView();
  }

});

module.exports = Router;
