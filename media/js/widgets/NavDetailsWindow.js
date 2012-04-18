Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavDetailsWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	

		Ext.apply(this, {          
            title: 'Map Navigation Details',
        	layout:'fit',
            width:450,
            html: '<p>Detailed Instructions:</p>\
            <ol>\
                <li><b>Move Map</b> - Click on the blue arrow buttons on the screen, click and drag with your mouse, or use your keyboard arrows to center the map over your starting location.</li>\
                <li><b>Zoom Map</b> - Zoom in and out by clicking the \'+\' and \'-\' buttons on the map or use the scroll wheel on your mouse if you have one.</li>\
                <li>Please get as close as you can to your starting point, then click the Continue button below.</li>\
            </ol>',
            height:300,
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