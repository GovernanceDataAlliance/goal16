var Backbone = require('Backbone');

var Status = Backbone.Model.extend({
  //This model is shared for the map and the dashboard, and they will communicate for it.
  defaults: {
    activeLayer: '',
    zoom: '',
    center: ''
  },

  validate: function() {}

});

module.exports = new Status();
