Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ActivityInfo4Panel = Ext.extend(gwst.widgets.WestPanel, {
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){
		
        // Call parent (required)
        gwst.widgets.ActivityInfo4Panel.superclass.initComponent.apply(
          this, arguments);                     
    },

    onRender: function(){
        this.header_panel = new Ext.Container({  
			autoEl: {tag:'div', cls:'action-panel-header', id:'header_activity_info4', html:'Secondary Location'},
			style: 'padding:5px',
            id: 'activity_info4_panel',
			border: false   
        }); 
        
		this.question_one = new Ext.Panel({		
			html: '<p>For the last question, you said you would engage in an activity at a different location if you had to.  At this time, please draw on the map the area you most likely would have gone.</p>',
			style: 'margin: 10px',
			border: false
        });
        
        //collapsible instruction panel - content from first draw panel
        this.instruction_again_panel = new Ext.Panel({
            title: 'How do I draw, again?',
            collapsible: true,
            collapsed: true,        
            layout: 'table',
            border: false,
            style: 'margin: 0px 5px 5px 5px; padding: 0px 5px 5px 5px',
            defaults: {
                bodyStyle: 'border: none; padding: 0px 5px 5px 5px'
            },
            layoutConfig: {
                columns: 2
            },
            id: 'draw_table_panel',
            items: [{
                html: '<p>a. First, click the \'Draw Area\' button</p>'
            },{
                html: '<img src="/media/img/area_1.png" />'
            },{
                html: '<p>b. Click once on the map to start drawing your area</p>'
            },{
                html: '<img src="/media/img/area_2.png" />'
            },{
                html: '<p>c. Move mouse and click to create a second point</p>'
            }, {
                html: '<img src="/media/img/area_3.png" />'
            },{
                html: '<p>d. Continue clicking, tracing out the boundary of your area</p>'
            },{
                html: '<img src="/media/img/area_4.png" />'
            },{
                html: '<p>e. Use the arrow buttons to move the map as you go</p>'
            },{
                html: '<img src="/media/img/area_5.png" />'
            },{
                html: '<p>f. Double-click the last point to complete the area</p>'
            },{
                html: '<img src="/media/img/area_6.png" />'
            },{
                html: '<p>g. If you made a mistake, click the \'Cancel\' button to start over</p>'
            },{
                html: '<img src="/media/img/area_7.png" />'
            }]
        });       

        // this.button_panel = new gwst.widgets.TwoButtonPanel ({
        	// btn1_width: 120,
        	// btn2_text: 'Continue >>',        	
            // btn2_handler: this.contBtnClicked.createDelegate(this),
            // btn2_width: 100,
            // left_margin: 20
        // });
        
        this.add(this.header_panel);        
        this.add(this.question_one);
        this.add(this.instruction_again_panel);
        // this.add(this.button_panel);
    
        // Call parent (required)
        gwst.widgets.ActivityInfo4Panel.superclass.onRender.apply(this, arguments);     
	}
    
    // contBtnClicked: function() {
        // this.fireEvent('activity-info4-cont',this);
    // }    
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-activity-info4-panel', gwst.widgets.ActivityInfo4Panel);