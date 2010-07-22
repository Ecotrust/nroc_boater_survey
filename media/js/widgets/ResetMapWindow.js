Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResetMapWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('reset-button');
		
		Ext.apply(this, {          
            height: 25,
            width:152,
            layout:'fit',
            html:'blort',
            closable: false,
            resizable: false,
            tbar: [{
				text: 'Reset Map View',
				iconCls: 'reset-map',
				handler: this.resetMap,
				scope: this
            }]                   
        });
		gwst.widgets.ResetMapWindow.superclass.initComponent.call(this);		
	},
	
	resetMap: function() {
		this.fireEvent('reset-map');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-reset-map-window', gwst.widgets.ResetMapWindow);