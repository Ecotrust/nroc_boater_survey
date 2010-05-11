/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Handler/Point.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Handler.Path
 * Handler to draw a path on the map.  Path is displayed on mouse down,
 * moves on mouse move, and is finished on mouse up.
 *
 * Inherits from:
 *  - <OpenLayers.Handler.Point>
 */
OpenLayers.Handler.ResumablePath = OpenLayers.Class(OpenLayers.Handler.Path, {
    
    EVENT_TYPES: ["pause"],
    
    initialize: function(control, callbacks, options) {
        // concatenate events specific to vector with those from the base
        this.EVENT_TYPES =
            OpenLayers.Handler.ResumablePath.prototype.EVENT_TYPES.concat(
            OpenLayers.Handler.Path.prototype.EVENT_TYPES
        );
        
        OpenLayers.Handler.Path.prototype.initialize.apply(this, arguments);
    },

    /**
     * Method: dblclick 
     * Handle double-clicks.  Finish the geometry and send it back
     * to the control.
     * 
     * Parameters:
     * evt - {Event} The browser event
     *
     * Returns: 
     * {Boolean} Allow event propagation
     */
    dblclick: function(evt) {
        this.dbl_click_event = evt;
        this.pause();
        //this.finishPath(evt);
        return false;
    },

    finishPath: function() {
        if(!this.freehandMode(this.dbl_click_event)) {
            var index = this.line.geometry.components.length - 1;
            this.line.geometry.removeComponent(this.line.geometry.components[index]);
            this.removePoint();
            this.finalize();
        }
    },

    CLASS_NAME: "OpenLayers.Handler.ResumablePath"
});
