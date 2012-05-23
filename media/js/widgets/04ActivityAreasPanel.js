Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityAreasPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'draw-panel',
    help_url: gwst.settings.urls.draw_act_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
        this.addEvents('show-help');
        
        // Call parent (required)
        gwst.widgets.ActivityAreasPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    getHtmlText: function() {
        var html_text = '<h2>Step 3: Plot activities from your trip</h2>\
        <p>Click on the map to place a marker near where you participated in an activity while boating.</p>\
        <p style="padding-bottom: 0; margin-bottom: 0;">While we are interested in any activities you engaged in, we are particularly interested in:</p>\
        <ul class="instructions">\
            <li>Fishing</li>\
            <li>Wildlife viewing (whales, birds, etc.)</li>\
            <li>SCUBA Diving</li>\
            <li>Swimming</li>\
            <li>Relaxing at anchor</li>\
        </ul>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'draw_header_panel',
            html: '<img src="/media/img/h_04_activity_areas.png">',
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
            html: '<p>Don\'t worry if you make a mistake. \
            You will have the chance to re-plot your point after you finish it</p>',
            border: false,
            style: 'padding:5px 5px 5px 10px'
        });
        
        this.demo_panel = new Ext.Panel({
			html: '<div class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a></div>',
            id: 'area_demo_panel',
			// style: 'margin: 3px 3px 0px 10px',
			border: false
		});
        
        this.help_box = new Ext.form.Checkbox({
            boxLabel: 'Show help',
            fieldLabel: '(f)Show help',
            checked: this.help_checked,
            handler: this.helpCheck,
            id: 'act-help-checkbox',
            name: 'actHelpCheckbox'
        });
        
        this.help_panel = new Ext.Panel({
            cls: 'help-panel',
            layout: {
                type: 'hbox',
                defaultMargins: {left: 10, top: 3, right: 10, bottom: 3}
            },
            title: 'Having trouble?',
            border: true
        });
        
/*        
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
*/

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Skip this step',        	
            btn2_handler: this.skipStepClicked.createDelegate(this)
        }); 

        
        this.help_panel.add(this.help_box);
        this.help_panel.add(this.demo_panel);

        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.panel_three);
        this.add(this.button_panel);
        this.add(this.help_panel);
        // this.add(this.table_panel);        
        
        // Call parent (required)
        gwst.widgets.ActivityAreasPanel.superclass.onRender.apply(this, arguments); 
	},
    
    skipStepClicked: function() {
        this.fireEvent('draw-skip',this);
    },
    
    helpCheck: function() {
        this.fireEvent('show-help', this.checked);
    }

});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-act-areas-panel', gwst.widgets.ActivityAreasPanel);