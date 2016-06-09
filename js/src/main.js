var Backbone = require('backbone'),
    $ = require('jquery');

var helpers = require('./helpers/handlebars.js');

var Router = require('./router.js'),
    router = new Router({
      $el: $('.l-main-container')
    });

Backbone.history.start({pushState: true});
