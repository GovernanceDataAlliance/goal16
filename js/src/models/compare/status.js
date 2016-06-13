var Backbone = require('Backbone');

var Status = Backbone.Model.extend({

  defaults: {
    isoA: null,
    isoB: null,
    isoC: null
  },

  validate: function() {}

});

module.exports = Status;
