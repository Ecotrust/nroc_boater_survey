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
            html: '<p>What type of diving did you do?</p>',
            border: false
        });
        
        this.dive_other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'dive-other'
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
        
        this.diving_text_two = new Ext.Panel({
            html: 'How do you rank this area for diving?',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.diving_two = new Ext.form.RadioGroup({
            id: 'diving-activity-2',
            xtype: 'radiogroup',
            fieldlabel: 'Diving Rank',
            style: 'margin: 0px 0px 10px 15px',
            columns: 1,
            items: [
                {boxLabel: 'Very good', name: 'dive-rank', inputValue: 'very-good'},
                {boxLabel: 'Good', name: 'dive-rank', inputValue: 'good'},
                {boxLabel: 'Average', name: 'dive-rank', inputValue: 'average'},
                {boxLabel: 'Poor', name: 'dive-rank', inputValue: 'poor'},
                {boxLabel: 'Very poor', name: 'dive-rank', inputValue: 'very-poor'}
            ]
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
        this.add(this.other_dive);
        this.other_dive.hide();
        this.add(this.diving_text_two);
        this.add(this.diving_two);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.DivingQuestionsPanel.superclass.onRender.apply(this, arguments);     
	},
    
    diveOtherChecked: function() {
        if (this.diving_one.items.item(3).checked) {
            this.other_text_dive.show();
            this.other_dive.show();
        } else {
            this.other_text_dive.hide();
            this.other_dive.hide();
        }
    },
    
    contBtnClicked: function() {
        if (this.diving_one.isValid() && 
        this.diving_two.isValid() && 
        this.other_dive.isValid()) {
            this.fireEvent('diving-questions-cont',this);
        } else {
            Ext.Msg.alert('Alert','<p class="help-win">Your entry for \'other\' is too long.  Please shorten it.</p>');
        }
    },

    resetPanel: function() {
        this.diving_one.reset();
        this.diving_two.reset();
        this.other_dive.reset();
        this.other_text_dive.hide();
        this.other_dive.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-diving-questions-panel', gwst.widgets.DivingQuestionsPanel);