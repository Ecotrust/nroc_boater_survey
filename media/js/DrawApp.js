Ext.namespace('gwst.DrawApp');

/*
gwst.ResDrawApp - application class for resource group drawing.  Extends Ext.Observable providing event handling
*/
gwst.DrawApp = Ext.extend(Ext.util.Observable, {
    constructor: function(){
		gwst.DrawApp.superclass.constructor.call(this);
    },

    init: function(){
        OpenLayers.Util.onImageLoadError = function() {
            /**
             * For images that don't exist in the cache, you can display
             * a default image - one that looks like water for example.
             * To show nothing at all, leave the following lines commented out.
             */
            this.src = "/media/img/geowebcache-404_NOAA.png";
            this.style.display = "";
        };    
    
		this.draw_manager = new gwst.DrawManager();
		this.draw_manager.startInit();		        	        
    }	
});

window.onbeforeunload = function confirmBrowseAway() {
    return "If you leave now your survey will be left unfinished.";
}
