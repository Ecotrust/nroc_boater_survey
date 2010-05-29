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
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_route', html:'Instructions Page 3/3'},
			style: 'padding:5px',
            id: 'route_header_panel',
			border: false   
        }); 
        
		this.panel_one = new Ext.Panel({		
			html: '<h2>How to Draw Your Route</h2><p><i>On the NEXT page</i>, you\'re going to draw your last trip boat route on the map. Please remember to plot a ROUNDTRIP route.</p>',
			style: 'margin: 10px',
			border: false
        });
    	
		this.panel_two = new Ext.Panel({		
			html: '<img style="margin: 0px 0px 10px 10px" src="/media/img/route_intro.png">',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });    	
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 80,
        	btn2_text: 'OK, let\'s begin drawing!',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 210,
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