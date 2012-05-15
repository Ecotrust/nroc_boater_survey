Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.FishingQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.FishingQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'fishing_questions_header_panel',
            html: '<img src="/media/img/h_05_activity_questions.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });

        /*---------- START Fishing Checked Questions --------------------*/
        
        this.fishing_text_one = new Ext.Panel({
			html: '<p>What fish did you target?</p>',
            border: false
        });
        
        this.fish_other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'fish-other'
        });
        
        this.fish_other_box.on('check', this.fishOtherChecked, this);
        
        this.fishing_one = new Ext.form.CheckboxGroup({
            id: 'fishing-activity-1',
            xtype: 'checkboxgroup',
            fieldlabel: 'Fishing Species',
            itemCls: 'x-check-group-alt',
            style: 'margin: 0px 0px 10px 15px',
            columns: 1,
            items: [
                {boxLabel: 'Striped Bass', name: 'striped-bass'},
                {boxLabel: 'Bluefish', name: 'bluefish'},
                {boxLabel: 'Flounder', name: 'flounder'},
                {boxLabel: 'Atlantic Cod', name: 'cod'},
                {boxLabel: 'Haddock', name: 'haddock'},
                {boxLabel: 'Atlantic Mackerel', name: 'mackerel'},
                {boxLabel: 'Scup (Porgy)', name: 'scup'},
                {boxLabel: 'Tautog (Blackfish)', name: 'tautog'},
                {boxLabel: 'Tuna', name: 'tuna'},
                {boxLabel: 'Shark', name: 'shark'},
                {boxLabel: 'Billfish', name: 'billfish'},
                {boxLabel: 'Wahoo', name: 'wahoo'},
                this.fish_other_box
            ]
        });
        
        this.other_text_fish = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_fish = new Ext.form.TextField({
            id: 'other-fish',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.other_fish_panel = new Ext.Panel({
            border: false,
            keys: [{
                key: [Ext.EventObject.UP, Ext.EventObject.DOWN, Ext.EventObject.LEFT, Ext.EventObject.RIGHT], 
                handler: function(keyCode, event) {
                    event.stopPropagation();
                }
            }],
            items: [this.other_fish]
        });
        
        this.fishing_text_two = new Ext.Panel({
            html: 'How do you rank this area for fishing?',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.fishing_two = new Ext.form.RadioGroup({
            id: 'fishing-activity-2',
            xtype: 'radiogroup',
            fieldlabel: 'Fishing Rank',
            style: 'margin: 0px 0px 10px 15px',
            columns: 1,
            items: [
                {boxLabel: 'Very good', name: 'fish-rank', inputValue: 'very-good'},
                {boxLabel: 'Good', name: 'fish-rank', inputValue: 'good'},
                {boxLabel: 'Average', name: 'fish-rank', inputValue: 'average'},
                {boxLabel: 'Poor', name: 'fish-rank', inputValue: 'poor'},
                {boxLabel: 'Very poor', name: 'fish-rank', inputValue: 'very-poor'}
            ]
        });
        
        this.fishing_radio_panel = new Ext.Panel({
            border: false,
            keys: [{
                key: [Ext.EventObject.UP, Ext.EventObject.DOWN, Ext.EventObject.LEFT, Ext.EventObject.RIGHT], 
                handler: function(keyCode, event) {
                    event.preventDefault();
                }
            }],
            items: [this.fishing_two]
        });
        
        /*---------- END Fishing Checked Questions --------------------*/
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);        
        this.add(this.fishing_text_one);
        this.add(this.fishing_one);
        this.add(this.other_text_fish);
        this.other_text_fish.hide();
        this.add(this.other_fish_panel);
        this.other_fish_panel.hide();
        this.add(this.fishing_text_two);
        this.add(this.fishing_radio_panel);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.FishingQuestionsPanel.superclass.onRender.apply(this, arguments);     
	},
    
    fishOtherChecked: function() {
        if (this.fishing_one.items.item(4).checked) {
            this.other_text_fish.show();
            this.other_fish_panel.show();
        } else {
            this.other_text_fish.hide();
            this.other_fish_panel.hide();
        }
    },
    
    contBtnClicked: function() {
        if (this.fishing_one.isValid() && 
        this.fishing_two.isValid() && 
        this.other_fish.isValid()) {
            this.fireEvent('fishing-questions-cont',this);
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
        this.fishing_one.reset();
        this.fishing_two.reset();
        this.other_fish.reset();
        this.other_text_fish.hide();
        this.other_fish_panel.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-fishing-questions-panel', gwst.widgets.FishingQuestionsPanel);