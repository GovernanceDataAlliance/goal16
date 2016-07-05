var Backbone = require('backbone');

var helpers = require('./helpers/handlebars.js');

var Router = require('./router.js'),
    router = new Router();

Backbone.history.start({
  pushState: true,
  root: SITEURL ? SITEURL : "/"
});

