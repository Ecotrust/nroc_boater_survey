Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo4Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInfo4Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity_info4', html:'Secondary Location'},
			style: 'padding:5px',
            id: 'activity_info4_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>Since you said you would engage in this activity at another location if you had to, please draw the location you most likely would have gone on the map.</p><p>You will draw this alternate area just like you did your original activity area, starting with clicking the \'Draw New Area\' button.  Move and zoom and map as needed to get to this location first.</p>',
			style: 'margin: 10px',
			border: false
        });
        
        // this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	// btn1_width: 120,
        	// btn2_text: 'Continue >>',        	
            // btn2_handler: this.contBtnClicked.createDelegate(this),
            // btn2_width: 100,
            // left_margin: 20
        // });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        // this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo4Panel.superclass.onRender.apply(this, arguments);     
	}
    
    // contBtnClicked: function() {
        // this.fireEvent('activity-info4-cont',this);
    // }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info4-panel', gwst.widgets.ActivityInfo4Panel);