Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo1Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInfo1Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'activity_info1_header_panel',
            html: '<img src="/media/img/8_ActivityQuestions1_header.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });
        
		this.question_one = new Ext.Panel({		
			html: '<p>In this area, did you engage in any of the following activities (<i>please check all that apply</i>)?</p>',
			style: 'margin: 10px 10px 10px 0px',
			border: false
        });
        
        this.fishing_box = new Ext.form.Checkbox ({
            boxLabel: 'Fishing',
            name: 'fishing'
        });
        
        this.fishing_box.on('check', this.fishingChecked, this);
        
        this.viewing_box = new Ext.form.Checkbox ({
            boxLabel: 'Wildlife viewing',
            name: 'wildlife-viewing'
        });
        
        this.viewing_box.on('check', this.viewingChecked, this);
        
        this.diving_box = new Ext.form.Checkbox ({
            boxLabel: 'Diving',
            name: 'diving'
        });
        
        this.diving_box.on('check', this.divingChecked, this);
        
        this.other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'other'
        });
        
        this.other_box.on('check', this.otherChecked, this);
        
        this.answer_one = new Ext.form.CheckboxGroup ({
            id: 'activity-answerOne',
            xtype: 'checkboxgroup',
            fieldLabel: 'Reasons List',
            itemCls: 'x-check-group-alt',
            style: 'margin: 0px 0px 10px 15px',
            columns: 1,
            items: [
                this.fishing_box,
                this.viewing_box,
                this.diving_box,
                {boxLabel: 'Hanging out', name: 'hanging-out'},
                this.other_box
            ]
        });
        
        /*---------- START Fishing Checked Questions --------------------*/
        
        this.fishing_text_one = new Ext.Panel({
            html: 'What type of fish did you catch?',
            style: 'margin: 0px 0px 10px 10px',
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
                {boxLabel: 'Stripers', name: 'stripers'},
                {boxLabel: 'Bluefish', name: 'bluefish'},
                {boxLabel: 'Flounder', name: 'flounder'},
                {boxLabel: 'Cod/Haddock', name: 'cod-haddock'},
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
        
        this.fishing_text_two = new Ext.Panel({
            html: 'How do you rank this area for fishing?',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.fishing_two = new Ext.form.RadioGroup({
            id: 'fishing-activity-2',
            xtype: 'radiogroup',
            fieldlabel: 'Fishing Rank',
            style: 'margin: 0px 0px 10px 10px',
            columns: 1,
            items: [
                {boxLabel: 'Very good', name: 'fish-rank', inputValue: 'very-good'},
                {boxLabel: 'Good', name: 'fish-rank', inputValue: 'good'},
                {boxLabel: 'Average', name: 'fish-rank', inputValue: 'average'},
                {boxLabel: 'Poor', name: 'fish-rank', inputValue: 'poor'},
                {boxLabel: 'Very poor', name: 'fish-rank', inputValue: 'very-poor'}
            ]
        });
        
        /*---------- END Fishing Checked Questions --------------------*/
        
        /*---------- START Viewing Checked Questions --------------------*/
        
        this.viewing_text_one = new Ext.Panel({
            html: 'What animals did you view?',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.view_other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'view-other'
        });
        
        this.view_other_box.on('check', this.viewOtherChecked, this);
        
        this.viewing_one = new Ext.form.CheckboxGroup({
            id: 'viewing-activity-1',
            xtype: 'checkboxgroup',
            fieldlabel: 'Viewing Species',
            itemCls: 'x-check-group-alt',
            style: 'margin: 0px 0px 10px 15px',
            columns: 1,
            items: [
                {boxLabel: 'Whales', name: 'whales'},
                {boxLabel: 'Birds', name: 'birds'},
                {boxLabel: 'Seals', name: 'seals'},
                {boxLabel: 'Porpoises', name: 'porpoises'},
                this.view_other_box
            ]
        });
        
        this.other_text_view = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_view = new Ext.form.TextField({
            id: 'other-view',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.viewing_text_two = new Ext.Panel({
            html: 'How do you rank this area for wildlife viewing?',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.viewing_two = new Ext.form.RadioGroup({
            id: 'viewing-activity-2',
            xtype: 'radiogroup',
            fieldlabel: 'Viewing Rank',
            style: 'margin: 0px 0px 10px 10px',
            columns: 1,
            items: [
                {boxLabel: 'Very good', name: 'view-rank', inputValue: 'very-good'},
                {boxLabel: 'Good', name: 'view-rank', inputValue: 'good'},
                {boxLabel: 'Average', name: 'view-rank', inputValue: 'average'},
                {boxLabel: 'Poor', name: 'view-rank', inputValue: 'poor'},
                {boxLabel: 'Very poor', name: 'view-rank', inputValue: 'very-poor'}
            ]
        });
        
        /*---------- END Viewing Checked Questions --------------------*/
        
        /*---------- START Diving Checked Questions --------------------*/
        
        this.diving_text_one = new Ext.Panel({
            html: 'What type of diving did you do?',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.dive_other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'view-other'
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
                {boxLabel: 'Fishing', name: 'whales'},
                {boxLabel: 'Wreck diving', name: 'birds'},
                {boxLabel: 'Just exploring', name: 'seals'},
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
            style: 'margin: 0px 0px 10px 10px',
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
        
        this.other_text_one = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_one = new Ext.form.TextField({
            id: 'other-activity',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });

        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 140,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 120,
            left_margin: 20
        });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.answer_one);
        this.add(this.fishing_text_one);
        this.fishing_text_one.hide();
        this.add(this.fishing_one);
        this.fishing_one.hide();
        this.add(this.other_text_fish);
        this.other_text_fish.hide();
        this.add(this.other_fish);
        this.other_fish.hide();
        this.add(this.fishing_text_two);
        this.fishing_text_two.hide();
        this.add(this.fishing_two);
        this.fishing_two.hide();
        this.add(this.viewing_text_one);
        this.viewing_text_one.hide();
        this.add(this.viewing_one);
        this.viewing_one.hide();
        
        this.add(this.other_text_view);
        this.other_text_view.hide();
        this.add(this.other_view);
        this.other_view.hide();
        this.add(this.viewing_text_two);
        this.viewing_text_two.hide();
        this.add(this.viewing_two);
        this.viewing_two.hide();
        
        this.add(this.diving_text_one);
        this.diving_text_one.hide();
        this.add(this.diving_one);
        this.diving_one.hide();
        
        this.add(this.other_text_dive);
        this.other_text_dive.hide();
        this.add(this.other_dive);
        this.other_dive.hide();
        this.add(this.diving_text_two);
        this.diving_text_two.hide();
        this.add(this.diving_two);
        this.diving_two.hide();
        
        this.add(this.other_text_one);
        this.other_text_one.hide();
        this.add(this.other_one);
        this.other_one.hide();
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo1Panel.superclass.onRender.apply(this, arguments);     
	},
    
    fishingChecked: function() {
        if (this.answer_one.items.item(0).checked) {
            this.fishing_text_one.show();
            this.fishing_one.show();
            this.fishOtherChecked();
            this.fishing_text_two.show();
            this.fishing_two.show();
        } else {
            this.fishing_text_one.hide();
            this.fishing_one.hide();
            this.fishOtherChecked();
            this.fishing_text_two.hide();
            this.fishing_two.hide();
        }
    },
    
    fishOtherChecked: function() {
        if (this.fishing_one.items.item(4).checked && this.answer_one.items.item(0).checked) {
            this.other_text_fish.show();
            this.other_fish.show();
        } else {
            this.other_text_fish.hide();
            this.other_fish.hide();
        }
    },
    
    viewingChecked: function() {
        if (this.answer_one.items.item(1).checked) {
            this.viewing_text_one.show();
            this.viewing_one.show();
            this.viewOtherChecked();
            this.viewing_text_two.show();
            this.viewing_two.show();
        } else {
            this.viewing_text_one.hide();
            this.viewing_one.hide();
            this.viewOtherChecked();
            this.viewing_text_two.hide();
            this.viewing_two.hide();
        }
    },
    
    viewOtherChecked: function() {
        if (this.viewing_one.items.item(4).checked && this.answer_one.items.item(1).checked) {
            this.other_text_view.show();
            this.other_view.show();
        } else {
            this.other_text_view.hide();
            this.other_view.hide();
        }
    },
    
    divingChecked: function() {
        if (this.answer_one.items.item(2).checked) {
            this.diving_text_one.show();
            this.diving_one.show();
            this.diveOtherChecked();
            this.diving_text_two.show();
            this.diving_two.show();
        } else {
            this.diving_text_one.hide();
            this.diving_one.hide();
            this.diveOtherChecked();
            this.diving_text_two.hide();
            this.diving_two.hide();
        }
    },
    
    diveOtherChecked: function() {
        if (this.diving_one.items.item(3).checked && this.answer_one.items.item(2).checked) {
            this.other_text_dive.show();
            this.other_dive.show();
        } else {
            this.other_text_dive.hide();
            this.other_dive.hide();
        }
    },
    
    otherChecked: function() {
        if (this.answer_one.items.item(4).checked) {
            this.other_text_one.show();
            this.other_one.show();
        } else {
            this.other_text_one.hide();
            this.other_one.hide();
        }
    },

    contBtnClicked: function() {
        if (this.fishing_one.isValid() && 
        this.fishing_two.isValid() && 
        this.other_fish.isValid() && 
        this.viewing_one.isValid() && 
        this.viewing_two.isValid() && 
        this.other_view.isValid() && 
        this.diving_one.isValid() && 
        this.diving_two.isValid() && 
        this.other_dive.isValid() && 
        this.other_one.isValid() ) {
            this.fireEvent('activity-info1-cont',this);
        } else {
            alert('Your entry for \'other\' is too long.  Please shorten it.');
        }
    },

    resetPanel: function() {
        this.answer_one.reset();
        this.fishing_one.reset();
        this.fishing_two.reset();
        this.other_fish.reset();
        this.viewing_one.reset();
        this.viewing_two.reset();
        this.other_view.reset();
        this.diving_one.reset();
        this.diving_two.reset();
        this.other_dive.reset();
        this.other_one.reset();
        this.fishing_text_one.hide();
        this.fishing_one.hide();
        this.fishing_text_two.hide();
        this.fishing_two.hide();
        this.other_text_fish.hide();
        this.other_fish.hide();
        this.viewing_text_one.hide();
        this.viewing_one.hide();
        this.viewing_text_two.hide();
        this.viewing_two.hide();
        this.other_text_view.hide();
        this.other_view.hide();
        this.diving_text_one.hide();
        this.diving_one.hide();
        this.diving_text_two.hide();
        this.diving_two.hide();
        this.other_text_dive.hide();
        this.other_dive.hide();
        this.other_text_one.hide();
        this.other_one.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info1-panel', gwst.widgets.ActivityInfo1Panel);