Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo2Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInfo2Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity_info2', html:'Activity Questions 2'},
			style: 'padding:5px',
            id: 'activity_info2_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>Why did you choose this area to engage in this activity? (select all that apply)</p>',
			style: 'margin: 10px 10px 5px 10px',
			border: false
        });
        
        this.other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'other'
        });
        
        this.other_box.on('check', this.boxChecked, this);
        
        this.answer_one = new Ext.form.CheckboxGroup ({
            id: 'answerOne',
            xtype: 'checkboxgroup',
            fieldLabel: 'Reasons List',
            itemCls: 'x-check-group-alt',
            style: 'margin-left: 5px',
            columns: 1,
            items: [
                {boxLabel: 'Area reached quickly and/or easily', name: 'easy-access'},
                {boxLabel: 'Area is familiar / I have a good knowledge of the area', name: 'familiar'},
                {boxLabel: 'Calm waters', name: 'calm'},
                {boxLabel: 'Protected waters', name: 'protected'},
                {boxLabel: 'Clean and/or clear waters', name: 'clean'},
                {boxLabel: 'Wildlife viewing opportunities', name: 'wild-viewing'},
                {boxLabel: 'Scenic beauty', name: 'beauty'},
                {boxLabel: 'Tranquility', name: 'tranquil'},
                {boxLabel: 'Absence of other boaters', name: 'solitude'},
                {boxLabel: 'Presence of other boaters', name: 'popular'},
                {boxLabel: 'Fishing opportunities', name: 'fishing'},
                {boxLabel: 'Swimming opportunities', name: 'swimming'},
                {boxLabel: 'Natural or undeveloped shoreline', name: 'natural'},
                {boxLabel: 'Access to shoreside entertainment and restaurants', name: 'entertainment'},
                {boxLabel: 'Access to supplies, marina, convenient mooring or fuel', name: 'amenities'},
                {boxLabel: 'No specific reason', name: 'no-reason'},
                this.other_box
            ]
        });
        
        this.other_text_one = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_one = new Ext.form.TextField({
            id: 'other-reason',
            style: 'margin: 0px 0px 10px 10px',
            width: '200px'
        });
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn1_width: 120,
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
            btn2_width: 100,
            left_margin: 20,
            bottom_margin: 5
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
        gwst.widgets.ActivityInfo2Panel.superclass.onRender.apply(this, arguments);     
	},
    
    boxChecked: function() {
        if (this.answer_one.items.item(16).checked) {
            this.other_text_one.show();
            this.other_one.show();
        } else {
            this.other_text_one.hide();
            this.other_one.hide();
        }
    },
    
    contBtnClicked: function() {
        this.fireEvent('activity-info2-cont',this);
        this.resetPanel();
    },

    resetPanel: function() {
        this.answer_one.reset();
        this.other_one.reset();
        this.other_text_one.hide();
        this.other_one.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info2-panel', gwst.widgets.ActivityInfo2Panel);