Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FinishPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.FinishPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'finish_header_panel',
            html: '<img src="/media/img/h_07_finished.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });
        
		this.inner_panel = new Ext.Panel({		
			html: '<p>Thank you for completing the survey for the month of '+gwst.settings.month+'.</p>\
            <p>Press the Continue button for more information about the prizes.</p>',
			style: 'margin: 10px',
			border: false
        });
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this)
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