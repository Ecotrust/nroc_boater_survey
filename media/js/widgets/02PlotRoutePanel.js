Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.PlotRoutePanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'plot-route-panel',
    help_checked: false,
    help_url: gwst.settings.urls.draw_help,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});

        this.addEvents('show-help');
        
        // Call parent (required)
        gwst.widgets.PlotRoutePanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    getHtmlText: function() {
        var html_text = '<h2>Plot your route on the map</h2>\
        <p style="padding-bottom:3px">Click on your departure point to begin plotting route.</p>\
        <p>Click once for each turn (or waypoint) and double-click to finish plotting your route.</p>\
        <p style="padding-bottom:3px">Please remember to plot a complete route, including your return leg even if you came back the same way.</p>';
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
        
        this.panel_three = new Ext.Panel({
            html: "Feel free to play around and try it out. Don't worry if you make a mistake. \
                A 'Redraw' button will appear once you start plotting - you can use it to redraw your route. \
                You will also be able to edit or restart your route after you finish it.",
            border: false,
            style: 'padding:5px 5px 5px 10px'
        });
        
        this.help_box = new Ext.form.Checkbox({
            boxLabel: 'Show help on map',
            fieldLabel: '(f)Show help on map',
            checked: this.help_checked,
            handler: this.helpCheck,
            id: 'route-help-checkbox',
            name: 'routeHelpCheckbox'
        });
        
        this.demo_panel = new Ext.Panel({
			html: '<p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a>',
            id: 'draw_demo_panel',
			border: false
		});
        
        this.help_panel = new Ext.Panel({
            layout: {
                type: 'hbox',
                padding: '5'
            },
        });
        
        this.help_panel.add(this.demo_panel);
        this.help_panel.add(this.help_box);
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.panel_three);
		this.add(this.help_panel);
        
        // Call parent (required)
        gwst.widgets.PlotRoutePanel.superclass.onRender.apply(this, arguments); 
	},
    
    helpCheck: function() {
        this.fireEvent('show-help', this.checked);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-plot-route-panel', gwst.widgets.PlotRoutePanel);