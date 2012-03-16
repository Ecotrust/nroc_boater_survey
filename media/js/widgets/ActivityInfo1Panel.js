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
            style: 'margin: 0px 0px 10px 5px',
            columns: 1,
            items: [
                this.fishing_box,
                this.viewing_box,
                this.diving_box,
                {boxLabel: 'Hanging out', name: 'hanging-out'},
                this.other_box
            ]
        });
        
        this.fishing_text_one = new Ext.Panel({
            html: 'If \'fishing\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.fishing_one = new Ext.form.TextField({
            id: 'fishing-activity',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.viewing_text_one = new Ext.Panel({
            html: 'If \'viewing\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.viewing_one = new Ext.form.TextField({
            id: 'viewing-activity',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.diving_text_one = new Ext.Panel({
            html: 'If \'diving\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.diving_one = new Ext.form.TextField({
            id: 'diving-activity',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
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
        
		this.question_two = new Ext.Panel({		
			html: '<p>How long did you engage in this activity in this area?</p>',
			style: 'margin: 0px 0px 10px 0px',
			border: false
        });
        
        this.answer_two = new Ext.form.ComboBox({
            store: [
                'Less than 1 hour',
                '1-2 hours',
                '3-4 hours',
                '5-6 hours',
                '7-8 hours',
                '9-12 hours',
                'Over 12 hours'
            ],
            emptyText:'Select a time frame...',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            width: '150px'
        });
        
        this.question_three = new Ext.Panel({		
			html: '<p>How do you rank this area for this activity compared to other areas in Massachusetts where you could have done this?</p>',
			style: 'margin: 0px 0px 10px 0px',
			border: false
        });
        
        this.answer_three = new Ext.form.ComboBox({
            store: [
                'Much Worse',
                'Worse',
                'Same',
                'Better',
                'Much Better',
                'Don\'t know'
            ],
            emptyText:'Select a ranking...',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            width: '150px'
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
        this.add(this.viewing_text_one);
        this.viewing_text_one.hide();
        this.add(this.viewing_one);
        this.viewing_one.hide();
        this.add(this.diving_text_one);
        this.diving_text_one.hide();
        this.add(this.diving_one);
        this.diving_one.hide();
        this.add(this.other_text_one);
        this.other_text_one.hide();
        this.add(this.other_one);
        this.other_one.hide();
        this.add(this.question_two);
        this.add(this.answer_two);
        this.add(this.question_three);
        this.add(this.answer_three);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo1Panel.superclass.onRender.apply(this, arguments);     
	},
    
    fishingChecked: function() {
        if (this.answer_one.items.item(0).checked) {
            this.fishing_text_one.show();
            this.fishing_one.show();
        } else {
            this.fishing_text_one.hide();
            this.fishing_one.hide();
        }
    },
    
    viewingChecked: function() {
        if (this.answer_one.items.item(1).checked) {
            this.viewing_text_one.show();
            this.viewing_one.show();
        } else {
            this.viewing_text_one.hide();
            this.viewing_one.hide();
        }
    },
    
    divingChecked: function() {
        if (this.answer_one.items.item(2).checked) {
            this.diving_text_one.show();
            this.diving_one.show();
        } else {
            this.diving_text_one.hide();
            this.diving_one.hide();
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
        this.viewing_one.isValid() && 
        this.diving_one.isValid() && 
        this.other_one.isValid() ) {
            this.fireEvent('activity-info1-cont',this);
        } else {
            alert('Your entry for \'other\' is too long.  Please shorten it.');
        }
    },

    resetPanel: function() {
        this.answer_one.reset();
        this.fishing_one.reset();
        this.viewing_one.reset();
        this.diving_one.reset();
        this.other_one.reset();
        this.answer_two.reset();
        this.answer_three.reset();
        this.fishing_text_one.hide();
        this.fishing_one.hide();
        this.viewing_text_one.hide();
        this.viewing_one.hide();
        this.diving_text_one.hide();
        this.diving_one.hide();
        this.other_text_one.hide();
        this.other_one.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info1-panel', gwst.widgets.ActivityInfo1Panel);