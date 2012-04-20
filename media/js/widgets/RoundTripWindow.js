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
            width:500,
            html: '<p class="help-win">As drawn, your route does not return to your launch site.</p>\
                <p class="help-win">If you did not return to your launch site on this trip, click \'FINISHED\'.</p>\
                <p class="help-win">If you followed the same route back to your launch site, \
                the mapping application can complete your route by clicking \'SAME WAY\'.</p>\
                <p class="help-win">If you need to finish plotting your return route, click \'PLOT RETURN\'.</p>',
            height:325,
            plain: true,
            bodyStyle: 'padding: 8px; font-weight: bold',
            closeAction:'hide',
            closable: false,
            modal: true,
            draggable: false,
            bbar: [
				{xtype:'tbfill'},
				{
                    text: 'PLOT RETURN',
                    handler: this.plotBtnClicked.createDelegate(this)
                },
                {
                    xtype:'tbseparator',
                    width: 15
                },
				{
                    text: 'SAME WAY',
                    handler: this.sameBtnClicked.createDelegate(this)
                },
                {
                    xtype:'tbseparator',
                    width: 15
                },
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