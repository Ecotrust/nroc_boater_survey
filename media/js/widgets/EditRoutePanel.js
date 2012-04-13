Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.EditRoutePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'edit-route-panel',
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('redraw-edit-route');
        this.addEvents('save-edit-route');
		
        // Call parent (required)
        gwst.widgets.EditRoutePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Instructions</h2> <p>Edit your boat route by adding, moving, or removing points along its path.</p><h2>How?</h2>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'edit_route_header_panel',
            html: '<img src="/media/img/h_02_plot_route.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        }); 
    
		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'edit_shape_inner_panel',
			style: 'margin: 10px 10px 0px 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin: 0px 5px 5px 5px; padding: 0px 5px 5px 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 0px 5px 5px 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'edit_route_table_panel',
            items: [{
                html: '<p>The <i>dark orange</i> circles you see on your route are the points you added.</p>'
            },{
                html: '<img src="/media/img/edit_route_1.png" />'
            },{
                html: '<p>The <i>light orange</i> circles between your points are \'ghost\' points and are used to create new points.</p>'
            },{
                html: '<img src="/media/img/edit_route_2.png" />'
            },{
                html: '<p><b><u>Moving</u></b>. To move an existing point, click and drag a dark orange cirle where you want, then release.</p>'
            }, {
                html: '<img src="/media/img/edit_route_3.png" />'
            },{
                html: '<p><b><u>Adding</u></b>. To add a point, click a \'ghost\' point and drag it where you want, then release.</p>'
            },{
                html: '<img src="/media/img/edit_route_4.png" />'
            },{
                html: '<p><b><u>Removing</u></b>. To remove a point hold your mouse over it and press the \'Delete\' key on your keyboard.</p>'
            },{
                html: '<img src="/media/img/edit_route_5.png" />'
            },{
                html: '<p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a>'
            }]
        });       
        
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
            btn1_text: 'Redraw instead',
            btn1_handler: this.redrawClicked.createDelegate(this),
        	btn2_text: 'Done editing',        	
            btn2_handler: this.saveEditRouteClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.EditRoutePanel.superclass.onRender.apply(this, arguments); 
	},
    
	redrawClicked: function() {
		this.fireEvent('redraw-edit-route',this);
    },
    
    saveEditRouteClicked: function() {
        this.fireEvent('save-edit-route',this);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-edit-route-panel', gwst.widgets.EditRoutePanel);