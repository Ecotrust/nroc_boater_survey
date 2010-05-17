Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawActivityInstructPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-panel',
    help_url: gwst.settings.urls.draw_act_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
        // Call parent (required)
        gwst.widgets.DrawActivityInstructPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    getHtmlText: function() {
        var html_text = '<h2>Instructions:</h2><p>Draw one area where an activity took place on your last trip.  Be as specific as you can, you\'ll be able to draw additional areas.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_draw', html:'Draw an Activity Area'},
			style: 'padding:5px',
            id: 'draw_header_panel',
			border: false   
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'draw_inner_panel',
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
            id: 'draw_table_panel',
            items: [{
                html: '<p><b>How?</b></p>'
            },{
                html: ''
            },{
                html: '<p>a. First, click the \'Draw Area\' button</p>'
            },{
                html: '<img src="/media/img/area_1.png" />'
            },{
                html: '<p>b. Click once on the map to start drawing your area</p>'
            },{
                html: '<img src="/media/img/area_2.png" />'
            },{
                html: '<p>c. Move mouse and click to create a second point</p>'
            }, {
                html: '<img src="/media/img/area_3.png" />'
            },{
                html: '<p>d. Continue clicking, tracing out the boundary of your area</p>'
            },{
                html: '<img src="/media/img/area_4.png" />'
            },{
                html: '<p>e. Use the arrow buttons to move the map as you go</p>'
            },{
                html: '<img src="/media/img/area_5.png" />'
            },{
                html: '<p>f. Double-click the last point to complete the area</p>'
            },{
                html: '<img src="/media/img/area_6.png" />'
            },{
                html: '<p>g. If you made a mistake, click the \'Cancel\' button to start over</p>'
            },{
                html: '<img src="/media/img/area_7.png" />'
            },{
                html: '<a>Watch Demonstration</a>'  //TODO: link this to video
            },{
                html: ''
            }]
        });       

        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.table_panel);
        
        // Call parent (required)
        gwst.widgets.DrawActivityInstructPanel.superclass.onRender.apply(this, arguments); 
	}

});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-act-instruct-panel', gwst.widgets.DrawActivityInstructPanel);