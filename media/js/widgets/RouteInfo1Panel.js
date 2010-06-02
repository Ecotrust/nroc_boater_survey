Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.RouteInfo1Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.RouteInfo1Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_route_info1', html:'Route Questions'},
			style: 'padding:5px',
            id: 'route_info1_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>What factors were important to you in <u>selecting your travel route</u>? <i>Check all that apply</i>.</p>',
			style: 'margin: 10px 10px 10px 0px',
			border: false
        });
        
        this.other_box = new Ext.form.Checkbox ({
            boxLabel: 'Other',
            name: 'other'
        });
        
        this.other_box.on('check', this.boxChecked, this);
        
        this.answer_one = new Ext.form.CheckboxGroup ({
            id: 'route1-answerOne',
            xtype: 'checkboxgroup',
            fieldLabel: 'Reasons List',
            itemCls: 'x-check-group-alt',
            style: 'margin: 0px 0px 10px 5px',
            columns: 1,
            items: [
                {boxLabel: 'Quickest route to my destination', name: 'travel-time'},
                {boxLabel: 'I am very familiar with this route', name: 'familiar'},
                {boxLabel: 'Safest route to my destination', name: 'avoid-shallow'},
                {boxLabel: 'Challenging navigation', name: 'challenge'},
                {boxLabel: 'Calm waters', name: 'calm-waters'},
                {boxLabel: 'Scenic beauty', name: 'beauty'},
                {boxLabel: 'Tranquility', name: 'tranquil'},
                {boxLabel: 'Absence of other boaters', name: 'solitude'},
                {boxLabel: 'Presence of other boaters', name: 'popular'},
                {boxLabel: 'Avoid speed zones', name: 'speed-zones'},
                {boxLabel: 'Access to shoreside facilities/entertainment', name: 'entertainment'},
                {boxLabel: 'Access to fuel, marina, mooring, etc.', name: 'amenities'},
                {boxLabel: 'None of the above. I was just cruising', name: 'no-reason'},
                this.other_box
            ]
        });
        
        this.other_text_one = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_one = new Ext.form.TextField({
            id: 'route1-other-reason',
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
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.answer_one);
        this.add(this.other_text_one);
        this.other_text_one.hide();
        this.add(this.other_one);
        this.other_one.hide();
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.RouteInfo1Panel.superclass.onRender.apply(this, arguments);     
	},
    
    boxChecked: function() {
        if (this.answer_one.items.item(13).checked) {
            this.other_text_one.show();
            this.other_one.show();
        } else {
            this.other_text_one.hide();
            this.other_one.hide();
        }
    },
    
    contBtnClicked: function() {
        if (this.other_one.isValid()) {
            this.fireEvent('route-info1-cont',this); 
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
Ext.reg('gwst-route-info1-panel', gwst.widgets.RouteInfo1Panel);