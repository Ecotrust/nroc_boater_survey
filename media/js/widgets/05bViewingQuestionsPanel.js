Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ViewingQuestionsPanel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ViewingQuestionsPanel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Panel({  
            id: 'viewing_questions_header_panel',
            html: '<img src="/media/img/h_05_activity_questions.png">',
			border: 'north',
            bodyCfg: {            
                cls: 'action-panel-header'
            }
        });
        
        /*---------- START Viewing Checked Questions --------------------*/
        
        this.viewing_text_one = new Ext.Panel({
            html: '<p>What animals did you view?</p>',
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
            style: 'margin: 0px 0px 10px 15px',
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
        
        this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	btn2_text: 'Continue >>',        	
            btn2_handler: this.contBtnClicked.createDelegate(this)
        });
        
        this.add(this.header_panel);        
        this.add(this.viewing_text_one);
        this.add(this.viewing_one);
        this.add(this.other_text_view);
        this.other_text_view.hide();
        this.add(this.other_view);
        this.other_view.hide();
        this.add(this.viewing_text_two);
        this.add(this.viewing_two);
        this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ViewingQuestionsPanel.superclass.onRender.apply(this, arguments);     
	},
    
    viewOtherChecked: function() {
        if (this.viewing_one.items.item(4).checked) {
            this.other_text_view.show();
            this.other_view.show();
        } else {
            this.other_text_view.hide();
            this.other_view.hide();
        }
    },
    
    contBtnClicked: function() {
        if (this.viewing_one.isValid() && 
        this.viewing_two.isValid() && 
        this.other_view.isValid()) {
            this.fireEvent('viewing-questions-cont',this);
        } else {
            Ext.Msg.alert('Alert','<p class="help-win">Your entry for \'other\' is too long.  Please shorten it.</p>');
        }
    },

    resetPanel: function() {
        this.viewing_one.reset();
        this.viewing_two.reset();
        this.other_view.reset();
        this.other_text_view.hide();
        this.other_view.hide();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-viewing-questions-panel', gwst.widgets.ViewingQuestionsPanel);