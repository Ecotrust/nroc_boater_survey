Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.TwoButtonPanel = Ext.extend(Ext.Panel, {
    btn1_handler: null,
    btn1_enabled: true,
    btn1_width: 100,
	btn2_handler: null,
    btn2_enabled: true,
    btn2_width: 100,
    btn_style: 'margin-left: auto; margin-right: auto',
    
    initComponent: function() {
        Ext.apply(this, {
            style: 'margin-top: 0px; margin-bottom: 15px; margin-left: auto; margin-right: auto; padding: 5px 0px 5px 5px',
            cls: 'gwst-button-panel',
            layout:'table',
            border: false,
            width: 260,
            defaults: {
                bodyStyle:'border: none'
            },
            layoutConfig: {
                columns: 2
            }
        });
        // Call parent (required)
        gwst.widgets.TwoButtonPanel.superclass.initComponent.apply(
          this, arguments);                     
    },
    
    onRender: function() {
        if (this.btn1_handler) {
            // action for the button in the button panel
            this.btn1 = new Ext.Button({
                text: this.btn1_text,
                handler: this.btn1_handler,
                width: this.btn1_width
            });
            if (!this.btn1_enabled) {
            	this.btn1.disable();
            }            
            this.add({
                items: [this.btn1],
                width: this.btn1_width + 10,
                style: this.btn_style
            });
        } else {
            this.add({
                html: '',
                width: this.btn1_width + 10
            })
        };
        if (this.btn2_handler) {
            this.btn2 = new Ext.Button({
                text: this.btn2_text,
                handler: this.btn2_handler,
                width: this.btn2_width
            });
            if (!this.btn2_enabled) {
            	this.btn2.disable();
            }
            this.add({
                items: [this.btn2],
                width: this.btn2_width + 10,
                style: this.btn_style
            });
        } else {
            this.add({
                html: '',
                width: this.btn2_width + 10
            });
        }
        // Call parent (required)
        gwst.widgets.TwoButtonPanel.superclass.onRender.apply(this, arguments); 
    },
    
    enableBtn2: function() {
    	this.btn2.enable();
    },
    
    disableBtn2: function() {
    	this.btn2.disable();
    }    
});

// register xtype to allow for lazy initialization
Ext.reg('gwst-two-button-panel', gwst.widgets.TwoButtonPanel);