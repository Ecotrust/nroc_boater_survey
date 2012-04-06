Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.RoundTripWindow = Ext.extend(Ext.Window, {
    
    // Constructor Defaults, can be overridden by user's config object
    initComponent: function(){	

        this.addEvents('okay-route');
        this.addEvents('auto-return-route');
        this.addEvents('cont-route');
    
		Ext.apply(this, {          
            title: 'Route is not round-trip!',
        	layout:'fit',
            width:350,
            html: '<p>As drawn, your route dow not return to your departure location. If you did not return to your point of departure on this trip, click \'FINISHED\'. If your return route followed the same route exactly as you have plotted it, click \'THE SAME\'. If you would like to go back and finish plotting your route, click \'PLOT RETURN\'.</p>',
            height:300,
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction:'hide',
            closable: true,
            modal: true,
            draggable: false,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'PLOT RETURN',
                    handler: this.plotBtnClicked.createDelegate(this)
                },
                {xtype:'tbfill'},
				{
                    text: 'THE SAME',
                    handler: this.sameBtnClicked.createDelegate(this)
                },
                {xtype:'tbfill'},
				{
                    text: 'FINISHED',
                    handler: this.closeBtnClicked.createDelegate(this)
                }
			]
        });
		gwst.widgets.RoundTripWindow.superclass.initComponent.call(this);		
	},
    
    closeBtnClicked: function() {
        this.hide();
        this.fireEvent('okay-route');
    },
    
    sameBtnClicked: function() {
        this.hide();
        this.fireEvent('auto-return-route');
    },
    
    plotBtnClicked: function() {
        this.hide();
        this.fireEvent('cont-route');
    },
    
    load: function() {
        this.show();
    }
});

//register xtype to allow for lazy initialization
Ext.reg('gwst-round-trip-window', gwst.widgets.RoundTripWindow);