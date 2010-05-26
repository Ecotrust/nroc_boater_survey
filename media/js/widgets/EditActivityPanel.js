Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.EditActivityPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'edit-activity-panel',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('redraw-edit-act');
        this.addEvents('save-edit-act');
		
        // Call parent (required)
        gwst.widgets.EditActivityPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions:</h2> <p>Edit your area by adding, moving, or removing points along its path.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_edit_activity', html:'Edit Activity Area'},
			style: 'padding:5px',
            id: 'edit_activity_header_panel',
			border: false   
        }); 
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'edit_shape_inner_panel',
			style: 'margin: 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin: 5px; padding: 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'edit_activity_table_panel',
            items: [{
                html: '<p><b>How?</b></p>'
            },{
                html: ''
            },{
                html: '<p>The <i>dark orange</i> circles you see on your area are the points you added.</p>'
            },{
                html: '<img src="/media/img/edit_area_1.png" />'
            },{
                html: '<p>The <i>light orange</i> circles between your points are \'ghost\' points and are used to create new points.</p>'
            },{
                html: '<img src="/media/img/edit_area_2.png" />'
            },{
                html: '<p><b>Moving.</b> To move a point, click the mouse and drag it where you want, then release.</p>'
            }, {
                html: '<img src="/media/img/edit_area_3.png" />'
            },{
                html: '<p><b>Adding.</b> To add a point, click a \'ghost\' point and drag it where you want, then release.</p>'
            },{
                html: '<img src="/media/img/edit_area_4.png" />'
            },{
                html: '<p><b>Removing.</b> To remove a point, hover your mouse over it and press the \'Delete\' key on your keyboard.</p>'
            },{
                html: '<img src="/media/img/edit_area_5.png" />'
            }]
        });       
        
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
            btn1_text: 'Redraw instead',
            btn1_handler: this.redrawClicked.createDelegate(this),
        	btn1_width: 145,
        	btn2_text: 'Done editing',        	
            btn2_handler: this.saveEditActivityClicked.createDelegate(this),
            btn2_width: 110,
            left_margin: 10
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.EditActivityPanel.superclass.onRender.apply(this, arguments); 
	},
    
	redrawClicked: function() {
		this.fireEvent('redraw-edit-act',this);
    },
    
    saveEditActivityClicked: function() {
        this.fireEvent('save-edit-act',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-edit-activity-panel', gwst.widgets.EditActivityPanel);