Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo3Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        
        // Call parent (required)
        gwst.widgets.ActivityInfo3Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        
        var other_selected = false;
        
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity_info3', html:'Activity Questions 3'},
			style: 'padding:5px',
            id: 'activity_info3_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>If you could not have engaged in this activity at this location, what would you have done instead?</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });
        
        this.answer_one = new Ext.form.ComboBox({
            store: [
                'Engage in another recreational boating activity',
                'Engage in an activity not associated with recreational boating (i.e. go to the movies, go to the beach, etc...)',
                'Stay at home',
                'Other'
            ],
            emptyText:'Select an alternate...',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px; width: 270px',
			border: false,
            listWidth: 620
        });
        
        this.answer_one.on('select', this.alternateSelected, this);
        
        this.other_text_one = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_one = new Ext.form.TextField({
            id: 'other-alt-activity',
            style: 'margin: 0px 0px 10px 10px',
            width: '250px',
            maxLength: 150,
            maxLengthText: 'Your entry is too long'
        });
        
        this.question_two = new Ext.Panel({		
			html: '<p>Please choose the MAIN activity in which you would have most likely engaged.</p>',
			style: 'margin: 0px 0px 10px 10px',
			border: false
        });
        
        this.answer_two = new Ext.form.ComboBox({
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
                'Other'
            ],
            emptyText:'Select an activity...',
            editable: false,
            triggerAction: 'all',
            style: 'margin: 0px 0px 10px 10px',
			border: false,
            width: '250px'
        });
        
        this.answer_two.on('select', this.activitySelected, this);
        
        this.other_text_two = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_two = new Ext.form.TextField({
            id: 'other-alt-boat-activity',
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
            left_margin: 20,
            bottom_margin: 5
        });
        
        this.alt_button_panel = new gwst.widgets.TwoButtonPanel ({
            btn1_width: 140,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.altContBtnClicked.createDelegate(this),
            btn2_width: 120,
            left_margin: 20,
            bottom_margin: 5
        });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.answer_one);
        this.add(this.other_text_one);
        this.add(this.other_one);
        this.add(this.question_two);
        this.add(this.answer_two);
        this.add(this.other_text_two);
        this.add(this.other_two);
        this.add(this.button_panel);
        this.add(this.alt_button_panel);
        this.other_text_one.hide();
        this.other_one.hide();
        this.question_two.hide();
        this.answer_two.hide();
        this.other_text_two.hide();
        this.other_two.hide();
        this.alt_button_panel.hide();
    
        // Call parent (required)
        gwst.widgets.ActivityInfo3Panel.superclass.onRender.apply(this, arguments);     
	},
    
    alternateSelected: function(combo, rec, index) {
        if(rec.data.text == "Other") {
            this.other_text_one.show();
            this.other_one.show();
            this.question_two.hide();
            this.answer_two.hide();
            this.other_text_two.hide();
            this.other_two.hide();
            this.button_panel.show();
            this.alt_button_panel.hide();
        } else if (rec.data.text == "Engage in another recreational boating activity") {
            this.other_text_one.hide();
            this.other_one.hide();
            this.question_two.show();
            this.answer_two.show();
            this.button_panel.hide();
            this.alt_button_panel.show();
            if (this.other_selected) {
                this.other_text_two.show();
                this.other_two.show();
            } else {
                this.other_text_two.hide();
                this.other_two.hide();
            }
        } else {
            this.other_text_one.hide();
            this.other_one.hide();
            this.question_two.hide();
            this.answer_two.hide();
            this.other_text_two.hide();
            this.other_two.hide();
            this.button_panel.show();
            this.alt_button_panel.hide();
        }
    },
    
    activitySelected: function(combo, rec, index) {
        if(rec.data.text == "Other") {
            this.other_text_two.show();
            this.other_two.show();
            this.other_selected = true;
        } else {
            this.other_text_two.hide();
            this.other_two.hide();
            this.other_selected = false;
        }
    },
    
    altContBtnClicked: function() {
        if (this.other_two.isValid()) {
            this.fireEvent('activity-info3-alt-cont',this);
        } else {
            alert('Your entry for \'other\' is too long.  Please shorten it.');
        }
    },
    
    contBtnClicked: function() {
        if (this.other_one.isValid()) {
            this.fireEvent('activity-info3-cont',this);
        } else {
            alert('Your entry for \'other\' is too long.  Please shorten it.');
        }
    },

    resetPanel: function() {
        this.answer_one.reset();
        this.other_one.reset();
        this.answer_two.reset();
        this.other_two.reset();
        this.other_text_one.hide();
        this.other_one.hide();
        this.question_two.hide();
        this.answer_two.hide();
        this.other_text_two.hide();
        this.other_two.hide();
        this.other_selected = false;
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info3-panel', gwst.widgets.ActivityInfo3Panel);