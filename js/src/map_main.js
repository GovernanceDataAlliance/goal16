var Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    $ = require('jquery');

var Router = require('./routers/map.js'),
    router = new Router({
      $el: $('.js--map-container')
    });

Backbone.history.start();
