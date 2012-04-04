Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedActivityPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-activity-panel',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
        // this.addEvents('edit-activity');
        this.addEvents('redraw-activity');
        this.addEvents('save-activity');
		
        // Call parent (required)
        gwst.widgets.SatisfiedActivityPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h3>Are you satisfied with this point?</h3>';
        return html_text;
    },
	
    onRender: function(){
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'satisfied_shape_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.button_panel = new gwst.widgets.CustomButtons ({
            col_width: 250,
            num_cols: 1,
            element_list: [{
                elem: this.redrawClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'No, re-plot activity point',
                type: 'text'
            },{
                // elem: this.editClicked.createDelegate(this),
                // type: 'handler'
            // },{
                // elem: 'No, edit',
                // type: 'text'
            // },{
                elem: this.saveClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Yes, save activity point',
                type: 'text'
            }]
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedActivityPanel.superclass.onRender.apply(this, arguments); 
	},
    
    editClicked: function() {
        this.fireEvent('edit-act',this);
    },
    
	redrawClicked: function() {
		this.fireEvent('redraw-act',this);
    },
    
    saveClicked: function() {
        this.fireEvent('save-act',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-activity-panel', gwst.widgets.SatisfiedActivityPanel);