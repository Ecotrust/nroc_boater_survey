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
			style: 'margin: 10px',
			border: false
        });
        
        this.answer_one = new Ext.Panel({
            html: '<p>Q1 checklist here:</p><p>item1</p><p>item2</p><p>item3</p><p>item4</p><p>item5</p><p>item6</p><p>item7</p><p>item8</p><p>item9</p><p>item10</p><p>item11</p><p>item12</p><p>item13</p><p>item14</p><p>item15</p><p>item16</p><p>item17</p>',            
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '200px'
        });
        
        this.other_text_one = new Ext.Panel({
            html: 'If \'other\' please specify:',
            style: 'margin: 0px 0px 10px 10px',
            border: false
        });
        
        this.other_one = new Ext.Panel({
            html: '|',
            style: 'margin: 0px 0px 10px 10px',
            border: 'solid',
            width: '150px'
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
        this.add(this.other_one);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo2Panel.superclass.onRender.apply(this, arguments);     
	},
    
    contBtnClicked: function() {
        this.fireEvent('activity-info2-cont',this);
    }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info2-panel', gwst.widgets.ActivityInfo2Panel);