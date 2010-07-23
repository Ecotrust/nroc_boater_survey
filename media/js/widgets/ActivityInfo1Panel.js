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
			html: '<p>In this area, what was the primary activity you were engaged in?</p>',
			style: 'margin: 10px 10px 10px 0px',
			border: false
        });
        
        this.answer_one = new Ext.form.ComboBox({
            store: [
                'Cruising',
                'Entertaining family/friends',
                'Fishing or shellfishing',
                'Hunting',
                'Whale watching',
                'Bird watching',
                'Racing',
                'Sailing',
                'Scubadiving/Snorkeling',
                'Sightseeing',
                'Swimming',
                'Waterskiing/Wakeboarding',
                'Land-based Activity',
                'Other'
            ],
            emptyText:'Select an activity...',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            width: '150px'
        });
        
        this.answer_one.on('select', this.activitySelected, this);
        
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
    
    activitySelected: function(combo, rec, index) {
        if(rec.data.text == "Other") {
            this.other_text_one.show();
            this.other_one.show();
        } else {
            this.other_text_one.hide();
            this.other_one.hide();
        }
    },
    
    contBtnClicked: function() {
        if (this.other_one.isValid()) {
            this.fireEvent('activity-info1-cont',this);
        } else {
            alert('Your entry for \'other\' is too long.  Please shorten it.');
        }
    },

    resetPanel: function() {
        this.answer_one.reset();
        this.other_one.reset();
        this.answer_two.reset();
        this.answer_three.reset();
        this.other_text_one.hide();
        this.other_one.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info1-panel', gwst.widgets.ActivityInfo1Panel);