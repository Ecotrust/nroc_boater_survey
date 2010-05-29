Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.LayerInstructPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'lyr-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    user_group: 'unknown',
    help_url: gwst.settings.urls.lyr_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('lyr-cont');
        this.addEvents('lyr-back');
		
        // Call parent (required)
        gwst.widgets.LayerInstructPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>How to Change Your Base Map</h2>\
        <p>You can change your base map by clicking different base layers in the blue box on the top right of your screen.</p>\
        <img src="/media/img/layers.png" style="margin-left: 10px; margin-bottom: 8px" />\
        <h2 style="margin-bottom: 0px">Available Layers</h2>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_lyr', html:'Instructions Page 2/3'},
			style: 'padding:5px',
            id: 'lyr_header_panel',
			border: false   
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'lyr_inner_panel',
			style: 'margin: 3px 3px 0px 10px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            layout: 'table',
            border: false,
            style: 'margin: 5px 5px 5px 10px; padding: 0px 5px 5px 5px',
            defaults: {
                bodyStyle: 'border: none; margin: 0px; padding: 0px 5px 0px 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'lyr_table_panel',
            items: [{
                html: '<p style="margin: 0px">Nautical Charts</p>'
            },{
                html: '<p style="margin: 0px">Satellite</p>'
            },{
                html: '<img src="/media/img/nautical.png" />'
            },{
                html: '<img src="/media/img/satellite.png" />'
            },{
                html: '<p style="margin: 5px 0px 0px 0px">Terrain</p>'
            },{
                html: '<p style="margin: 5px 0px 0px 0px">Boat Ramps</p>'
            },{
                html: '<img src="/media/img/terrain.png" />'
            },{
                html: '<img src="/media/img/boat_ramps.png" />'
            },{
                html: '<p style="margin: 5px 0px 0px 0px">Marinas</p>'
            },{
                html: ''
            },{
                html: '<img src="/media/img/marinas.png" />'
            },{
                html: ''
            }]
        });       

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
                btn1_width: 90,
                btn2_text: 'Continue to page 3 >>',               
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 200,
            left_margin: 40
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.LayerInstructPanel.superclass.onRender.apply(this, arguments); 
	},
    
    skipClicked: function() {
        this.fireEvent('lyr-skip',this);
    },
    
	contBtnClicked: function() {
		this.fireEvent('lyr-cont',this,this.resource);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-layer-instruct-panel', gwst.widgets.LayerInstructPanel);