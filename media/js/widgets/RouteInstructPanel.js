Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.RouteInstructPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.RouteInstructPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_route', html:'Drawing Your Route'},
			style: 'padding:5px',
            id: 'route_header_panel',
			border: false   
        }); 
        
		this.panel_one = new Ext.Panel({		
			html: '<h2>Instructions</h2><p>In the next step, you\'re going to draw one or more lines on the map representing the route you took on your last trip with the following vessel: <i><b>'+gwst.settings.vessel+'</b></i></p><p>You will draw your entire route even if your trip was multiple days or you came back the same way you went.</p>',
			style: 'margin: 10px',
			border: false
        });
    	
		this.panel_two = new Ext.Panel({		
			html: '<img src="/media/img/route_intro.png"><p>Click the \'Continue\' button</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });    	
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 140,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 120,
            left_margin: 40
        });
        
        this.add(this.header_panel);        
        this.add(this.panel_one);
        this.add(this.panel_two);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.RouteInstructPanel.superclass.onRender.apply(this, arguments);     
	},

    contBtnClicked: function() {
        this.fireEvent('route-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-route-instr-panel', gwst.widgets.RouteInstructPanel);