/**
 * Class: OpenLayers.Control.borderPan
 * Pans the map when the mousePointer is near the borders of the map element.
 *
 */
OpenLayers.Control.BorderPan = OpenLayers.Class(OpenLayers.Control, {
    onMove: this.onMove,
    onOut: this.onOut,
    hoverPanBorderWidth: 35,
    panPx: 5,
    panning: false,
    
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
            this.map.events.unregister('mousemove', this, this.checkLocation);
            this.map.events.unregister('mouseout', this, this.stop);
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
    
    
    startPan: function(x, y){
        this.panning = true;
        this.pan(x, y, this.panning);
    },
    
    pan: function(x, y, cont) {
        if (cont) {
            var scope = this;
            
            setTimeout(function(){
                scope.map.pan(x, y, {'animate': false, 'dragging': false});
                scope.pan(x, y, scope.panning);
            }, 10);
        }
    },

    onMove: function(evt) {
        if (evt.xy.x < this.hoverPanBorderWidth) {
            if (evt.xy.y < this.hoverPanBorderWidth) {
                this.startPan(0 - this.panPx, 0 - this.panPx);
            } else if (evt.xy.y > this.map.getSize().h - this.hoverPanBorderWidth) {
                this.startPan(0 - this.panPx, this.panPx);
            } else {
                this.startPan(0 - this.panPx, 0);
            }
        } else if (evt.xy.x > this.map.getSize().w - this.hoverPanBorderWidth) {
            if (evt.xy.y < this.hoverPanBorderWidth) {
                this.startPan(this.panPx, 0 - this.panPx);
            } else if (evt.xy.y > this.map.getSize().h - this.hoverPanBorderWidth) {
                this.startPan(this.panPx, this.panPx);
            } else {
                this.startPan(this.panPx, 0);
            }
        } else if (evt.xy.y < this.hoverPanBorderWidth) {
            this.startPan(0, 0 - this.panPx);
        } else if (evt.xy.y > this.map.getSize().h - this.hoverPanBorderWidth) {
            this.startPan(0, this.panPx);
        } else {
            this.panning = false;
        }
    },
    
    onOut: function() {
        this.panning = false;
    },

    CLASS_NAME: "OpenLayers.Control.BorderPan"
}); 
