Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.DivingQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.DivingQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'diving_questions_header_panel',
            html: '<img src="/media/img/h_05_activity_questions.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });
        
        /*---------- START Diving Checked Questions --------------------*/
        
        this.diving_text_one = new Ext.Panel({
            html: '<p>What type of SCUBA diving did you do?</p>',
            border: false
        });
        
        this.dive_other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'dive-other',
            id: 'other-dive-type-box'
        });
        
        this.dive_other_box.on('check', this.diveOtherChecked, this);
        
        this.diving_one = new Ext.form.CheckboxGroup({
            id: 'diving-activity-1',
            xtype: 'checkboxgroup',
            fieldlabel: 'Diving Types',
            itemCls: 'x-check-group-alt',
            style: 'margin: 0px 0px 10px 15px',
            columns: 1,
            items: [
                {boxLabel: 'Fishing', name: 'fishing'},
                {boxLabel: 'Wreck diving', name: 'wrecks'},
                {boxLabel: 'Just exploring', name: 'exploring'},
                this.dive_other_box
            ]
        });
        
        this.other_text_dive = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_dive = new Ext.form.TextField({
            id: 'other-dive',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.other_dive_panel = new Ext.Panel({
            border: false,
            keys: [{
                key: [Ext.EventObject.UP, Ext.EventObject.DOWN, Ext.EventObject.LEFT, Ext.EventObject.RIGHT], 
                handler: function(keyCode, event) {
                    event.stopPropagation();
                }
            }],
            items: [this.other_dive]
        });

        /*---------- END Diving Checked Questions --------------------*/
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);        
        this.add(this.diving_text_one);
        this.add(this.diving_one);
        this.add(this.other_text_dive);
        this.other_text_dive.hide();
        this.add(this.other_dive_panel);
        this.other_dive_panel.hide();
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.DivingQuestionsPanel.superclass.onRender.apply(this, arguments);     
	},
    
    diveOtherChecked: function() {
        if (Ext.getCmp('other-dive-type-box').checked) {
            this.other_text_dive.show();
            this.other_dive_panel.show();
        } else {
            this.other_text_dive.hide();
            this.other_dive_panel.hide();
        }
    },
    
    contBtnClicked: function() {
        if (this.diving_one.isValid() && 
        this.other_dive.isValid()) {
            this.fireEvent('diving-questions-cont',this);
        } else {
            Ext.Msg.show({
                title:'Alert', 
                msg: '<p class="help-win">Your entry for \'other\' is too long.  Please shorten it.</p>', 
                buttons: Ext.Msg.OK,
                minWidth: 300
            });
        }
    },

    resetPanel: function() {
        this.diving_one.reset();
        this.other_dive.reset();
        this.other_text_dive.hide();
        this.other_dive_panel.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-diving-questions-panel', gwst.widgets.DivingQuestionsPanel);