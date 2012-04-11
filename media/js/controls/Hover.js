/**
 * Shamelessly ripped from the OpenLayers hover example at http://openlayers.org/dev/examples/hover-handler.html
 */

/**
 * Class: OpenLayers.Control.Hover
 * Handles hover events on the map
 *
 */
OpenLayers.Control.Hover = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'delay': 500,
        'pixelTolerance': null,
        'stopMove': false
    },
    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Hover(
            this,
            // {'pause': this.onPause, 'move': this.onMove},
            this.handlerOptions
        );
    },
    onPause: function(evt) {
        alert('x, y: ' + evt.xy.x + ', ' + evt.xy.y);
        var output = document.getElementById(this.key + 'Output');
        var msg = 'pause ' + evt.xy;
        output.value = output.value + msg + "\r\n";
        // alert(output.value);
    },
    onMove: function(evt) {
        // if this control sent an Ajax request (e.g. GetFeatureInfo) when
        // the mouse pauses the onMove callback could be used to abort that
        // request.
    }
}); 
