Ext.namespace('gwst');

/*
gwst.DrawManager- manages resource drawing process including user information, user groups,
shapes and pennies.  Extends Ext.Observable providing event handling
*/
gwst.DrawManager = Ext.extend(Ext.util.Observable, {
	cur_point_activity_index: 0, //Current point activity
	cur_poly_activity_index: 0, //Current poly activity
	cur_activity_num: 1, //Current activity overall
	cur_feature: null, //Last drawn feature
	addRouteWinOffset: [405, 8],
	addPolyWinOffset: [405, 8],
	cancelWinOffset: [562, 8],
    routeCancelWinOffset: [542, 8],
	activityNum: 0,
    alternateActivity: false,
    route_factors: 'test_route_factors',
    route_factors_other: '',
    activity_1_primary: 'test_act_primary',
    activity_1_other: '',
    activity_1_duration: 'test_act_duration',
    activity_1_rank: 'test_act_rank',
    activity_factors: 'test_act_factors',
    activity_factors_other: '',
    activity_3_alt: 'test_act_alternative',
    activity_3_other: '',
    activity_3_alt_act: 'test_activity_alt_act',
    activity_3_alt_other: '',
    alt_act_primary_area: 'test_primary_id',

    constructor: function(){
        gwst.DrawManager.superclass.constructor.call(this);
        this.mapPanelListeners = {
        		'render': this.mapPanelCreated.createDelegate(this)
        };        
    },          

    startInit: function() {
        this.enableUnloadWarning();
        this.loadViewport();
        this.createError();          
        this.startLyrInstructStep();
    },
                    
    /********************** Survey steps ************************/

    startLyrInstructStep: function() {
        this.loadLyrInstructPanel();
    },
    
    finLyrInstructStep: function() {
        this.startNavStep();
    },

    startNavStep: function() {
        this.loadNavPanel();
    },
    
    finNavStep: function() {
    	this.startRouteInstructStep();
    },
        
    startRouteInstructStep: function() {
        this.loadRouteInstructPanel();
    },
    
    finRouteInstructStep: function() {
    	this.startDrawInstructStep();
    },    
    
    startDrawInstructStep: function() {
        this.loadDrawInstructPanel();
        this.loadAddRouteWin();
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
        this.startRouteInfoStep();
    },
    
    startRouteInfoStep: function() {
        this.loadRouteInfo1Panel();
    },
    
    finRouteInfoStep: function() {
        if (this.routeInfo1Panel.answer_one.getValue()) {
            this.route_factors = this.routeInfo1Panel.answer_one.getValue();
            if (this.routeInfo1Panel.other_one.getValue()) {
                this.route_factors_other = this.routeInfo1Panel.other_one.getValue();
            }
        }
        this.routeInfo1Panel.resetPanel();
        this.saveNewRoute();
        // this.startActivityInstructStep();
    },
    
    startActivityInstructStep: function() {
        this.loadActivityInstructPanel();
    },
    
    finActivityInstructStep: function() {
        this.startDrawActivityInstructStep();
    },
    
    skipActivitiesStep: function() {
        this.startFinishedStep();
    },
    
    startDrawActivityInstructStep: function() {
        this.loadDrawActivityInstructPanel();
        this.loadAddPolyWin();
    },
    
    finDrawActivityInstructStep: function() {
        this.startActivityInfoStep();
    },
    
    startEditActivityStep: function() {
        this.loadEditActivityPanel();
        this.enableFeatureEdit();
    },  
    
    finEditActivityStep: function() {
        this.disableFeatureEdit();
        if (this.alternateActivity) {
            this.finActivityInfo4Step();
        } else {
            this.startActivityInfoStep();
        }        
    },
    
    startActivityInfoStep: function() {
        this.loadActivityInfo1Panel();
    },
    
    finActivityInfoStep: function() {
        if ( this.activityInfo1Panel.answer_one.getValue()) {
            this.activity_1_primary = this.activityInfo1Panel.answer_one.getValue();
            if (this.activityInfo1Panel.other_one.getValue()) {
                this.activity_1_other = this.activityInfo1Panel.other_one.getValue();
                if (this.activity_1_primary == 'Other' && this.activity_1_other != "") {
                    this.activity_1_primary = this.activity_1_other;
                }
            }
        }
        if (this.activityInfo1Panel.answer_two.getValue()) { 
            this.activity_1_duration = this.activityInfo1Panel.answer_two.getValue();
        }
        if (this.activityInfo1Panel.answer_three.getValue()) {
            this.activity_1_rank = this.activityInfo1Panel.answer_three.getValue();
        }
        this.activityInfo1Panel.resetPanel();        
        this.startActivityInfo2Step();
    },
    
    startActivityInfo2Step: function() {
        this.loadActivityInfo2Panel();
    },
    
    finActivityInfo2Step: function() {
        if (this.activityInfo2Panel.answer_one.getValue()) {
            this.activity_factors = this.activityInfo2Panel.answer_one.getValue();
            if (this.activityInfo2Panel.other_one.getValue()) {
                this.activity_factors_other = this.activityInfo2Panel.other_one.getValue();
            }
        }
        this.activityInfo2Panel.resetPanel();
        this.startActivityInfo3Step();
    },
    
    startActivityInfo3Step: function() {
        this.loadActivityInfo3Panel();
    },
    
    finActivityInfo3Step: function() {
        if (this.activityInfo3Panel.answer_one.getValue()) {
            this.activity_3_alt = this.activityInfo3Panel.answer_one.getValue();
            if (this.activityInfo3Panel.other_one.getValue()) {
                this.activity_3_other = this.activityInfo3Panel.other_one.getValue();
                if (this.activity_3_alt == 'Other' && this.activity_3_other != "") {
                    this.activity_3_alt = this.activity_3_other;
                }
            }
        }
        
        if (this.activityInfo3Panel.answer_two.getValue()) {
            this.activity_3_alt_act = this.activityInfo3Panel.answer_two.getValue();
            if (this.activityInfo3Panel.other_two.getValue()) {
                this.activity_3_alt_other = this.activityInfo3Panel.other_two.getValue();
                if (this.activity_3_alt_act == 'Other' && this.activity_3_alt_other != "") {
                    this.activity_3_alt_act = this.activity_3_alt_other;
                }
            }
        }
    
        this.saveNewArea(true);
    },
    
    startActivityInfo4Step: function() {
        this.loadActivityInfo4Panel();
        this.loadAltPolyWin();
        this.alternateActivity = true;
    },

    finActivityInfo4Step: function() {
        this.saveNewArea(false);
        // this.startDrawNewAreaStep();
    },

    startEditAltActivityStep: function() {
        this.loadEditActivityPanel();
        this.enableFeatureEdit();    
    },
    
    finEditAltActivityStep: function() {
        this.saveAltActivity();
    },    
    
    startDrawNewAreaStep: function() {
        this.loadDrawNewAreaPanel();
    },
    
    finDrawNewAreaStep: function(result) {
        if (!result.draw_new) {
    		this.startFinishedStep();
    	} else {
        
            this.route_factors= 'test_route_factors';
            this.route_factors_other= '';
            this.activity_1_primary= 'test_act_primary';
            this.activity_1_other= '';
            this.activity_1_duration= 'test_act_duration';
            this.activity_1_rank= 'test_act_rank';
            this.activity_factors= 'test_act_factors';
            this.activity_factors_other= '';
            this.activity_3_alt= 'test_act_alternative';
            this.activity_3_other= '';
            this.activity_3_alt_act= 'test_activity_alt_act';
            this.activity_3_alt_other= '';
            
    		this.startDrawActivityInstructStep();
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
    startInvalidShapeStep: function(status_code) {
        this.loadInvalidShapePanel(status_code);        
        this.mapPanel.disablePolyDraw(); //Turn off drawing
        if (this.drawToolWin) {
        	this.drawToolWin.hide();
        }
    },
       
    /*
     * Process and finish Invalid Shape step
     */
    finInvalidShapeStep: function() {
		this.mapPanel.removeLastFeature();
                                            //TODO: implement new stuff here?
        alert("Is this called? Should it go somewhere? (DrawManager.js - finInvalidShapeStep)");        //TODO: Kill this
    },    
    
    /******************** UI widget handlers ********************/   
    
    loadLyrInstructPanel: function() {
        this.lyrInstructPanel = new gwst.widgets.LayerInstructPanel();
        //When panel fires event saying it's all done, we want to process it and move on 
        this.lyrInstructPanel.on('lyr-cont', this.finLyrInstructStep, this);
        this.viewport.setWestPanel(this.lyrInstructPanel);    
    },
    
    loadNavPanel: function() {      	
        this.navPanel = new gwst.widgets.NavigatePanel();
        //When panel fires event saying it's all done, we want to process it and move on 
        this.navPanel.on('nav-cont', this.finNavStep, this);  
        this.viewport.setWestPanel(this.navPanel);
    },    

    loadRouteInstructPanel: function() {      	
    	if (!this.routeInstructPanel) {
	    	this.routeInstructPanel = new gwst.widgets.RouteInstructPanel();
	        //When panel fires event saying it's all done, we want to process it and move on 
	        this.routeInstructPanel.on('route-cont', this.finRouteInstructStep, this);
    	}
        this.viewport.setWestPanel(this.routeInstructPanel);  
    },      
    
    loadDrawInstructPanel: function() {      	
    	if (!this.drawInstructPanel) {
	    	this.drawInstructPanel = new gwst.widgets.DrawInstructPanel();
    	}
        this.viewport.setWestPanel(this.drawInstructPanel);  
    },      
    
    /* Render viewport with main widgets to document body (right now) */
    loadViewport: function() {
        this.viewport = new gwst.widgets.MainViewport({
			mapPanelListeners: this.mapPanelListeners
		});
    },            
    
    loadAddRouteWin: function() {
    	if (!this.addRouteWin) {
			this.addRouteWin = new gwst.widgets.AddRouteWindow();
			this.addRouteWin.on('draw-route-clicked', this.mapPanel.enableLineDraw, this.mapPanel);
			this.addRouteWin.on('draw-route-clicked', this.loadAddRouteTip, this);		
            this.addRouteWin.on('draw-route-clicked', this.loadRouteCancelWin, this);
		}
		this.addRouteWin.show();		
		this.addRouteWin.alignTo(document.body, "tl-tl", this.addRouteWinOffset);    	
    },
    
    hideAddRouteWin: function() {
    	if (this.addRouteWin) {
    		this.addRouteWin.hide();
    	}
    },

    loadAddPolyWin: function() {
    	if (!this.addPolyWin) {
			this.addPolyWin = new gwst.widgets.AddPolyWindow();
			this.addPolyWin.on('draw-poly-clicked', this.mapPanel.enablePolyDraw, this.mapPanel);
			this.addPolyWin.on('draw-poly-clicked', this.loadDrawAreaTooltip, this);
			this.addPolyWin.on('draw-poly-clicked', this.loadCancelWin, this);			
		}
		this.addPolyWin.show();		
		this.addPolyWin.alignTo(document.body, "tl-tl", this.addPolyWinOffset);    	
    },   
    
    loadAltPolyWin: function() {
    	if (!this.altPolyWin) {
			this.altPolyWin = new gwst.widgets.AddPolyWindow();
			this.altPolyWin.on('draw-poly-clicked', this.mapPanel.enablePolyDraw, this.mapPanel);
			this.altPolyWin.on('draw-poly-clicked', this.loadDrawAreaTooltip, this);
			this.altPolyWin.on('draw-poly-clicked', this.loadCancelWin, this);			
		}
		this.altPolyWin.show();		
		this.altPolyWin.alignTo(document.body, "tl-tl", this.addPolyWinOffset);    	
    },   
    
    hideAddPolyWin: function() {
    	if (this.addPolyWin) {
    		this.addPolyWin.hide();
    	}
        if (this.altPolyWin) {
            this.altPolyWin.hide();
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
    
    /* Load the satisfied with route west panel */
    loadSatisfiedRoutePanel: function() {
    	if (!this.satisfiedRoutePanel) {
    		this.satisfiedRoutePanel = new gwst.widgets.SatisfiedRoutePanel();
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satisfiedRoutePanel.on('cont-route', this.resumeRoute, this);
            this.satisfiedRoutePanel.on('edit-route', this.startEditRouteStep, this);
            this.satisfiedRoutePanel.on('redraw-route', this.redrawRoute, this);
            this.satisfiedRoutePanel.on('save-route', this.saveRoute, this);
        }
        this.viewport.setWestPanel(this.satisfiedRoutePanel);  
        this.routeCancelWin.hide();
    },    
    
    saveRoute: function() {
        //Finish off the sketch creating the route feature
        this.mapPanel.lineFinish();
        // this.saveNewRoute();
        this.finDrawInstructStep();
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
    
    /* Load the draw area instructions west panel*/
    loadActivityInstructPanel: function() {      	
    	if (!this.drawActivityInstructPanel) {
	    	this.actInstructPanel = new gwst.widgets.ActivityInstructPanel();
	        //When panel fires event saying it's all done, we want to process it and move on 
	        this.actInstructPanel.on('activity-cont', this.finActivityInstructStep, this);
            this.actInstructPanel.on('activity-skip', this.skipActivitiesStep, this);
    	}
        this.viewport.setWestPanel(this.actInstructPanel);  
    },   

    loadDrawActivityInstructPanel: function() {      	
    	if (!this.drawActInstructPanel) {
	    	this.drawActInstructPanel = new gwst.widgets.DrawActivityInstructPanel();
	        //When panel fires event saying it's all done, we want to process it and move on 
	        //this.drawActInstructPanel.on('draw-cont', this.finDrawActivityInstructStep, this);
    	}
        this.viewport.setWestPanel(this.drawActInstructPanel);  
    },    
    
    /* Load the satisfied with activity west panel */
    loadSatisfiedActivityPanel: function() {
    	if (!this.satisfiedActPanel) {
    		this.satisfiedActPanel = new gwst.widgets.SatisfiedActivityPanel();
            this.satisfiedActPanel.on('edit-act', this.startEditActivityStep, this);
            this.satisfiedActPanel.on('redraw-act', this.redrawActivity, this);
            this.satisfiedActPanel.on('save-act', this.finDrawActivityInstructStep, this);
        }
        this.viewport.setWestPanel(this.satisfiedActPanel);    
    },   

    redrawActivity: function() {
        this.mapPanel.removeLastFeature();
    	this.startDrawActivityInstructStep();
    },    
    
    redrawEditActivity: function() {
        this.disableFeatureEdit();
        if (this.alternateActivity) {
            this.redrawAltActivity();
        } else {
            this.redrawActivity();
        }
    },
    
    loadEditActivityPanel: function() {
        if (!this.editActPanel) {
            this.editActPanel = new gwst.widgets.EditActivityPanel();
            //When panel fires event saying it's all done, we want to process it and move on 
            this.editActPanel.on('redraw-edit-act', this.redrawEditActivity, this);
            this.editActPanel.on('save-edit-act', this.finEditActivityStep, this);
        }
        this.viewport.setWestPanel(this.editActPanel);
    },
    
    loadActivityInfo1Panel: function() {
        if (!this.activityInfo1Panel) {
            this.activityInfo1Panel = new gwst.widgets.ActivityInfo1Panel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.activityInfo1Panel.on('activity-info1-cont', this.finActivityInfoStep, this);
        }
        this.viewport.setWestPanel(this.activityInfo1Panel);    
    },
    
    loadActivityInfo2Panel: function() {
        if (!this.activityInfo2Panel) {
            this.activityInfo2Panel = new gwst.widgets.ActivityInfo2Panel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.activityInfo2Panel.on('activity-info2-cont', this.finActivityInfo2Step, this);
        }
        this.viewport.setWestPanel(this.activityInfo2Panel);    
    },
    
    loadActivityInfo3Panel: function() {
        if (!this.activityInfo3Panel) {
            this.activityInfo3Panel = new gwst.widgets.ActivityInfo3Panel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.activityInfo3Panel.on('activity-info3-cont', this.finActivityInfo3Step, this);
            // this.activityInfo3Panel.on('activity-info3-alt-cont', this.startActivityInfo4Step, this); //TODO: kill alt, branch based on answer
            this.activityInfo3Panel.on('activity-info3-alt-cont', this.finActivityInfo3Step, this);
        }
        this.viewport.setWestPanel(this.activityInfo3Panel);    
    },
    
    loadActivityInfo4Panel: function() {
        if (!this.activityInfo4Panel) {
            this.activityInfo4Panel = new gwst.widgets.ActivityInfo4Panel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.activityInfo4Panel.on('activity-info4-cont', this.loadSatisfiedAltActivityPanel, this);
        }
        this.viewport.setWestPanel(this.activityInfo4Panel);    
    },

    /* Load the satisfied with activity west panel */
    loadSatisfiedAltActivityPanel: function() {
    	if (!this.satisfiedAltActPanel) {
    		this.satisfiedAltActPanel = new gwst.widgets.SatisfiedAltActivityPanel();
            this.satisfiedAltActPanel.on('edit-act', this.startEditAltActivityStep, this);
            this.satisfiedAltActPanel.on('redraw-act', this.redrawAltActivity, this);
            this.satisfiedAltActPanel.on('save-act', this.saveAltActivity, this);
        }
        this.viewport.setWestPanel(this.satisfiedAltActPanel);    
    },    
    
    redrawAltActivity: function() {
        this.mapPanel.removeLastFeature();
    	this.loadActivityInfo4Panel();    
        this.loadAltPolyWin();    	
    },
    
    saveAltActivity: function() {
        this.finActivityInfo4Step();
        this.alternateActivity = false;
    },
    
    loadDrawNewAreaPanel: function() {
        if (!this.drawNewAreaPanel) {
            this.drawNewAreaPanel = new gwst.widgets.DrawNewAreaPanel();
            //When panel fires even saying it's all done, we want to process it and move on
            this.drawNewAreaPanel.on('draw-new', this.finDrawNewAreaStep, this);
        }
        this.viewport.setWestPanel(this.drawNewAreaPanel);    
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
    
    validateShape: function(feature) {    	
    	var config = {
            geometry: feature.geometry.toString(),
            survey_id: gwst.settings.interview_id
         }    	
        // alert("Validation not implemented yet (DrawManager.js - validateShape)");
        this.loadWait('Validating your shape');
    	// Ext.Ajax.request({
	        // url: gwst.settings.urls.shape_validate,        //TODO: activate this on validation
	        // method: 'POST',
	        // disableCachingParam: true,
	        // params: config,
	        // success: this.finValidateShape,
           	// failure: function(response, opts) {
        		//Change to error window
              	// this.hideWait();
              	// gwst.error.load('An error has occurred.  Please try again and notify us if it happens again.');
           	// },
            // scope: this
	    // });
        this.finValidateShape();            //TODO: Kill this when validation is implemented
        
    },

    /* Processes the result of validateShape */
    finValidateShape: function(response, opts) {
        this.hideWait();
        // var res_obj = Ext.decode(response.responseText);         //TODO: activate this on validation
        // var status_code = parseFloat(res_obj.status_code);
        // if (status_code == 0) {
        if (this.alternateActivity) {
            this.loadSatisfiedAltActivityPanel();
        } else {
        	this.loadSatisfiedActivityPanel();
        }
        // } else if (status_code > 0){
        	// this.startInvalidShapeStep(status_code);	
        // } else {
        	// gwst.error.load('An error has occurred while trying to validate your area.  Please try again and notify us if this keeps happening.');
        // }        
    },               

    saveNewRoute: function() {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.cur_feature.geometry.toString(),
            survey_id: gwst.settings.interview_id,
            type: 'route',
            factors: this.route_factors, //TODO: get factors list from form
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
    
    saveNewArea: function(bool_primary) {        
    	this.loadWait('Saving');

        if (bool_primary) {
            var data = {
                geometry: this.cur_feature.geometry.toString(),
                survey_id: gwst.settings.interview_id,
                type: 'act_area',
                primary_act: this.activity_1_primary, 
                duration: this.activity_1_duration, 
                rank: this.activity_1_rank, 
                factors: this.activity_factors, //TODO: get factors from form
                other_factor: this.activity_factors_other,
                alt_act: this.activity_3_alt
            };
            Ext.Ajax.request({
                url: gwst.settings.urls.shapes,
                method: 'POST',
                disableCachingParam: true,
                params: {feature: Ext.util.JSON.encode(data)},
                success: this.finSaveNewArea,
                failure: function(response, opts) {
                    // Change to error window
                    this.hideWait.defer(500, this);
                    gwst.error.load('An error has occurred while trying to save.');
                },
                scope: this
            });  
        } else {
            var data = {
                geometry: this.cur_feature.geometry.toString(),
                survey_id: gwst.settings.interview_id,
                type: 'alt_act_area',
                primary_act: this.activity_3_alt_act 
            };
            Ext.Ajax.request({
                url: gwst.settings.urls.shapes,
                method: 'POST',
                disableCachingParam: true,
                params: {feature: Ext.util.JSON.encode(data)},
                success: this.finSaveNewAltArea,
                failure: function(response, opts) {
                    // Change to error window
                    this.hideWait.defer(500, this);
                    gwst.error.load('An error has occurred while trying to save.');
                },
                scope: this
            });  
        }
    },     
    
    finSaveNewRoute: function(response) {
    	var new_feat = Ext.decode(response.responseText);    
    	this.hideWait.defer(500, this);
        this.startActivityInstructStep();
    },
    
    finSaveNewArea: function(response) {
    	var new_feat = Ext.decode(response.responseText);    
    	this.hideWait.defer(500, this);
        if (this.activity_3_alt == 'Engage in another recreational boating activity') {
            this.startActivityInfo4Step();
        } else {
            this.startDrawNewAreaStep();
        }
    },
    
    finSaveNewAltArea: function(response) {
    	var new_feat = Ext.decode(response.responseText);    
    	this.hideWait.defer(500, this);
        this.startDrawNewAreaStep();
    },
    
    /******************** Event handlers *******************/   

    newFeatureHandler: function(feature) {
        //track current feature for referencing later
    	this.cur_feature = feature;
    	if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.LineString') {
            this.hideAddRouteWin();
            this.hideCancelWin();
            this.hideMapTooltip();
            // this.validateShape(feature);
    		// return;
    	} else {
    		this.hideAddPolyWin();
    		this.hideCancelWin();
    		this.hideMapTooltip();
    		this.validateShape(feature);
    	}
    },
    
    pauseRoute: function() {
    	this.hideMapTooltip();
    	this.hideCancelWin();    	
        this.hideAddRouteWin(); 
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
    
    loadAddRouteTip: function() {
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
            style: 'opacity: 0.5; -moz-opacity: 0.5'
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
    }
});