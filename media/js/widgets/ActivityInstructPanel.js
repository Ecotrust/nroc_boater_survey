Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInstructPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInstructPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'activity_instruct_header_panel',
            html: '<img src="/media/img/6_DrawingActivities_header.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        }); 
        
		this.panel_one = new Ext.Panel({		
			html: '<p>On the next page we will ask you to draw areas where you participated in different activities during your trip. While there are many activities that you may take part in on the water, we are particularly interested in identifying areas where you were:</p>\
            <ul class="instructions"><li>Fishing</li>\
            <li>Wildlife viewing (whale watching, bird watching, etc.)</li>\
            <li>Diving</li>\
            <li>General hanging out while not underway</li>\
            <li>Other</li></ul>',
			style: 'margin: 10px',
			border: false
        });
    	
		this.panel_two = new Ext.Panel({		
			html: '<img style="padding-left:10px; padding-bottom: 10px" src="/media/img/area_intro.png" /><p>Please click on the \'Start Drawing\' button to begin drawing your activity areas. \
            If you didn\'t engage in any activities, click the \'Skip Activities\' button.</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });    	
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
            btn1_text: 'Skip Activities',        	
            btn1_handler: this.skipActClicked.createDelegate(this),
        	btn1_width: 130,
        	btn2_text: 'Start Drawing',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 120,
            left_margin: 15
        });
        
        this.add(this.header_panel);        
        this.add(this.panel_one);
        this.add(this.panel_two);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInstructPanel.superclass.onRender.apply(this, arguments);     
	},

    skipActClicked: function() {
        this.fireEvent('activity-skip',this);
    },
    
    contBtnClicked: function() {
        this.fireEvent('activity-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-instr-panel', gwst.widgets.ActivityInstructPanel);