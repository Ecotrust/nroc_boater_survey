Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.AddRouteWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('add-route-clicked');
		
		Ext.apply(this, {          
            height: 25,
            width: 125,
            layout:'fit',
            html:'',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
				text: 'Plot Route',
				iconCls: 'draw-icon',
				handler: this.addClicked,
				scope: this
            }]                   
        });
		gwst.widgets.AddRouteWindow.superclass.initComponent.call(this);		
	},
	
	addClicked: function() {
		this.fireEvent('draw-route-clicked');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-add-route-window', gwst.widgets.AddRouteWindow);