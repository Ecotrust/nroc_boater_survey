Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FinishPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_finish', html:'Finished'},
			style: 'padding:5px',
            id: 'finish_panel',
			border: false   
        }); 
        
		this.inner_panel = new Ext.Panel({		
			html: '<p>Your survey is now complete for the month of '+gwst.settings.month+'!  Press the Continue button for more information.</p>',
			style: 'margin: 10px',
			border: false
        });
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 140,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 120,
            left_margin: 20,
            bottom_margin: 5
        });
        
        
        this.add(this.header_panel);        
        this.add(this.inner_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.onRender.apply(this, arguments);     
	},
    
    contBtnClicked: function() {
        this.fireEvent('finish-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-finish-panel', gwst.widgets.FinishPanel);