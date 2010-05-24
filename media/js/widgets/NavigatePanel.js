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
        var html_text = '<h2>Instructions</h2><p>Navigate the map and zoom in to the area you took your last boat trip for the following vessel: <i><b>'+gwst.settings.vessel+'</i></b>.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_html_point', html:'Navigate the Map'},
			style: 'padding:5px',
            id: 'intro_header_panel',
			border: false   
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'nav_inner_panel',
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
            id: 'nav_table_panel',
            items: [{
                html: '<p>a. Use the arrow buttons to pan the map North, South, East or West centering the map over your starting location.'
            },{
                html: '<img src="/media/img/nav_arrows.png">'
            },{
                html: '<p>b. Zoom the map in and out by clicking the \'+\' and \'-\' buttons on the map.</p>'
            },{
                html: '<img src="/media/img/nav_zoombar.png">'
            },{
                html: '<p>c. Get as close as you can then press the Continue button</p>'
            }]
        });       

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
                btn1_width: 140,
                btn2_text: 'Continue >>',               
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 100,
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