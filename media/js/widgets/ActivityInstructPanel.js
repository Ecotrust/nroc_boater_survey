Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInstructPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInstructPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity', html:'Drawing Your Activities'},
			style: 'padding:5px',
            id: 'activity_header_panel',
			border: false   
        }); 
        
		this.panel_one = new Ext.Panel({		
			html: '<p>On the next page you\'re going to draw areas \
                    along your route where you participated in different activities.</p>',
			style: 'margin: 10px',
			border: false
        });
    	
		this.panel_two = new Ext.Panel({		
			html: '<img style="padding-left:10px" src="/media/img/area_intro.png" />\
                    <p>Possible activities include: <i>fishing, sightseeing, hunting, etc...</i></p>\
                    <p>Press the \'Continue\' button to begin.  If you don\'t feel it\'s appropriate \
                    for you to complete this section press the \'Skip Activities\' button.</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });    	
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
            btn1_text: 'Skip Activities',        	
            btn1_handler: this.skipActClicked.createDelegate(this),
        	btn1_width: 130,
        	btn2_text: 'Continue >>',        	
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