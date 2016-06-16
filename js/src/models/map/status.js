var Backbone = require('backbone');

var Status = Backbone.Model.extend({
  //This model is shared for the map and the dashboard, and they will communicate for it.
  defaults: {
    layer: '',
    layerType: '',
    zoom: '',
    center: ''
  },

  validate: function() {}

});

module.exports = new Status();
