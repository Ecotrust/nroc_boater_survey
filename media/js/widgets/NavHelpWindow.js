Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavHelpWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	

        this.addEvents('view-nav-details');
        this.addEvents('close-nav-help');
	
		Ext.apply(this, {          
            title: 'Map Navigation Help',
        	layout:'fit',
            width:400,
            html: '<table><tr><td style="border:1px solid; padding: 5px; width:195px"><p class="help-win">Use the blue navigation controls to the left to zoom to where you started the trip on which you are reporting.</p></td>\
            <td style="border:1px solid; padding: 5px"><p style="text-align: right" class="help-win">Use the blue box to the right to change the map style.</p></td></tr></table>',
            height:200,
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