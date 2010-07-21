Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavigatePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'navigate-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    user_group: 'unknown',
    help_url: gwst.settings.urls.nav_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('nav-cont');
        this.addEvents('nav-back');
		
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>How to Navigate the Map</h2><p>Use the blue navigation controls on the right to zoom to where you started the trip on which you are reporting.</p><h2>Detailed Instructions</h2>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_html_point', html:'Instructions Page 1/3'},
			style: 'padding:5px',
            id: 'intro_header_panel',
			border: false   
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'nav_inner_panel',
			style: 'margin: 10px 10px 0px 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin-left: 5px; margin-right:5px; padding-left: 5px; padding-right: 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 5px 5px 5px 10px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'nav_table_panel',
            items: [{
                html: 'a. Use the arrow buttons to pan the map North, South, East or West centering the map over your starting location.'
            },{
                html: '<img src="/media/img/nav_arrows.png">'
            },{
                html: 'b. Zoom the map in and out by clicking the \'+\' and \'-\' buttons on the map, or the scroll wheel on your mouse, if you have one.'
            },{
                html: '<img src="/media/img/nav_zoombar.png">'
            },{
                html: 'c. Get as close as you can to your starting point, then press the Continue button'
            }]
        });         

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
                btn1_width: 90,
                btn2_text: 'Continue to page 2 >>',               
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 200,
            left_margin: 40
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.NavigatePanel.superclass.onRender.apply(this, arguments); 
	},
    
    skipClicked: function() {
        this.fireEvent('nav-skip',this);
    },
    
	contBtnClicked: function() {
		this.fireEvent('nav-cont',this,this.resource);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-navigate-panel', gwst.widgets.NavigatePanel);