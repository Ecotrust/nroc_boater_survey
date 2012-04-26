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
        var html_text = '<h2>Step 1: Zoom to Boating Area</h2>\
        <p>Zoom in on the map to where you started your last trip.</p>\
        <p>A: select the state where you departed:</p>';
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
            columns: 1,
            items: [
                {boxLabel: 'Maine', name: 'state', inputValue: 'maine'},
                {boxLabel: 'New Hampshire', name: 'state', inputValue: 'new-hampshire'},
                {boxLabel: 'Massachusetts', name: 'state', inputValue: 'massachusetts'},
                {boxLabel: 'Rhode Island', name: 'state', inputValue: 'rhode-island'},
                {boxLabel: 'Connecticut', name: 'state', inputValue: 'connecticut'},
                {boxLabel: 'New York', name: 'state', inputValue: 'new-york'}
            ]
        });
        
        this.state_radio_group.on('change', this.stateChanged, this);
        
        this.lower_panel = new Ext.Panel({
            border: false,
            style: 'margin-left: 5px; margin-right:5px; padding-left: 5px; padding-right: 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 5px 5px 5px 10px'
            },
            id: 'intro_lower_panel',
            html:'<p>B: Continue zooming in:</p>\
            <table><tr><td><img style="width:39px; height:52px" src="/media/img/nav_arrows.png" /></td>\
            <td><p>Move Map - Click the buttons on the upper left of the map, click & drag with your mouse, or use your keyboard arrows.</p></td></tr></table>\
            <table><tr><td><img style="width:39px; height:52px" src="/media/img/nav_zoombar.png" /></td>\
            <td><p>Zoom Map - Click the \'+\' and \'-\' buttons on the upper left of the map or use the scroll wheel on your mouse if you have one.</p></td></tr></table>'
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
			html: '<p class="video-link"><img class="video-img" src="/media/img/film_go.png"/> <a href="'+ gwst.settings.urls.demo +'" target="_blank">Watch Demonstration</a>',
            id: 'intro_demo_panel',
			border: false
		});
        
        this.help_panel = new Ext.Panel({
            layout: {
                type: 'hbox',
                padding: '5'
            },
            border: false
        });
        
        this.help_panel.add(this.demo_panel);
        this.help_panel.add(this.help_box);

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
                btn2_text: 'Start Plotting',               
            btn2_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);
		this.add(this.inner_panel);
        this.add(this.state_radio_group);
        this.add(this.lower_panel);
        this.add(this.help_panel);
        this.add(this.button_panel);
        
        // Call parent (required)
        gwst.widgets.IntroPanel.superclass.onRender.apply(this, arguments); 
	},
    
    stateChanged: function(radioGroup, state) {
        if (!this.state_center) {
            this.state_center = new OpenLayers.LonLat(0,0);
            this.state_zoom = 8;
        }
        if (state.boxLabel == "New York") {
            this.state_center.lon = -8127077.8008318;
            this.state_center.lat = 4989347.7643456;
            this.state_zoom = 9;
        } else if (state.boxLabel == "Connecticut") {
            this.state_center.lon = -8099865.8795672;
            this.state_center.lat = 5044076.507388;
            this.state_zoom = 9;
        } else if (state.boxLabel == "Rhode Island") {
            this.state_center.lon = -7955857.1615036;
            this.state_center.lat = 5079924.7968473;
            this.state_zoom = 10;
        } else if (state.boxLabel == "Massachusetts") {
            this.state_center.lon = -7870776.9826373;
            this.state_center.lat = 5194997.8665102;
            this.state_zoom = 8;
        } else if (state.boxLabel == "New Hampshire") {
            this.state_center.lon = -7876581.7871859;
            this.state_center.lat = 5312326.5053067;
            this.state_zoom = 11;
        } else if (state.boxLabel == "Maine") {
            this.state_center.lon = -7733487.2606617;
            this.state_center.lat = 5423349.0892709;
            this.state_zoom = 9;
        }
            map.setCenter(this.state_center);
            map.zoomTo(this.state_zoom);
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