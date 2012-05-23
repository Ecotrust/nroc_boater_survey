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
        var html_text = '<h2>Step 2: Plot your route on the map</h2>\
        <p style="padding-bottom:3px">Please remember to plot a complete route, including your return leg even if you came back the same way.</p>\
        <ul><li type="disc">Click on your departure point to begin plotting route.</li>\
        <li type="disc">Click once for each turn (or waypoint) and double-click to finish plotting your route.</li></ul>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'draw_instruct_header_panel',
            html: '<img src="/media/img/h_02_plot_route.png">',
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
            html: "<p>Don't worry if you make a mistake. \
                You will be able to redraw and/or undo your last point using the blue buttons on the top left of the map. \
                You will also be able to edit or restart your route after you finish it.</p>",
            border: false,
			style: 'margin: 0 10px 0px 5px'
        });
        
        this.help_img = new Ext.Panel({
            html: '<img style="margin-left:auto; margin-right:auto" src="/media/img/route_click.gif" id="route_help" />',
            border: false,
            bodyStyle: 'text-align: center',
            style: 'margin-bottom: 8px'
        });
        
        this.help_box = new Ext.form.Checkbox({
            boxLabel: 'Show help',
            fieldLabel: '(f)Show help',
            checked: this.help_checked,
            handler: this.helpCheck,
            id: 'route-help-checkbox',
            name: 'routeHelpCheckbox'
        });
        
        this.demo_panel = new Ext.Panel({
			html: '<div class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a></div>',
            id: 'draw_demo_panel',
			border: false
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
        
        this.help_panel.add(this.help_box);
        this.help_panel.add(this.demo_panel);
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
		this.add(this.help_img);
		this.add(this.panel_three);
		this.add(this.help_panel);
        
        setInterval(function () {
            var img = document.getElementById("route_help"),
            src=img.getAttribute("src");
            img.setAttribute("src",src);
        }, 20000);
        
        // Call parent (required)
        gwst.widgets.PlotRoutePanel.superclass.onRender.apply(this, arguments); 
	},

    helpCheck: function() {
        this.fireEvent('show-help', this.checked);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-plot-route-panel', gwst.widgets.PlotRoutePanel);