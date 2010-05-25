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
			style: 'margin: 10px',
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
            style: 'margin-left: 5px',
            columns: 1,
            items: [
                {boxLabel: 'Proximity to my favorite boating area(s)', name: 'proximity'},
                {boxLabel: 'Reduced travel time to get to favorite boating area(s)', name: 'travel-time'},
                {boxLabel: 'Route is familiar / I have good knowledge of the route', name: 'familiar'},
                {boxLabel: 'Avoid shallow water', name: 'avoid-shallow'},
                {boxLabel: 'Challenging navigation', name: 'challenge'},
                {boxLabel: 'Calm waters', name: 'calm-waters'},
                {boxLabel: 'Scenic beauty', name: 'beauty'},
                {boxLabel: 'Tranquility', name: 'tranquil'},
                {boxLabel: 'Absence of other boaters', name: 'solitude'},
                {boxLabel: 'Presence of other boaters', name: 'popular'},
                {boxLabel: 'Avoid speed zones', name: 'speed-zones'},
                {boxLabel: 'Access to shoreside entertainment and restaurants', name: 'entertainment'},
                {boxLabel: 'Access to supplies, marina, convenient mooring or fuel', name: 'amenities'},
                {boxLabel: 'None are particularly important. I just cruise around', name: 'no-reason'},
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
            width: '200px'
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
        if (this.answer_one.items.item(14).checked) {
            this.other_text_one.show();
            this.other_one.show();
        } else {
            this.other_text_one.hide();
            this.other_one.hide();
        }
    },
    
    contBtnClicked: function() {
        this.fireEvent('route-info1-cont',this);
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
Ext.reg('gwst-route-info1-panel', gwst.widgets.RouteInfo1Panel);