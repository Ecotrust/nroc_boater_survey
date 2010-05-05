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
        var html_text = '<h2>Instructions</h2><p>A number of map layers such as nautical charts are available to assist you in finding where you went on your last trip. The map layers can be found to the top right of the map. Turn them on and off as needed by clicking the checkboxes.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_lyr', html:'Map Layers'},
			style: 'padding:5px',
            id: 'lyr_header_panel_point',
			border: false   
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'lyr_inner_panel',
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
            id: 'lyr_table_panel',
            items: [{
                html: '<p>Nautical Chart</p>'
            },{
                html: 'image here'
            },{
                html: '<p>Access Points</p>'
            },{
                html: 'image here'
            },{
                html: '<p>Bathymetry</p>'
            }, {
                html: 'image here'
            },{
                html: '<p class="video-link"><a href="'+ this.help_url +'" onclick="alert(\'Not implemented\'); return false" target="_blank">View Video Demonstration</a>'
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