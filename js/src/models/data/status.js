var Backbone = require('backbone');

var Status = Backbone.Model.extend({

  // add attributes if needed
  defaults: {
    indicator: null
  },

  validate: function() {}

});

module.exports = Status;
