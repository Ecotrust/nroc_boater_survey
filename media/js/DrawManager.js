Ext.namespace('gwst');

/*
gwst.DrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.DrawManager = Ext.extend(Ext.util.Observable, {
	cur_feature: null, //Last drawn feature
	cancelWinOffset: [540, 8],
    routeCancelWinOffset: [540, 8],
    resetMapWinOffset: [380, 8],	//Offset from top left to render
    mapNavWinOffset: [380, 60],	    //Offset from top left to render
	activityNum: 0,
    route_factors_other: null,
    act_list_items: null,
    fish_tgts: null,
    view_tgts: null,
    dive_tgts: null,
    fish_rank: null,
    view_rank: null,
    dive_rank: null,
    activity_shapes_drawn: false,
    help_on: true,

    constructor: function(){
        gwst.DrawManager.superclass.constructor.call(this);
        this.mapPanelListeners = {
        		'render': this.mapPanelCreated.createDelegate(this)
        };        
    },          

    startInit: function() {
    
        this.createError();  
        
        Ext.Ajax.request({
            url: gwst.settings.urls.check,
            method: 'GET',
            disableCachingParam: true,
            success: this.finInit,
            failure: function(response, opts) {
                // change to error window
                gwst.error.load('An error has occurred while trying to check for previous survey instance.');
            },
            scope: this
        });
    
    },
    
    finInit: function(response) {
        var complete = Ext.decode(response.responseText); 
        if (complete.is_complete) {
            window.location = return_url;
        } else {
            this.enableUnloadWarning();
            this.loadViewport();
            this.loadResetMapWin();
            this.startIntroStep();
        }
    },
                    
    /********************** Survey steps ************************/

    startIntroStep: function() {
        this.loadIntroPanel();
        this.loadMapHelpWindow();
    },
    
    finIntroStep: function() { 
        this.zoomed = this.checkZoom();
        if (this.zoomed) {
            this.help_on = false;
            this.showHelp(false);
            this.startDrawInstructStep();
        }
    },

    startDrawInstructStep: function() {
        this.loadPlotRoutePanel();
    },
    
    finDrawInstructStep: function() {
        this.startRouteInfoStep();
    },
    
    startEditRouteStep: function() {
        this.loadEditRoutePanel();
        //Finish off the sketch creating the route feature
        this.mapPanel.lineFinish();
        this.enableFeatureEdit();
    },  
    
    finEditRouteStep: function() {
        this.disableFeatureEdit();
        //Now that we're done editing, time to validate
        this.validateShape(this.cur_feature, 'route');
    },
    
    startRouteInfoStep: function() {
        this.loadRouteInfo1Panel();
    },
    
    finRouteInfoStep: function() {
        this.factor_count = this.routeInfo1Panel.answer_one.items.getCount();
        if (!this.route_factors) {
            this.route_factors = new Array();
        } else {
            this.route_factors = [];
        }
        for (var i = 0; i < this.factor_count; i++) {
            if (this.routeInfo1Panel.answer_one.items.get(i).checked) {
                this.route_factors.push(this.routeInfo1Panel.answer_one.items.get(i).name);
            }
        }
        if (this.routeInfo1Panel.answer_one.items.get(this.factor_count-1).checked) {
            this.route_factors_other = this.routeInfo1Panel.other_one.getValue();
        }
        this.routeInfo1Panel.resetPanel();
        this.saveNewRoute();
    },

    skipActivitiesStep: function() {
        Ext.Msg.show({
           title:'Skip Activities?',
           msg: 'Are you sure you want to skip the drawing of your activity areas?',
           buttons: Ext.Msg.YESNO,
           fn: this.skipActivitiesCheck.createDelegate(this),
           icon: Ext.MessageBox.QUESTION
        });        
    },
    
    skipDrawingStep: function() {
        Ext.Msg.show({
           title:'Stop Drawing?',
           msg: 'Are you sure you want to stop drawing activity areas? If you have drawn other areas, they are already saved.',
           buttons: Ext.Msg.YESNO,
           fn: this.stopDrawingCheck.createDelegate(this),
           icon: Ext.MessageBox.QUESTION
        });        
    },

    skipActivitiesCheck: function(id, text, opt) {
        if (id == 'yes') {
            this.updateStatus('act_status','Skipped',this.finUpdateActStatus);
        }
    },
    
    stopDrawingCheck: function(id, text, opt) {
        if (id == 'yes') {
            this.mapPanel.disablePointDraw();
            if (this.activity_shapes_drawn) {
                this.stopDrawing();
            } else {
                this.updateStatus('act_status','Skipped',this.finUpdateActStatus);
            }
        }
    },
    
    startActivityAreasStep: function() {
        this.loadActivityAreasPanel();
    },

/*
    startEditActivityStep: function() {
        this.loadEditActivityPanel();
        this.enableFeatureEdit();
    },  
    
    finEditActivityStep: function() {
        this.disableFeatureEdit();
        this.validateShape(this.cur_feature, 'act_area');
    },
*/
    
    startActivityInfoStep: function() {
        this.loadActivityQuestionsPanel();
    },
    
    finActivityInfoStep: function() {
        this.act_list_items = {};
        for (this.i = 0; this.i < this.activityQuestionsPanel.answer_one.items.length; this.i++) {
            this.act_list_item = this.activityQuestionsPanel.answer_one.items.get(this.i);
            this.act_list_items[this.act_list_item.name] = this.act_list_item.checked;
        }
        if (this.act_list_items['other']) {
            this.act_list_items['other'] = this.activityQuestionsPanel.other_one.getValue();
        }
        this.activityQuestionsPanel.resetPanel();
        this.startFishingQuestionsStep();
    },
    
    startFishingQuestionsStep: function() {
        if (this.act_list_items['fishing']) {
            this.loadFishingQuestionsPanel();
        } else {
            this.startViewingQuestionsStep();
        }
    },
    
    getFishingAnswers: function() {
        this.fish_tgts = {};
        for (this.i = 0; this.i < this.fishingQuestionsPanel.fishing_one.items.length; this.i++) {
            this.fish_target = this.fishingQuestionsPanel.fishing_one.items.get(this.i);
            this.fish_tgts[this.fish_target.name] = this.fish_target.checked;
        }
        if (this.fish_tgts['fish-other']) {
            this.fish_tgts['fish-other'] = this.fishingQuestionsPanel.other_fish.getValue();
        }
        this.fish_rank = this.fishingQuestionsPanel.fishing_two.getValue().inputValue;
        this.finFishingQuestionsStep();
    },
    
    finFishingQuestionsStep: function() {
        this.fishingQuestionsPanel.resetPanel();
        this.startViewingQuestionsStep();
    },
    
    startViewingQuestionsStep: function() {
        if (this.act_list_items['wildlife-viewing']) {
            this.loadViewingQuestionsPanel();
        } else {
            this.startDivingQuestionsStep();
        }
    },
        
    getViewingAnswers: function() {
        this.view_tgts = {};
        for (this.i = 0; this.i < this.viewingQuestionsPanel.viewing_one.items.length; this.i++) {
            this.view_target = this.viewingQuestionsPanel.viewing_one.items.get(this.i);
            this.view_tgts[this.view_target.name] = this.view_target.checked;
        }
        if (this.view_tgts['view-other']) {
            this.view_tgts['view-other'] = this.viewingQuestionsPanel.other_view.getValue();
        }
        this.view_rank = this.viewingQuestionsPanel.viewing_two.getValue().inputValue;
        this.finViewingQuestionsStep();
    },
    
    finViewingQuestionsStep: function() {
        this.viewingQuestionsPanel.resetPanel();
        this.startDivingQuestionsStep();
    },
    
    startDivingQuestionsStep: function() {
    if (this.act_list_items['diving']) {
            this.loadDivingQuestionsPanel();
        } else {
            this.saveNewPoint();
        }
    },
        
    getDivingAnswers: function() {
        this.dive_tgts = {};
        for (this.i = 0; this.i < this.divingQuestionsPanel.diving_one.items.length; this.i++) {
            this.dive_target = this.divingQuestionsPanel.diving_one.items.get(this.i);
            this.dive_tgts[this.dive_target.name] = this.dive_target.checked;
        }
        if (this.dive_tgts['dive-other']) {
            this.dive_tgts['dive-other'] = this.divingQuestionsPanel.other_dive.getValue();
        }
        this.dive_rank = this.divingQuestionsPanel.diving_two.getValue().inputValue;
        this.finDivingQuestionsStep();
    },
    
    finDivingQuestionsStep: function() {
        this.divingQuestionsPanel.resetPanel();
        // this.saveNewArea();
        this.saveNewPoint();
    },

    startMoreActivitesStep: function() {
        this.loadMoreActivitiesPanel();
    },
    
    finMoreActivitiesStep: function(result) {
        if (!result.draw_new) {
            this.updateStatus('complete',true,this.finUpdateCompleteStatus);
    	} else {
        
            this.route_factors_other= null;
            this.act_list_items = null;
            this.fish_tgts = null;
            this.view_tgts = null;
            this.dive_tgts = null;
            this.fish_rank = null;
            this.view_rank = null;
            this.dive_rank = null;
    		this.startActivityAreasStep();
        }    	
    },
    
    startFinishedStep: function() {
        this.disableUnloadWarning();
        this.loadFinishPanel();
    },
    
    finFinishedStep: function() {
        window.location = return_url;
    },    

    /* 
     * Setup UI for invalid shape error display step 
     */
    startInvalidRouteStep: function(status_code) {
        this.loadInvalidRoutePanel(status_code);        
        this.mapPanel.removeLastFeature();
    },

    /* 
     * Setup UI for invalid shape error display step 
     */
/*
    startInvalidShapeStep: function(status_code) {
        this.loadInvalidShapePanel(status_code);        
        this.mapPanel.disablePolyDraw(); //Turn off drawing
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
    },
*/
       
    /*
     * Process and finish Invalid Shape step
     */
    finInvalidRouteStep: function() {
		this.mapPanel.removeLastFeature();
  	    this.startDrawInstructStep();        
    },        
       
    /*
     * Process and finish Invalid Shape step
     */
/*
    finInvalidShapeStep: function() {
		this.mapPanel.removeLastFeature();
        this.startActivityAreasStep();
    },       
*/
    
    /******************** UI widget handlers ********************/   
    
    showHelp: function(result) {
        this.help_on = result;
        if (result) {
            this.loadMapHelpWindow();
        } else {
            if (this.navHelpWin) {
                this.navHelpWin.hide();
            }
        }
        if (this.plotRoutePanel && !this.plotRoutePanel.hidden) {
            this.plotRoutePanel.help_box.setValue(result);
        }
        if (this.actAreasPanel && !this.actAreasPanel.hidden) {
            this.actAreasPanel.help_box.setValue(result);
        }
    },
    
    loadMapHelpWindow: function() {
        if (!this.navHelpWin) {
            this.navHelpWin = new gwst.widgets.NavHelpWindow();            
        }
        this.navHelpWin.show();
        this.navHelpWin.alignTo(document.body, "tl-tl", this.mapNavWinOffset);
        this.navHelpWin.on('view-nav-details', this.loadNavigationDetails, this);
        this.navHelpWin.on('hide', function(){this.showHelp(false);}, this);
    },
    
    loadNavigationDetails: function() {
        if (!this.navDetailsWin) {
            this.navDetailsWin = new gwst.widgets.NavDetailsWindow();
        }
        this.navDetailsWin.show();
    },
    
    loadIntroPanel: function() {      	
        this.introPanel = new gwst.widgets.IntroPanel();
        //When panel fires event saying it's all done, we want to process it and move on 
        this.introPanel.on('intro-cont', this.finIntroStep, this); 
        this.introPanel.on('show-help', this.showHelp, this);
        this.viewport.setWestPanel(this.introPanel);
    },    

    loadPlotRoutePanel: function() {      	
    	if (!this.plotRoutePanel) {
	    	this.plotRoutePanel = new gwst.widgets.PlotRoutePanel({
                help_checked: this.help_on
            });
    	}
        this.viewport.setWestPanel(this.plotRoutePanel);  
        this.plotRoutePanel.help_box.on('show-help', this.showHelp, this);
        Ext.MessageBox.alert('Route Plotting', 
            '<p>You are now in route plotting mode.</p>\
            <p>When you click on the map, you will begin plotting your route.</p>\
            <p>Map navigation buttons will still work.</p>',
            this.activateRouteDraw, this);
    },      
    
    /* Render viewport with main widgets to document body (right now) */
    loadViewport: function() {
        this.viewport = new gwst.widgets.MainViewport({
			mapPanelListeners: this.mapPanelListeners
		});
    },            

    activateRouteDraw: function() {
        this.mapPanel.enableLineDraw();
        this.loadAddRouteTooltip();
        this.loadRouteCancelWin();
    }, 

    activatePointDraw: function() {
        this.mapPanel.enablePointDraw();
    },

    activatePolyDraw: function() {
        if (this.mapPanel.map.getZoom() < gwst.settings.minimum_draw_zoom) {
            alert(gwst.settings.zoom_error_text);
        } else {    
            this.mapPanel.enablePolyDraw();
            this.loadDrawAreaTooltip();
            this.loadCancelWin();
        }
    },

    loadRouteCancelWin: function() {
        if (!this.routeCancelWin) {
			this.routeCancelWin = new gwst.widgets.CancelWindow();
			this.routeCancelWin.on('cancel-clicked', this.mapPanel.cancelLine, this.mapPanel);
			this.routeCancelWin.on('cancel-clicked', this.hideMapTooltip, this);
		}
		this.routeCancelWin.show();		
		this.routeCancelWin.alignTo(document.body, "tl-tl", this.routeCancelWinOffset);    	
    },
    
    loadCancelWin: function() {
    	if (!this.cancelWin) {
			this.cancelWin = new gwst.widgets.CancelWindow();
			this.cancelWin.on('cancel-clicked', this.mapPanel.cancelPoly, this.mapPanel);
			this.cancelWin.on('cancel-clicked', this.hideMapTooltip, this);
		}
		this.cancelWin.show();		
		this.cancelWin.alignTo(document.body, "tl-tl", this.cancelWinOffset);    	
    },
    
    hideCancelWin: function() {
    	if (this.cancelWin) {
    		this.cancelWin.hide();
    	}
        if (this.routeCancelWin) {
            this.routeCancelWin.hide();
        }
    },

    /* Load the Invalid Shape west panel */
    loadInvalidShapePanel: function(status_code) {
    	if (!this.invalidShapePanel) {
            this.invalidShapePanel = new gwst.widgets.InvalidShapePanel({
                status_code: status_code
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.invalidShapePanel.on('okay-btn', this.finInvalidShapeStep, this);
        } else {
            this.invalidShapePanel.updateText({
                status_code: status_code
            });
        }
        this.viewport.setWestPanel(this.invalidShapePanel);    	
    },    
    
    /* Load the Invalid Shape west panel */
    loadInvalidRoutePanel: function(status_code) {
    	if (!this.invalidRoutePanel) {
            this.invalidRoutePanel = new gwst.widgets.InvalidRoutePanel({
                status_code: status_code
            });
            //When panel fires event saying it's all done, we want to process it and move on 
            this.invalidRoutePanel.on('okay-btn', this.finInvalidRouteStep, this);
        } else {
            this.invalidRoutePanel.updateText({
                status_code: status_code
            });
        }
        this.viewport.setWestPanel(this.invalidRoutePanel);    	
    },     
    
    /* Load the satisfied with route west panel */
    loadSatisfiedRoutePanel: function() {
    	if (!this.satisfiedRoutePanel) {
    		this.satisfiedRoutePanel = new gwst.widgets.SatisfiedRoutePanel();
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satisfiedRoutePanel.on('cont-route', this.resumeRoute, this);
            this.satisfiedRoutePanel.on('edit-route', this.startEditRouteStep, this);
            this.satisfiedRoutePanel.on('redraw-route', this.redrawRoute, this);
            this.satisfiedRoutePanel.on('save-route', this.completeRoute, this);
        }
        this.viewport.setWestPanel(this.satisfiedRoutePanel);  
        this.routeCancelWin.hide();
    },    
    
    completeRoute: function() {
        //Finish off the sketch creating the route feature
        this.mapPanel.lineFinish();
        this.validateShape(this.cur_feature, 'route');
    },
    
    redrawRoute: function() {
        //Finish off the sketch creating the route feature
        this.mapPanel.lineFinish();
        this.mapPanel.removeLastFeature();
    	this.startDrawInstructStep();
    },
    
    redrawEditRoute: function() {
        //Finish off the sketch creating the route feature
        this.disableFeatureEdit();
        this.mapPanel.removeLastFeature();
    	this.startDrawInstructStep();    
    },
    
    /* Load the edit route west panel */
    loadEditRoutePanel: function() {
        if (!this.editRoutePanel) {
            this.editRoutePanel = new gwst.widgets.EditRoutePanel();
            //When panel fires event saying it's all done, we want to process it and move on 
            this.editRoutePanel.on('redraw-edit-route', this.redrawEditRoute, this);
            this.editRoutePanel.on('save-edit-route', this.finEditRouteStep, this);
        }
        this.viewport.setWestPanel(this.editRoutePanel);
    },
    
    loadRouteInfo1Panel: function() {
        if (!this.routeInfo1Panel) {
            this.routeInfo1Panel = new gwst.widgets.RouteInfo1Panel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.routeInfo1Panel.on('route-info1-cont', this.finRouteInfoStep, this);
        }
        this.viewport.setWestPanel(this.routeInfo1Panel);    
    },

    loadActivityAreasPanel: function() {      	
    	if (!this.actAreasPanel) {
	    	this.actAreasPanel = new gwst.widgets.ActivityAreasPanel({
                help_checked: this.help_on
            });
	        //When panel fires event saying it's all done, we want to process it and move on
            this.actAreasPanel.on('draw-skip', this.skipDrawingStep, this);            
    	}
        this.viewport.setWestPanel(this.actAreasPanel);
        this.actAreasPanel.help_box.on('show-help', this.showHelp, this);
        Ext.MessageBox.alert('Activity Plotting', 
            '<p>You are now in activity plotting mode.</p>\
            <p>When you click on the map, you will place an activity marker.</p>\
            <p>Map navigation buttons will still work.</p>',
            this.activatePointDraw, this);
    },    
    
    /* Load the satisfied with activity west panel */
    loadSatisfiedActivityPanel: function() {
    	if (!this.satisfiedActPanel) {
    		this.satisfiedActPanel = new gwst.widgets.SatisfiedActivityPanel();
            this.satisfiedActPanel.on('edit-act', this.startEditActivityStep, this);
            this.satisfiedActPanel.on('redraw-act', this.redrawActivity, this);
            this.satisfiedActPanel.on('save-act', this.completeActivity, this);
        }
        this.viewport.setWestPanel(this.satisfiedActPanel);    
    },   

    completeActivity: function() {
        // this.validateShape(this.cur_feature,'act_area');
        this.validateShape(this.cur_feature,'act_point');
    },

    redrawActivity: function() {
        this.mapPanel.removeLastFeature();
    	this.startActivityAreasStep();
    },    
    
    redrawEditActivity: function() {
        this.disableFeatureEdit();
        this.redrawActivity();
    },

/*    
    loadEditActivityPanel: function() {
        if (!this.editActPanel) {
            this.editActPanel = new gwst.widgets.EditActivityPanel();
            //When panel fires event saying it's all done, we want to process it and move on 
            this.editActPanel.on('redraw-edit-act', this.redrawEditActivity, this);
            this.editActPanel.on('save-edit-act', this.finEditActivityStep, this);
        }
        this.viewport.setWestPanel(this.editActPanel);
    },
*/
    
    loadActivityQuestionsPanel: function() {
        if (!this.activityQuestionsPanel) {
            this.activityQuestionsPanel = new gwst.widgets.ActivityQuestionsPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.activityQuestionsPanel.on('activity-questions-cont', this.finActivityInfoStep, this);
        }
        this.viewport.setWestPanel(this.activityQuestionsPanel);    
    },
    
    loadFishingQuestionsPanel: function() {
        if (!this.fishingQuestionsPanel) {
            this.fishingQuestionsPanel = new gwst.widgets.FishingQuestionsPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.fishingQuestionsPanel.on('fishing-questions-cont', this.getFishingAnswers, this);
        }
        this.viewport.setWestPanel(this.fishingQuestionsPanel);    
    },
    
    loadViewingQuestionsPanel: function() {
        if (!this.viewingQuestionsPanel) {
            this.viewingQuestionsPanel = new gwst.widgets.ViewingQuestionsPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.viewingQuestionsPanel.on('viewing-questions-cont', this.getViewingAnswers, this);
        }
        this.viewport.setWestPanel(this.viewingQuestionsPanel);    
    },
    
    loadDivingQuestionsPanel: function() {
        if (!this.divingQuestionsPanel) {
            this.divingQuestionsPanel = new gwst.widgets.DivingQuestionsPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.divingQuestionsPanel.on('diving-questions-cont', this.getDivingAnswers, this);
        }
        this.viewport.setWestPanel(this.divingQuestionsPanel);    
    },

    loadMoreActivitiesPanel: function() {
        if (!this.moreActivitiesPanel) {
            this.moreActivitiesPanel = new gwst.widgets.MoreActivitiesPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.moreActivitiesPanel.on('draw-new', this.finMoreActivitiesStep, this);
        }
        this.viewport.setWestPanel(this.moreActivitiesPanel);    
    },
    
    loadFinishPanel: function() {
        if (!this.finishPanel) {
            this.finishPanel = new gwst.widgets.FinishPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.finishPanel.on('finish-cont', this.finFinishedStep, this);
        }
    this.viewport.setWestPanel(this.finishPanel);
    },
    
    /******************** Feature handling *****************/
    
    enableFeatureEdit: function() {
        this.mapPanel.modifyFeature(this.cur_feature);
    },
    
    disableFeatureEdit: function() {
        this.mapPanel.finModifyFeature();
    },
    
    validateShape: function(feature, type) {    	
    	var config = {
            geometry: feature.geometry.toString(),
            survey_id: gwst.settings.interview_id,
            type: type
         }    	
        this.loadWait('Validating your shape');
    	Ext.Ajax.request({
	        url: gwst.settings.urls.shape_validate,        
	        method: 'POST',
	        disableCachingParam: true,
	        params: config,
	        success: this.finValidateShape,
          	failure: function(response, opts) {
                //Change to error window
                this.hideWait();
                gwst.error.load('An error has occurred.  Please try again and notify us if it happens again.');
           	},
            scope: this
	    });        
    },

    /* Processes the result of validateShape */
    finValidateShape: function(response, opts) {
        this.hideWait();
        var res_obj = Ext.decode(response.responseText);
        var status_code = parseFloat(res_obj.status_code);
        
        //Feature is valid
        if (status_code == 0) {
            if (res_obj.type == 'route') {
                this.finDrawInstructStep();
            } else {
                this.startActivityInfoStep();           //TODO!!!
            }
        //Feature is invalid
        } else if (status_code > 0){
            if (res_obj.type == 'route') {
                this.startInvalidRouteStep(status_code);	
            } else {
                this.startInvalidShapeStep(status_code);	
            }
        } else {
            gwst.error.load('An error has occurred while trying to validate your area.  Please try again and notify us if this keeps happening.');
        }        
    },          

    updateStatus: function(field,val,handler) {
        this.loadWait('Updating');
        
        var data = {
            survey_id: gwst.settings.interview_id,
            field: field,
            val: val
        };
        Ext.Ajax.request({
            url: gwst.settings.urls.status,
            method: 'POST',
            disableCachingParam: true,
            params: {status: Ext.util.JSON.encode(data)},
            success: handler,
            failure: function(response, opts) {
                //change to error window
                this.hideWait.defer(500, this);
                gwst.error.load('An error has occurred while trying to update.');
            },
            scope: this
        });
    },

    saveNewRoute: function() {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.cur_feature.geometry.toString(),
            survey_id: gwst.settings.interview_id,
            type: 'route',
            factors: this.route_factors, 
            other_factor: this.route_factors_other
        };
        Ext.Ajax.request({
	        url: gwst.settings.urls.shapes,
	        method: 'POST',
	        disableCachingParam: true,
	        params: {feature: Ext.util.JSON.encode(data)},
	        success: this.finSaveNewRoute,
           	failure: function(response, opts) {
        		// Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An error has occurred while trying to save.');
           	},
            scope: this
	    });  
    },     

/*    
    saveNewArea: function() {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.cur_feature.geometry.toString(),
            survey_id: gwst.settings.interview_id,
            type: 'act_area',
            primary_act: this.activity_1_primary, 
            duration: this.activity_1_duration, 
            rank: this.activity_1_rank, 
            factors: this.activity_factors, 
            other_factor: this.activity_factors_other
        };
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes,
            method: 'POST',
            disableCachingParam: true,
            params: {feature: Ext.util.JSON.encode(data)},
            success: this.finSaveNewActivity,
            failure: function(response, opts) {
                // Change to error window
                this.hideWait.defer(500, this);
                gwst.error.load('An error has occurred while trying to save.');
            },
            scope: this
        });  
    },     
*/
    
    saveNewPoint: function() {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.cur_feature.geometry.toString(),
            survey_id: gwst.settings.interview_id,
            type: 'act_point',
            activities: this.act_list_items,
            fish_tgts: this.fish_tgts,
            fish_rank: this.fish_rank,
            view_tgts: this.view_tgts,
            view_rank: this.view_rank,
            dive_tgts: this.dive_tgts,
            dive_rank: this.dive_rank
        };
        Ext.Ajax.request({
            url: gwst.settings.urls.shapes,
            method: 'POST',
            disableCachingParam: true,
            params: {feature: Ext.util.JSON.encode(data)},
            success: this.finSaveNewActivity,
            failure: function(response, opts) {
                // Change to error window
                this.hideWait.defer(500, this);
                gwst.error.load('An error has occurred while trying to save.');
            },
            scope: this
        });  
    },
    
    stopDrawing: function(response) {
        this.updateStatus('complete',true,this.finUpdateCompleteStatus);
    },
    
    finUpdateActStatus: function(response) {
        var new_status = Ext.decode(response.responseText);
        this.hideWait.defer(500, this);
        this.updateStatus('complete',true,this.finUpdateCompleteStatus);
    },
    
    finUpdateCompleteStatus: function(response) {
        var new_status = Ext.decode(response.responseText);
        this.hideWait.defer(500, this);
        this.startFinishedStep();
    },
    
    finSaveNewRoute: function(response) {
    	var new_feat = Ext.decode(response.responseText);    
    	this.hideWait.defer(500, this);
        this.startActivityAreasStep();
    },
    
    finSaveNewActivity: function(response) {
    	var new_feat = Ext.decode(response.responseText);    
    	this.hideWait.defer(500, this);
        this.activity_shapes_drawn = true;
        this.startMoreActivitesStep();
    },

    /******************** Event handlers *******************/   

    newFeatureHandler: function(feature) {
        //track current feature for referencing later
    	this.cur_feature = feature;
    	if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.LineString') {
            this.hideCancelWin();
            this.hideMapTooltip();
            //the route pause handler will handle loading the satisfied panel
    	} else {
            this.mapPanel.disablePointDraw();
            this.loadSatisfiedActivityPanel();
    	}
    },
    
    checkZoom: function() {
        if (this.mapPanel.map.getZoom() < gwst.settings.minimum_draw_zoom) {
            alert(gwst.settings.zoom_error_text);
            return false;
        } else {
            return true;
        }
    },
    
    pauseRoute: function() {
    	this.hideMapTooltip();
    	this.hideCancelWin();    	
        this.loadSatisfiedRoutePanel();    	    
    },
    
    resumeRoute: function() {    
        this.mapPanel.lineResume();
        this.startDrawInstructStep();
        this.loadRouteCancelWin();
    },

    /* 
     * Listen for map panel creation and then create hooks into it and setup 
     * additional map-related widgets 
     */
    mapPanelCreated: function() {
    	this.mapPanel = Ext.getCmp('mappanel');    	
    	this.mapPanel.on('line-paused', this.pauseRoute, this);    	
    	this.mapPanel.on('vector-completed', this.newFeatureHandler, this);    	
    },    
    
    zoomToCity: function(city_rec) {
    	this.mapPanel.zoomToPoint(city_rec.get('feature'));
    },
    
    zoomToPlacemark: function(place_rec) {
    	this.mapPanel.zoomToPoint(place_rec.get('feature'));
    },
    
    /******************** UI Utility Functions ********************/    
    
    enableUnloadWarning: function() {
        window.onbeforeunload = function confirmBrowseAway() {
            return "If you leave now your survey will be left unfinished.";
        }    
    },
    
    disableUnloadWarning: function() {
        window.onbeforeunload = null;
    },
    
    loadAddRouteTooltip: function() {
    	this.loadMapTooltip('Now click on the map where you started your route. Continue clicking and tracing it out. Double-click the last point to finish');
    },    
    
    loadDrawAreaTooltip: function() {
    	this.loadMapTooltip('Click on the map to start drawing your area.  Continue clicking and tracing it out. Double-click the last point to finish');
    },
    
    loadMapTooltip: function(text) {
    	if (this.mapTip) {
    		this.mapTip.hide();
    		this.mapTip.destroy();
    		this.mapTip = null;
    	}
    	this.mapTip = new Ext.ToolTip({
    		id: 'map-tip',
            target: 'mappanel',
            width:150,
            trackMouse: true,
            autoHide: false,
            html: text,
            mouseOffset: [25,28],
            style: 'opacity: 0.6; -moz-opacity: 0.6'
    	});
    },
    
    hideMapTooltip: function() {
    	if (this.mapTip) {
    		this.mapTip.hide();
    		this.mapTip.destroy();
    		this.mapTip = null;
    	}
    },
    
    /* Load wait message window.  Tells the user an action is in progress.  Don't forget to hide it again. */
    loadWait: function(msg) {
        if (!this.wait_win) {
            this.wait_win = new gwst.widgets.WaitWindow();            
            this.wait_win.on(
                'show',
                (function(){this.wait_win.center();}).createDelegate(this)
            );            
        }
        this.wait_win.showMsg(msg);
    },
    
    /* Hide the wait window */
    hideWait: function() {
        this.wait_win.hide();
    },
    
    /* Create global error message window. */
    createError: function(msg) {
        if (!gwst.error) {
            gwst.error = new gwst.widgets.ErrorWindow();            
            gwst.error.on(
                'show',
                (function(){gwst.error.center();}).createDelegate(this)
            );            
        }
    },
    
    /* Create Reset Map View window*/
    loadResetMapWin: function() {
    	if (!this.resetMapWin) {
			this.resetMapWin = new gwst.widgets.ResetMapWindow();
			this.resetMapWin.on('reset-map', this.loadResetCheckWin, this);
		}
		this.resetMapWin.show();		
		this.resetMapWin.alignTo(document.body, "tl-tl", this.resetMapWinOffset);
    },
    
    /*Show window to check that user wants to leave */
    loadResetCheckWin: function() {
        if (!this.resetCheckWin) {
            this.resetCheckWin = new gwst.widgets.ResetMapCheckWindow();
            this.resetCheckWin.on('confirm', this.resetMapView, this);
        }
        this.resetCheckWin.show();
    },
    
    resetMapView: function() {
        this.mapPanel.resetMapView();
    }
    
});