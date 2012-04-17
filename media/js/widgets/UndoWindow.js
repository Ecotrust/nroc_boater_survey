Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.UndoWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){		
		this.addEvents('undo-clicked');
		
		Ext.apply(this, {          
            height: 25,
            width: 80,
            layout:'fit',
            html:'',
            resizable: false,
            closable: false,
            collapsible: false,
            draggable: false,
            tbar: [{
				text: 'Undo',
                iconCls: 'undo-icon',
				handler: this.undoClicked,
				scope: this
            }]                   
        });
		gwst.widgets.UndoWindow.superclass.initComponent.call(this);		
	},
	
	undoClicked: function() {
		this.fireEvent('undo-clicked');
	}	
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-undo-window', gwst.widgets.UndoWindow);