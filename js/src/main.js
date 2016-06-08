var Backbone = require('backbone'),
    $ = require('jquery');

var Router = require('./routers/router.js'),
    router = new Router({
      $el: $('.l-main-container')
    });

Backbone.history.start();
