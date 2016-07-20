var $ = require('jquery'),
  _ = require('lodash'),
  Backbone = require('backbone'),
  enquire = require('enquire.js'),
  Handlebars = require('handlebars');

var targetsCollection = require('../../collections/common/targets.js'),
    IndicatorsCollection = require('../../collections/common/indicators.js');

var InfoWindowModel = require('../../models/common/infowindow.js');
var ModalWindowView = require('../../views/common/infowindow.js');

var status = require ('../../models/map/status.js');

var template = Handlebars.compile(require('../../templates/map/dashboard.hbs')),
    targetsTemplate = Handlebars.compile(require('../../templates/map/targets.hbs')),
    indicatorsTemplate = Handlebars.compile(require('../../templates/map/indicators.hbs'));

var DashboardView = Backbone.View.extend({

  id: 'dashboard-container',
  className: 'l-dashboard',

  events: {
    'click .js--toggle-dashboard': '_toggleDashboard',
    'click .js--open-dashboard-mb': '_toggleDashboard',
    'click .js--cancel': '_cancelChanges',
    'click .js--apply': '_applyChanges',
    'click .js--open-target': '_showIndicatorsPerTarget',
    'click .js--close-target': '_hideIndicators',
    'click .js--indicator-info': '_showModalWindow',
    'change .js--layer-selector': '_selectLayer',
  },

  initialize: function() {
    this.status = status;

    //We will keep in this array the slug of the target
    // which indicators has already been requested in order to avoid asking twice for the same info;
    this.requestedTargets = [];

    this.targetsCollection = targetsCollection;
    this.indicatorsCollection = new IndicatorsCollection();
    this.infoWindowModel = new InfoWindowModel();

    this._setView();
  },

  _setListeners: function() {
    this.status.on('change:layer', _.bind(this._setSelectLayer, this));
  },

  _setView: function() {
    enquire.register("screen and (max-width:767px)", {
      match: _.bind(function(){
        this.mobile = true;
        this.dashboardClose = true;
        $('body').addClass('is-dashboard-close');
      },this)
    });

    enquire.register("screen and (min-width:768px)", {
      match: _.bind(function(){
        this.mobile = false;
        this.dashboardClose = false;
        $('body').removeClass('is-dashboard-close');
      },this)
    });
  },

  show: function() {
    this.targetsCollection.getTargetsList().done(_.bind(function() {
      this._renderTargets();
      this._setListeners();
    }, this));
  },

  _updateRouterParams: function() {
    Backbone.Events.trigger('router:update-params', this.status);
  },

  _toggleDashboard: function(e) {
    e && e.stopPropagation();
    this.dashboardClose = !this.dashboardClose;
    this.$body.toggleClass('is-dashboard-close', this.dashboardClose);

    if (this.mobile) {
      this.$dashOpenner.toggleClass('is-hidden', !this.dashboardClose);
      this.$mapHandler.toggleClass('is-hidden', this.dashboardClose);
    }

    Backbone.Events.trigger('close:infowindow');
    Backbone.Events.trigger('dashboard:change');
  },

  _applyChanges: function() {
    this._setActiveLayer();
    this._closeDashboard();
  },

  _cancelChanges: function() {
    //Keep previus layer
    if (this.temporalLayer) {
      Backbone.Events.trigger('map:removeLayer');
    }

    this._resetDashboarState();
    this._closeDashboard();
  },

  _resetDashboarState: function() {
    if (this.temporalLayer) {
      $('#'+this.temporalLayer.layer).attr('checked', false);
      this.$targetsWrapper.removeClass('is-open');
    }
  },

  _closeDashboard: function() {
    this.dashboardClose = true;

    this.$body.addClass('is-dashboard-close');
    this.$dashOpenner.removeClass('is-hidden');
    this.$mapHandler.addClass('is-hidden');

    //and cancel layer
    this.temporalLayer = null;
  },

  _showIndicatorsPerTarget: function(e) {
    Backbone.Events.trigger('close:infowindow');

    var $currentTarget;
    var currentTargetSlug;

    if (e && e.currentTarget) {
      $currentTarget = $(e.currentTarget);
      currentTargetSlug = $currentTarget.data('slug');
    } else {
      $currentTarget = $('.js--open-target[data-slug="'+ e +'"]')
      currentTargetSlug = e;
    }

    //1 - Check if the indicator has already been requested.
    //2 - if so, open target. If not, request indicators and open target.
    if ( _.includes(this.requestedTargets, currentTargetSlug) ) {
      $currentTarget.parents('.m-dashboard-target').addClass('is-open');
    } else {
      this.indicatorsCollection.getInidcatorsByTarget(currentTargetSlug).done(_.bind(function() {
        this._renderIndicators(currentTargetSlug);
        this.requestedTargets.push(currentTargetSlug);

        // Allows having multiple targets opened at the same time.
        // Uncomment in case you want the opposite.
        $currentTarget.parents('.m-dashboard-target').addClass('is-open');
      }, this))
    }
  },

  _hideIndicators: function(e) {
    e && e.stopPropagation();
    var $currentTarget = $(e.currentTarget);
    $currentTarget.parents('.m-dashboard-target').removeClass('is-open');
  },

  render: function() {
    this.$el.html(template());
    return this;
  },

  _renderTargets: function() {
    var targets = this.targetsCollection.toJSON();

    this.$('#targets-container').append(targetsTemplate({targets: targets}));

    this._setVars();
    this._setSelectLayer();
  },

  /*
    This function sets the layer from url if any.
   */
  _setSelectLayer: function() {
    var currentLayer = this.status.get('layer');
    var currentType = this.status.get('layerType');

    if (currentLayer) {
      if (currentType == 'indicator') {
        this._activateIndicatorsLayer(currentLayer);
      } else {
        this._activateTargetLayer(currentLayer);
      }
    }
  },

  _activateIndicatorsLayer: function(slug) {
    this.indicatorsCollection.getTargetOfIndicator(slug).done(_.bind(function(slug){
      this._showIndicatorsPerTarget(slug.rows[0].target_slug);
    }, this))
  },

  /*
   This method is only to update the dashboard.
   As the status is the same for the map and the dashboard, even if we trigger
   the event to upload status, it wont change into the map because as they share status model it won't update.
   We need to do it manually.
   */
  _activateTargetLayer: function(target) {
    $('#'+target).attr('checked', true);
  },

  _setVars: function() {
    this.$body = $('body');
    this.$dashOpenner = $('.js--open-dashboard-mb');
    this.$mapHandler = $('.js--map-handlers');
    this.$map = $('#map-container');
    this.$targetsWrapper = $('.m-dashboard-target');
    this.$applyBtn = $('.js--apply');
    this.$cancelBtn = $('.js--cancel');
  },

  _renderIndicators: function(targetSlug) {
    var indicatorsGrupedByType = this.indicatorsCollection.groupByType();

    this.$('#target-' + targetSlug).find('.js--indicators').html(indicatorsTemplate(indicatorsGrupedByType));

    if (this.status.get('layer') && this.status.get('layerType') == 'indicator' ) {
      $('#' + this.status.get('layer')).attr('checked', true);
    }
  },

  _selectLayer: function(e) {
    var $currentTarget = $(e.currentTarget);
    var currentTargetSlug = $currentTarget.val();

    if ($currentTarget.hasClass('-target')) {
      this._setActiveLayer('target', currentTargetSlug);
    } else {
      this._setActiveLayer('indicator', currentTargetSlug);
    }
  },

  _setActiveLayer: function(type, layer) {
    if (!this.mobile) {
      this.status.set({ layerType: type, layer: layer });
      this.$map.addClass('is-loading -map');
      this._updateRouterParams();
    } else if (this.mobile && !this.temporalLayer) {
      //keep temporal values to apply when hit apply btn
      this.temporalLayer = {
        layer: layer,
        type: type
      }
      //Activate apply btn
      this.$applyBtn.removeClass('-disabled');
    } else if (this.mobile && this.temporalLayer) {
      this.status.set({ layerType: this.temporalLayer.type, layer: this.temporalLayer.layer });
      this.$map.addClass('is-loading -map');
      this._updateRouterParams();

      this._closeDashboard();
      this.$applyBtn.addClass('-disabled');
      this.temporalLayer = null;
    }

    console.log(this.temporalLayer);
  },

  _showModalWindow: function(e) {
    var indicator = $(e.currentTarget).data('slug');
    if (!indicator) {
      return;
    } else {
      this.infoWindowModel._getIndicatorInfo(indicator).done(function(res) {
        console.log(indicator);
        if (res.rows.length === 0) {
          this.infoWindowModel.clear();
        }

        new ModalWindowView({
          'type': 'info-infowindow',
          'data': this.infoWindowModel.toJSON()
        });
      }.bind(this));
    }
  }

});

module.exports = DashboardView;
