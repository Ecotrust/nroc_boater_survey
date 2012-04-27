Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.NavHelpWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	

        this.addEvents('view-nav-details');
        this.addEvents('close-nav-help');
	
		Ext.apply(this, {          
            title: 'Map Tool Orientation',
        	layout:'fit',
            width:500,
            html: '<table class="help-table"><tr><td colspan=3><p class="help-win"><b>Map Navigation Buttons</b></p></td></tr>\
                <tr id="nav-help-row">\
                    <td><img src="/media/img/arrow_up-left.png" />\
                    </td><td><p class="help-win">Use these controls to move and zoom the map.</p></td>\
                    <td style="width: 85px">\
                        <img style="width:39px; height:52px" src="/media/img/nav_arrows.png" />\
                        <img style="width:39px; height:52px" src="/media/img/nav_zoombar.png" />\
                    </td>\
                </tr>\
                <tr>\
                    <td colspan=3><p class="help-win"><b>White Directions Panel</b></p></td>\
                </tr>\
                <tr id="directions-help-row">\
                    <td><img src="/media/img/arrow_left.png" /></td>\
                    <td><p class="help-win">Instructions on what to do are given in this panel to the left of the map at each step of the way.</p></td>\
                    <td>\
                        <img style="width:39px; height:52px; border: 1px solid Gray" src="/media/img/west_panel.png" />\
                    </td>\
                </tr>\
                <tr>\
                    <td colspan=3><p class="help-win"><b>Map Layer Switcher</b></p></td>\
                </tr>\
                <tr id="layer-help-row">\
                    <td><img src="/media/img/arrow_up-right.png" /></td>\
                    <td><p class="help-win">Select different layers to change which base map is shown.</p></td>\
                    <td>\
                        <img border: 1px solid Gray" src="/media/img/layers.png" />\
                    </td>\
                </tr>\
                <tr>\
                    <td colspan=3><p class="help-win"><b>Help Bar</b></p></td>\
                </tr>\
                <tr id="help-bar-help-row">\
                    <td><img src="/media/img/arrow_down.png" />\
                    </td><td><p class="help-win">If more help is needed, please refer to the information bar at the bottom of the screen.</p></td>\
                    <td></td>\
                </tr></table>',
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction: 'hide',
            closable: false,
            modal: false,
            draggable: false,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'View detailed navigation instructions',
                    handler: this.instructionsBtnClicked.createDelegate(this)
                },
                {
                    xtype:'tbseparator',
                    width: 15
                },
                {
                    text: 'Close',
                    handler: this.closeBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.NavHelpWindow.superclass.initComponent.call(this);		
	},

    instructionsBtnClicked: function() {
        this.fireEvent('view-nav-details', this);
    },
    
    closeBtnClicked: function() {
        this.hide();
    },
    
    load: function() {
        this.show();
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-nav-help-window', gwst.widgets.NavHelpWindow);