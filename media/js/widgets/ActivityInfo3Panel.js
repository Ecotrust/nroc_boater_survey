Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo3Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInfo3Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity_info3', html:'Activity Questions 3'},
			style: 'padding:5px',
            id: 'activity_info3_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>If you could not have engaged in this activity at this location, what would you have done instead?</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });
        
        this.answer_one = new Ext.Panel({
            html: 'Q1 dropdown here',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
        
        this.other_text_one = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_one = new Ext.Panel({
            html: '|',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
        
        this.question_two = new Ext.Panel({		
			html: '<p>Please choose the MAIN activity in which you would have most likely engaged.</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });
        
        this.answer_two = new Ext.Panel({
            html: 'Q2 dropdown here',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
        
        this.other_text_two = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_two = new Ext.Panel({
            html: '|',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
        });
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 120,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 100,
            left_margin: 20,
            bottom_margin: 5
        });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.answer_one);
        this.add(this.other_text_one);
        this.add(this.other_one);
        this.add(this.question_two);
        this.add(this.answer_two);
        this.add(this.other_text_two);
        this.add(this.other_two);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo3Panel.superclass.onRender.apply(this, arguments);     
	},
    
    contBtnClicked: function() {
        this.fireEvent('activity-info3-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info3-panel', gwst.widgets.ActivityInfo3Panel);