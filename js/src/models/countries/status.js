var Backbone = require('backbone');

var Status = Backbone.Model.extend({

  // add attributes if needed
  defaults: {
    iso: null
  },

  validate: function() {}

});

module.exports = Status;
