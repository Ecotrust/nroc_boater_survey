Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResetMapCheckWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	
        this.addEvents('confirm');

		Ext.apply(this, {          
        	layout:'fit',
            width:350,
            html: '<p><b>Are you sure you want to reset the map window?</b><br /><br />Your routes and areas will not be lost.</p>',
            height:120,
            plain: true,
            bodyStyle: 'padding: 8px',
            closeAction:'hide',
            closable: false,
            modal: true,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'Yes',
                    handler: this.yesBtnClicked.createDelegate(this)
                },
                {xtype:'tbseparator'},
                {
                    text: 'No',
                    handler: this.noBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.ResetMapCheckWindow.superclass.initComponent.call(this);		
	},
    
    yesBtnClicked: function() {
        this.fireEvent('confirm');
        this.hide();
    },
    
    noBtnClicked: function() {
        this.hide();
    }    
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-reset-map-check-window', gwst.widgets.ResetMapCheckWindow);