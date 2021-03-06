Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.MoreActivitiesPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'more-activities-panel',
	resource: 'unknown',
    shape_name: 'unknown',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('draw-new');
		
        // Call parent (required)
        gwst.widgets.MoreActivitiesPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h3>Would you like to plot more activities?</h3>';
        return html_text;
    },
	
    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'more_activities_header_panel',
            html: '<img src="/media/img/h_06_more_activities.png">',
	    border: 'north',
	    height: 54,
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'draw_new_area_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.YesNoButtons ({
            yes_handler: this.yesClicked.createDelegate(this),
            no_handler: this.noClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.MoreActivitiesPanel.superclass.onRender.apply(this, arguments); 
	},
    
    yesClicked: function() {
        this.fireEvent('draw-new',{draw_new:true});
    },
    
	noClicked: function() {
		this.fireEvent('draw-new',{draw_new:false});
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-more-activities-panel', gwst.widgets.MoreActivitiesPanel);
