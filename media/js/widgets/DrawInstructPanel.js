Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DrawInstructPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-panel',
    help_url: gwst.settings.urls.draw_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('draw-cont');
        this.addEvents('draw-back');
		
        // Call parent (required)
        gwst.widgets.DrawInstructPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    getHtmlText: function() {
        var html_text = '<h2>Instructions:</h2>\
        <p>Draw the route of your last trip on the map from start to finish.</p>\
        <h2 style="margin: 15px 0px 0px 0px">How?</h2>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_draw', html:'Draw Your Route'},
			style: 'padding:5px',
            id: 'draw_header_panel',
			border: false   
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'draw_inner_panel',
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
            id: 'draw_table_panel',
            items: [{
                html: '<p>a. Click the \'Draw Route\' button.</p>'
            },{
                html: '<img src="/media/img/route_1.png" />'
            },{
                html: '<p>b. Click once on the map where you started your trip</p>'
            },{
                html: '<img src="/media/img/route_2.png" />'
            },{
                html: '<p>c. Move mouse and click to create a second point</p>'
            }, {
                html: '<img src="/media/img/route_3.png" />'
            },{
                html: '<p>d. Continue clicking along your boat route</p>'
            },{
                html: '<img src="/media/img/route_4.png" />'
            },{
                html: '<p>e. Use the arrow buttons to move the map as you go</p>'
            },{
                html: '<img src="/media/img/route_5.png" />'
            },{
                html: '<p>f. Double-click the last point to complete the route</p>'
            },{
                html: '<img src="/media/img/route_6.png" />'
            },{
                html: '<p>g. If you made a mistake, click the \'Cancel\' button</p>'
            },{
                html: '<img src="/media/img/route_7.png" />'
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
        gwst.widgets.DrawInstructPanel.superclass.onRender.apply(this, arguments); 
	},

	contBtnClicked: function() {
		this.fireEvent('draw-cont',this,this.resource);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-instruct-panel', gwst.widgets.DrawInstructPanel);