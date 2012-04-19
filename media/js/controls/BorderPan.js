/**
 * Class: OpenLayers.Control.borderPan
 * Pans the map when the mousePointer is near the borders of the map element.
 *
 */
OpenLayers.Control.BorderPan = OpenLayers.Class(OpenLayers.Control, {
    onMove: this.onMove,
    onOut: this.onOut,
    panBorderWidth: 75,     //the buffer (in pixels) around each border that will trigger panning
    maxPxPan: 3,            //the max number of pixels panned per cycle
    panRate: 100,           //delay in milliseconds
    panning: false,
    blackoutBoxes: [],      //list objects given top, bottom, left and right bounds in pixels where border panning will not occur
    
    /**
     * APIMethod: activate
     */
    activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.map.events.register('mousemove', this, this.onMove);
            this.map.events.register('mouseout', this, this.onOut);
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
            this.map.events.unregister('mousemove', this, this.onMove);
            this.map.events.unregister('mouseout', this, this.onOut);
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

    pan: function(x, y, cont) {
        if (cont) {
            var scope = this;
            setTimeout(function(){
                scope.map.pan(x, y, {'animate': false, 'dragging': false});
                scope.pan(x, y, scope.panning);
            }, this.panRate);
        }
    },

    onMove: function(evt) {
        this.panPx = this.getPanPx(evt.xy);
        this.panning = false;
        if (this.panPx['xPx'] != 0 || this.panPx['yPx'] != 0){
            this.panning = true;
            this.pan(this.panPx['xPx'], this.panPx['yPx'], this.panning);
        } 
    },
    
    getPanPx: function(xy) {
        this.rightBound = this.map.getCurrentSize().w;
        this.bottomBound = this.map.getCurrentSize().h;
        this.x = 0;
        this.y = 0;
        this.blackout = false;
        for(var i = 0; i < this.blackoutBoxes.length; i++) {
            if (xy.x > this.blackoutBoxes[i]['left'] &&
                xy.x <= this.blackoutBoxes[i]['right'] &&
                xy.y > this.blackoutBoxes[i]['top'] &&
                xy.y <= this.blackoutBoxes[i]['bottom']) {
                this.blackout = true;
                continue;
            }
        }
        if(xy.x < 0 || xy.y < 0 || xy.x > this.rightBound || xy.y > this.bottomBound || this.blackout) {
            this.panning = false;
        } else {
            if (!(xy.x > this.panBorderWidth && xy.x < (this.rightBound - this.panBorderWidth))) {  //short circuit if between buffers
                if (xy.x < this.panBorderWidth) {                                   // inside left buffer
                    this.x = xy.x - this.panBorderWidth;
                } else if (xy.x > this.rightBound - this.panBorderWidth) {          // inside right buffer
                    this.x = xy.x - (this.rightBound - this.panBorderWidth);
                }
            }
            if (!(xy.y > this.panBorderWidth && xy.y < (this.bottomBound - this.panBorderWidth))) {  //short circuit if between buffers
                if (xy.y < this.panBorderWidth) {                                   // inside top buffer
                    this.y = xy.y - this.panBorderWidth;
                } else if (xy.y > this.bottomBound - this.panBorderWidth) {         // inside bottom buffer
                    this.y = xy.y - (this.bottomBound - this.panBorderWidth);
                }
            }
            if (this.maxPxPan != 0 && this.panBorderWidth != 0) {               //spread max px shift across border width
                if (this.x != 0) {
                    this.x = (this.x / this.panBorderWidth) * this.maxPxPan;
                }
                if (this.y != 0) {
                    this.y = (this.y / this.panBorderWidth) * this.maxPxPan;
                }
            }
        }
        return {'xPx': this.x, 'yPx': this.y};
    },
    
    onOut: function(evt) {
        this.rightBound = this.map.getCurrentSize().w;
        this.bottomBound = this.map.getCurrentSize().h;
        if(evt.xy.x < 0 || evt.xy.y < 0 || evt.xy.x > this.rightBound || evt.xy.y > this.bottomBound) {
            this.panning = false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.BorderPan"
}); 
