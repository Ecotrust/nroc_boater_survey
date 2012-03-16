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
        var html_text = '<h2>Draw an Activity Area</h2>\
        <p style="padding-bottom: 5px;">Step 1. Click the "Draw Area" button on the right.</p>\
        <p>Step 2. Click once on the map for each \"corner\" of your activity and <u>double-click</u> to finish it.</p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'draw_header_panel',
            html: '<img src="/media/img/7_DrawArea_header.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'draw_inner_panel',
			style: 'margin: 10px 10px 0px 10px',
			border: false
		});

        this.panel_three = new Ext.Panel({
            html: '<p>Feel free to play around and try it out. Don\'t worry if you make a mistake. \
            A \'Redraw\' button will appear once you start drawing - you can use this button to restart your drawing. \
            You will also be able to edit or restart your area after you finish it.</p>\
            <p>Reminder: While we are interested in any activities you engaged in, we are particularly interested in:</p>\
            <ul class="instructions">\
            <li>Fishing</li>\
            <li>Wildlife viewing (whale watching, bird watching, etc.)</li>\
            <li>Diving</li>\
            <li>General hanging out while not underway</li>\
            <li>Other</li>\
            </ul>',
            border: false,
            style: 'padding:5px 5px 5px 10px'
        });
        
        this.demo_panel = new Ext.Panel({
			html: '<p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a>',
            id: 'area_demo_panel',
			// style: 'margin: 3px 3px 0px 10px',
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
            }]
        });      

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 140,
        	btn2_text: 'Skip this step',        	
            btn2_handler: this.skipStepClicked.createDelegate(this),
            btn2_width: 140,
            left_margin: 15
        });        

        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.panel_three);
        this.add(this.demo_panel);
        this.add(this.button_panel);
        this.add(this.table_panel);        
        
        // Call parent (required)
        gwst.widgets.DrawActivityInstructPanel.superclass.onRender.apply(this, arguments); 
	},
    
    skipStepClicked: function() {
        this.fireEvent('draw-skip',this);
    }

});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-draw-act-instruct-panel', gwst.widgets.DrawActivityInstructPanel);