/**
 * Shamelessly ripped from the OpenLayers hover example at http://openlayers.org/dev/examples/hover-handler.html
 */

/**
 * Class: OpenLayers.Control.Hover
 * Handles hover events on the map
 *
 */
OpenLayers.Control.Hover = OpenLayers.Class(OpenLayers.Control, {
    onMove: this.checkLocation,
    onOut: this.stop,
    // targetWidth: 30,
    // panPx: 10,
    
    /**
     * APIMethod: activate
     */
    activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.map.events.register('mousemove', this, this.onMove);
            this.map.events.register('mouseout', this, this.onOut);
            // this.redraw();
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * APIMethod: deactivate
     */
    deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.map.events.unregister('mousemove', this, this.checkLocation);
            this.map.events.unregister('mouseout', this, this.stop);
            this.element.innerHTML = "";
            return true;
        } else {
            return false;
        }
    },
    
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
    },
    checkLocation: function(evt) {
        // alert('x, y: ' + evt.xy.x + ', ' + evt.xy.y);
    },
    stop: function(evt) {
        // if this control sent an Ajax request (e.g. GetFeatureInfo) when
        // the mouse pauses the onMove callback could be used to abort that
        // request.
    }
}); 
