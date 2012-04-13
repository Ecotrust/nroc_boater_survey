Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.RouteInfo1Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.RouteInfo1Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'route_info1_header_panel',
            html: '<img src="/media/img/h_03_route_questions.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>What factors were important to you when you chose <u>the route that you took</u>? <i>Check all that apply</i>.</p>',
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
            columns: 1,
            cls: 'x-form-check-group',
            items: [
                {boxLabel: 'Quickest route to my destination', name: 'quickest'},
                {boxLabel: 'Safest route to my destination', name: 'safest'},
                {boxLabel: 'Access to shoreside facilities', name: 'access'},
                {boxLabel: 'Scenic beauty', name: 'beauty'},
                {boxLabel: 'I was just cruising around', name: 'cruising'},
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
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this),
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
        if (this.answer_one.items.item(5).checked) {
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