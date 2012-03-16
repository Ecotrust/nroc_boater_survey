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
        var html_text = '<h2>First, Plot Your Route</h2>\
        <p style="padding-bottom:3px">Step 1. Zoom to where you started your trip using a combination of the blue arrows on the screen (or the arrow keys on your keyboard) and the + and - buttons (or the wheel on your mouse).</p>\
        <p style="padding-bottom:3px">Step 2. Click the "Plot Route" button to start plotting your complete route, including your return lef even if you came back the same way.</p>\
        <p style="padding-bottom:3px">Step 3. Click once for each turn (or waypoint) and <u>double-click</u> to finish plotting your route.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'draw_instruct_header_panel',
            html: '<img src="/media/img/4_DrawRoute_header.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'draw_inner_panel',
			style: 'margin: 10px 10px 0px 5px',
			border: false
		});
        
        this.table_panel = new Ext.Panel({
            title: 'View more detailed drawing instructions',
            collapsible: true,
            collapsed: true,          
            layout: 'table',
            border: false,
            style: 'margin: 5px 5px 5px 5px; padding: 0px 5px 5px 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 0px 5px 5px 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'draw_table_panel_2',
            items: [{
                html: '<p>a. Click the \'Plot Route\' button.</p>'
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
                html: '<p>g. If you made a mistake, click the \'Redraw\' button</p>'
            },{
                html: '<img src="/media/img/route_7.png" />'
            }]
        });       

        this.panel_three = new Ext.Panel({
            html: "Feel free to play around and try it out. Don't worry if you make a mistake. \
                A 'Redraw' button will appear once you start plotting - you can use it to redraw your route. \
                You will also be able to edit or restart your route after you finish it.",
            border: false,
            style: 'padding:5px 5px 5px 10px'
        });
        
        this.demo_panel = new Ext.Panel({
			html: '<p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a>',
            id: 'draw_demo_panel',
			// style: 'margin: 3px 3px 0px 10px',
			border: false
		});

        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.panel_three);
		this.add(this.demo_panel);
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