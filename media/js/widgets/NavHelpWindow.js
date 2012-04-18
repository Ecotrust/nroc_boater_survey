Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavHelpWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	

        this.addEvents('view-nav-details');
        this.addEvents('close-nav-help');
	
		Ext.apply(this, {          
            title: 'Map Navigation Help',
        	layout:'fit',
            width:350,
            html: '<p>Use the blue navigation controls here to zoom to where you started the trip on which you are reporting.</p>',
            height:150,
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction: 'hide',
            closable: true,
            modal: false,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'View detailed instructions',
                    handler: this.instructionsBtnClicked.createDelegate(this)
                },
                {
                    xtype:'tbseparator',
                    width: 15
                },
                {
                    text: 'Close',
                    handler: this.closeBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.NavHelpWindow.superclass.initComponent.call(this);		
	},

    instructionsBtnClicked: function() {
        this.fireEvent('view-nav-details', this);
    },
    
    closeBtnClicked: function() {
        this.hide();
    },
    
    load: function() {
        this.show();
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-nav-help-window', gwst.widgets.NavHelpWindow);