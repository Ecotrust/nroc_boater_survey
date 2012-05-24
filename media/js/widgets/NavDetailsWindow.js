Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavDetailsWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	

		Ext.apply(this, {          
            title: 'Map Navigation Details',
        	layout:'fit',
            width:450,
            html: '<p class="help-win">Detailed Navigation Instructions:</p><ol><li class="help-win"><b>Move Map</b> - Click on the blue arrow buttons on the top left corner of the map, click & drag with your mouse, or use your keyboard arrows.</li><li class="help-win"><b>Zoom Map</b> - Zoom in and out by clicking the \'+\' and \'-\' buttons on the map or use the scroll wheel on your mouse if you have one.</li><li class="help-win">For even more detailed information, click the link for the \'detailed instructions\' page at the bottom of the screen.</li></ol>',
            height:350,
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction:'hide',
            closable: true,
            modal: true,
            draggable: false,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'Close',
                    handler: this.closeBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.NavDetailsWindow.superclass.initComponent.call(this);		
	},
    
    closeBtnClicked: function() {
        this.hide();
    },
    
    load: function() {
        this.show();
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-nav-help-window', gwst.widgets.NavDetailsWindow);