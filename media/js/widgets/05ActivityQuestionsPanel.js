Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'activity_questions_header_panel',
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

        this.viewing_box = new Ext.form.Checkbox ({
            boxLabel: 'Wildlife viewing',
            name: 'wildlife-viewing'
        });

        this.diving_box = new Ext.form.Checkbox ({
            boxLabel: 'Diving',
            name: 'diving'
        });

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
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.answer_one);
        this.add(this.other_text_one);
        this.other_text_one.hide();
        this.add(this.other_one);
        this.other_one.hide();
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityQuestionsPanel.superclass.onRender.apply(this, arguments);     
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
        if (this.other_one.isValid() ) {
            this.fireEvent('activity-questions-cont',this);
        } else {
            alert('Your entry for \'other\' is too long.  Please shorten it.');
        }
    },

    resetPanel: function() {
        this.answer_one.reset();
        this.other_one.reset();
        this.other_text_one.hide();
        this.other_one.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-questions-panel', gwst.widgets.ActivityQuestionsPanel);