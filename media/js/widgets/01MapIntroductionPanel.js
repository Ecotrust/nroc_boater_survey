Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.IntroPanel = Ext.extend(gwst.widgets.WestPanel, {
    id: 'into-panel',
	resource: 'unknown',
    shape_name: 'unknown',
    user_group: 'unknown',
    help_url: gwst.settings.urls.nav_help,
    help_checked: false,
	
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
        // Constructor, config object already applied to 'this' so properties can 
        // be created and added/overridden here: Ext.apply(this, {});
		
		this.addEvents('intro-cont');
        this.addEvents('intro-back');
        this.addEvents('show-help');
		
        // Call parent (required)
        gwst.widgets.IntroPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    updateText: function(text_config) {
        Ext.apply(this, text_config);
        this.inner_panel.getEl().update(this.getHtmlText());
    },
    
    getHtmlText: function() {
        var html_text = '<h2>Step 1: Zoom to Boating Area</h2><p><b>Zoom in on the map to where you started your last trip.</b></p><p><b>A: Select the state where you departed:</b></p>';
        return html_text;
    },
	
    onRender: function(){
    
        this.header_panel = new Ext.Panel({  
            id: 'intro_header_panel',
            html: '<img src="/media/img/h_01_map_introduction.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        }); 

		this.inner_panel = new Ext.Panel({
			html: this.getHtmlText(),
            id: 'intro_inner_panel',
			style: 'margin: 10px 10px 0px 10px',
			border: false
		});
        
        this.state_radio_group = new Ext.form.RadioGroup({
            id: 'state-radio-group',
            xtype: 'radiogroup',
            itemCls: 'x-radio-group',
            width: 250,
            columns: 2,
            items: [
                {boxLabel: 'New York', name: 'state', inputValue: 'new-york'},
                {boxLabel: 'New Jersey', name: 'state', inputValue: 'new-jersey'},
                {boxLabel: 'Delaware', name: 'state', inputValue: 'delaware'},
                {boxLabel: 'Maryland', name: 'state', inputValue: 'maryland'},
                {boxLabel: 'Virginia', name: 'state', inputValue: 'virginia'}
            ]
        });
        
        this.state_radio_group.on('change', this.stateChanged, this);

        this.state_radio_panel = new Ext.Panel({
            border: false,
            keys: [{
                key: [Ext.EventObject.UP, Ext.EventObject.DOWN, Ext.EventObject.LEFT, Ext.EventObject.RIGHT], 
                handler: function(keyCode, event) {
                    event.preventDefault();
                }
            }],
            items: [this.state_radio_group]
        });

        this.lower_panel = new Ext.Panel({
            border: false,
            style: 'margin-left: 5px; margin-right:5px; padding-left: 5px; padding-right: 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 5px 5px 5px 10px'
            },
            id: 'intro_lower_panel',
            html:'<p><b>B: Continue zooming in:</b></p><table><tr><td><img style="width:39px; height:52px" src="/media/img/nav_arrows.png" /></td><td><p><b>Move Map - </b>Click the buttons on the upper left of the map, click & drag with your mouse, or use your keyboard arrows.</p></td></tr></table><table><tr><td><img style="width:39px; height:52px" src="/media/img/nav_zoombar.png" /></td><td><p><b>Zoom Map - </b>Click the \'+\' and \'-\' buttons on the upper left of the map or use the scroll wheel on your mouse if you have one.</p></td></tr></table>'
        });         

        this.help_box = new Ext.form.Checkbox({
            boxLabel: 'Show help',
            fieldLabel: '(f)Show help',
            checked: this.help_checked,
            handler: this.helpCheck,
            id: 'intro-help-checkbox',
            name: 'introHelpCheckbox'
        });
        
        this.demo_panel = new Ext.Panel({
			html: '<div class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a></div>',
            id: 'intro_demo_panel',
            height: 30,
            width: 120,
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
        
        // this.help_panel.add(this.help_text);
        this.help_panel.add(this.help_box);
        this.help_panel.add(this.demo_panel);

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
                btn2_text: 'Start Plotting',               
            btn2_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.state_radio_panel);
        this.add(this.lower_panel);
        this.add(this.button_panel);
        this.add(this.help_panel);
        
        // Call parent (required)
        gwst.widgets.IntroPanel.superclass.onRender.apply(this, arguments); 
	},
    
    stateChanged: function(radioGroup, state) {
        if (!this.state_center) {
            this.state_center = new OpenLayers.LonLat(0,0);
            this.state_zoom = 2;
        }
        if (state) {
            if (state.boxLabel == "New York") {
                this.state_center.lon = -8127000;
                this.state_center.lat = 4989000;
                this.state_zoom = 3;
            } else if (state.boxLabel == "New Jersey") {
                this.state_center.lon = -8210000;
                this.state_center.lat = 4870000;
                this.state_zoom = 3;
            } else if (state.boxLabel == "Delaware") {
                this.state_center.lon = -8300000;
                this.state_center.lat = 4718000;
                this.state_zoom = 3;
            } else if (state.boxLabel == "Maryland") {
                this.state_center.lon = -8400000;
                this.state_center.lat = 4600000;
                this.state_zoom = 3;
            } else if (state.boxLabel == "Virginia") {
                this.state_center.lon = -8380000;
                this.state_center.lat = 4480000;
                this.state_zoom = 3;
            }
            map.setCenter(this.state_center);
            map.zoomTo(this.state_zoom);
        }
    },
    
    skipClicked: function() {
        this.fireEvent('intro-skip',this);
    },
    
	contBtnClicked: function() {
		this.fireEvent('intro-cont',this,this.resource);
    },

    helpCheck: function() {
        this.fireEvent('show-help', this.checked);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-intro-panel', gwst.widgets.IntroPanel);
