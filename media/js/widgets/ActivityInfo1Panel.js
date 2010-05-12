Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo1Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInfo1Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity_info1', html:'Activity Information'},
			style: 'padding:5px',
            id: 'activity_info1_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>What was the primary activity you were engaged in?</p>',
			style: 'margin: 10px',
			border: false
        });
        
        this.answer_one = new Ext.Panel({
            html: 'Q1 dropdown here',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
    	
		this.question_two = new Ext.Panel({		
			html: '<p>How long did you engage in this activity in this area?</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });
        
        this.answer_two = new Ext.Panel({
            html: 'Q2 dropdown here',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
        
        this.question_three = new Ext.Panel({		
			html: '<p>On a scale of 1 to 5 (with 1 being much worse and 5 being much better) how do you rank this area for this activity compared to other areas in Massachusetts where you have done this?</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });
        
        this.answer_three = new Ext.Panel({
            html: 'Q3 dropdown here',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 120,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 100,
            left_margin: 20
        });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.answer_one);
        this.add(this.question_two);
        this.add(this.answer_two);
        this.add(this.question_three);
        this.add(this.answer_three);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo1Panel.superclass.onRender.apply(this, arguments);     
	},
    
    contBtnClicked: function() {
        this.fireEvent('activity-info1-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info1-panel', gwst.widgets.ActivityInfo1Panel);