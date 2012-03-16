Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.SatisfiedRoutePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'satisfied-route-panel',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('cont-route');
        this.addEvents('edit-route');
        this.addEvents('redraw-route');
        this.addEvents('save-route');
		
        // Call parent (required)
        gwst.widgets.SatisfiedRoutePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h3>Are you satisfied with this route?</h3>\
        <h3>Did you plot your complete route from start to finish (even if you came back the same way)?</p>';
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
            col_width: 150,
            element_list: [{
                elem: this.contClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Continue route',
                type: 'text'
            },{
            	elem: 'Continue where you left off',
            	type: 'text'            	
            },{
                elem: this.editClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Edit route',
                type: 'text'
            },{
                elem: 'Make some edits to this route',
                type: 'text'
            },{
                elem: this.redrawClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Re-plot route',
                type: 'text'
            },{
                elem: 'Discard this route and plot it again',
                type: 'text'
            },{
                elem: this.saveClicked.createDelegate(this),
                type: 'handler'
            },{
                elem: 'Save route',
                type: 'text'
            },{
                elem: 'I\'m done. Save this route and move on',
                type: 'text'
            }]
        });
        
		this.add(this.inner_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.SatisfiedRoutePanel.superclass.onRender.apply(this, arguments); 
	},
    
    contClicked: function() {
		this.fireEvent('cont-route',this);
    },
    
    editClicked: function() {
        this.fireEvent('edit-route',this);
    },
    
	redrawClicked: function() {
		this.fireEvent('redraw-route',this);
    },
    
    saveClicked: function() {
        this.fireEvent('save-route',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-satisfied-route-panel', gwst.widgets.SatisfiedRoutePanel);