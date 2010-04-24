Ext.namespace('gwst.DrawApp');

/*
gwst.ResDrawApp - application class for resource group drawing.  Extends Ext.Observable providing event handling
*/
gwst.DrawApp = Ext.extend(Ext.util.Observable, {
    constructor: function(){
		gwst.DrawApp.superclass.constructor.call(this);
    },

    init: function(){
		this.draw_manager = new gwst.DrawManager();
		this.draw_manager.startInit();		        	        
    }	
});
	