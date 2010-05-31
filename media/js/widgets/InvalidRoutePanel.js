Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.InvalidRoutePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'invalid-route-panel',
    status_code: null,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('okay-btn');
		
        // Call parent (required)
        gwst.widgets.InvalidRoutePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config, status_code) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = gwst.settings.shape_error_text;
        if (this.status_code == 2) {
            html_text += gwst.settings.route_invalid_text;
        }
        html_text += '<p>Click the \'Continue\' button to try again.</p>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'invalid_route_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
		this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 110,
            left_margin: 50
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.InvalidRoutePanel.superclass.onRender.apply(this, arguments); 
	},
    
    contBtnClicked: function() {
        this.fireEvent('okay-btn',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-invalid-route-panel', gwst.widgets.InvalidRoutePanel);