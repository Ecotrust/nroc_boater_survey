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
	addMarkerWinOffset: [405, 8],
	addPolyWinOffset: [405, 8],
	cancelWinOffset: [535, 8],
	activityNum: 0,

    constructor: function(){
        gwst.DrawManager.superclass.constructor.call(this);
        this.mapPanelListeners = {
        		'render': this.mapPanelCreated.createDelegate(this)
        };        
    },          

    startInit: function() {
        this.loadViewport();
        this.createError();        
        this.startSplashStep();
    },
                    
    /********************** Survey steps ************************/

    /*load unfinished resource tool if there is one */
    startSplashStep: function() {
        this.loadSplash();
    },
    
    /* Finish splash and start resource selection */
    finSplashStep: function() {
    	this.startPointActivity();
    },
    
    
    /*load unfinished resource tool if there is one */
    startPointInstruction: function() {
        this.loadPointInstruction({'activity':this.getCurPointActivity().name});
    },
    
    /* Finish splash and start resource selection */
    finPointInstruction: function() {
    	this.startPointActivity();
    },
    
    startPolyInstruction: function() {
    	this.loadPolyInstruction({'activity':this.getCurPolyActivity().name});
    },
    
    finPolyInstruction: function() {
    	this.startPolyActivity();
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
		//Restart the current activity
		if (this.getCurActivity().draw_type == 'polygon') {
    		this.startPolyActivity();
    	} else {
    		this.startPointActivity();
    	}
    },    
    
    allFinished: function() {
    	window.location = return_url;
    },
    
    /******************** UI widget handlers ********************/   
    
    /* Load the initial splash screen for the user */
    loadSplash: function() {      	
        this.splashPanel = new gwst.widgets.SplashPanel();
        //When panel fires event saying it's all done, we want to process it and move on 
        this.splashPanel.on('splash-cont', this.finPointInstruction, this);
        this.viewport.setWestPanel(this.splashPanel);
    },    

    loadPointInstruction: function(config) {      	
    	if (!this.pointInstrPanel) {
	    	this.pointInstrPanel = new gwst.widgets.PointInstructionPanel(config);
	        //When panel fires event saying it's all done, we want to process it and move on 
	        this.pointInstrPanel.on('point-cont', this.finPointInstruction, this);
    		this.pointInstrPanel.on('skip-activity', this.skipPointActivity, this);	        
    	} else {
    		this.pointInstrPanel.update(config);
    	}
        this.viewport.setWestPanel(this.pointInstrPanel);  
    },        
    
    loadPolyInstruction: function(config) {      	
        if (!this.polyInstrPanel) {
        	this.polyInstrPanel = new gwst.widgets.PolyInstructionPanel(config);
        	//When panel fires event saying it's all done, we want to process it and move on 
        	this.polyInstrPanel.on('poly-cont', this.finPolyInstruction, this);
    		this.polyInstrPanel.on('skip-activity', this.skipPolyActivity, this);        	
        } else {
        	this.polyInstrPanel.update(config);
        }
        this.viewport.setWestPanel(this.polyInstrPanel);  
    },        
    
    /* Render viewport with main widgets to document body (right now) */
    loadViewport: function() {
        this.viewport = new gwst.widgets.MainViewport({
			mapPanelListeners: this.mapPanelListeners
		});
    },    
    
    loadPointPanel: function(config) {  
    	if (!this.pointPanel) {
    		this.pointPanel = new gwst.widgets.PointPanel(config);
    		this.pointPanel.on('city-selected', this.zoomToCity, this);
    		this.pointPanel.on('place-selected', this.zoomToPlacemark, this);
    		this.pointPanel.on('skip-activity', this.skipPointActivity, this);
    		this.pointPanel.on('next-activity', this.checkPointActivity, this);
    	} else {
    		this.pointPanel.update(config);
    	}
        this.viewport.setWestPanel(this.pointPanel);        
    },    

    loadPolyPanel: function(config) {  
    	if (!this.polyPanel) {
    		this.polyPanel = new gwst.widgets.PolyPanel(config);
    		this.polyPanel.on('city-selected', this.zoomToCity, this);
    		this.polyPanel.on('place-selected', this.zoomToPlacemark, this);
    		this.polyPanel.on('skip-activity', this.skipPolyActivity, this);
    		this.polyPanel.on('next-activity', this.checkPolyActivity, this);
    	} else {
    		this.polyPanel.update(config);
    	}
        this.viewport.setWestPanel(this.polyPanel); 
    },        
    
    loadAddMarkerWin: function() {
    	if (!this.addMarkerWin) {
			this.addMarkerWin = new gwst.widgets.AddMarkerWindow();
			this.addMarkerWin.on('add-marker-clicked', this.mapPanel.enablePointDraw, this.mapPanel);
			this.addMarkerWin.on('add-marker-clicked', this.loadAddMarkerTip, this);		
		}
		this.addMarkerWin.show();		
		this.addMarkerWin.alignTo(document.body, "tl-tl", this.addMarkerWinOffset);    	
    },
    
    hideAddMarkerWin: function() {
    	if (this.addMarkerWin) {
    		this.addMarkerWin.hide();
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
    
    hideAddPolyWin: function() {
    	if (this.addPolyWin) {
    		this.addPolyWin.hide();
    	}
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
    
    /* Load the satisfied with shape west panel */
    loadSatisfiedShapePanel: function() {
    	if (!this.satisfiedShapePanel) {
    		this.satisfiedShapePanel = new gwst.widgets.SatisfiedShapePanel({shape_name: this.getCurActivity().shape_name});
            //When panel fires event saying it's all done, we want to process it and move on 
            this.satisfiedShapePanel.on('satisfied', this.finSatisfiedShapeStep, this);            
        } else {
        	this.satisfiedShapePanel.updateText({shape_name: this.getCurActivity().shape_name});
        }
        this.viewport.setWestPanel(this.satisfiedShapePanel);    	
    },    
    
    finSatisfiedShapeStep: function(result) {
    	if (!result.satisfied) {
    		this.mapPanel.removeLastFeature();
    		//Restart the current activity
    		if (this.getCurActivity().draw_type == 'polygon') {
        		this.startPolyActivity();
        	} else {
        		this.startPointActivity();
        	}
    	} else {
    		this.saveNewFeature();
        }    	
    },

    /******************** Feature handling *****************/
    
    validateShape: function(feature) {    	
    	var config = {
            geometry: feature.geometry.toString(),
            activity_id: this.getCurActivity().id,
            user_id: user_id
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
        if (status_code == 0) {
        	this.loadSatisfiedShapePanel();
        } else if (status_code > 0){
        	this.startInvalidShapeStep(status_code);	
        } else {
        	gwst.error.load('An error has occurred while trying to validate your area.  Please try again and notify us if this keeps happening.');
        }        
    },               

    saveNewFeature: function() {        
    	this.loadWait('Saving');

        var data = {
            geometry: this.cur_feature.geometry.toString(),
            activity_id: this.getCurActivity().id,
            user_id: user_id
        };
        
    	Ext.Ajax.request({
	        url: gwst.settings.urls.shapes,
	        method: 'POST',
	        disableCachingParam: true,
	        params: {feature: Ext.util.JSON.encode(data)},
	        success: this.finSaveNewFeature,
           	failure: function(response, opts) {
        		//Change to error window
              	this.hideWait.defer(500, this);
              	gwst.error.load('An error has occurred while trying to save.');
           	},
            scope: this
	    });                	
    },     
    
    finSaveNewFeature: function(response) {
    	var new_feat = Ext.decode(response.responseText);
    	this.hideWait.defer(500, this);
    	    	
    	this.getCurActivity().num_saved += 1;
    	if (this.getCurActivity().draw_type == 'polygon') {
    		this.startPolyActivity();
    	} else {
    		this.startPointActivity()
    	}    	    	
    },    
    
    /******************** Event handlers *******************/    

    startPointActivity: function() {
    	if (point_activities.length > 0) {
    		if (!this.point_instruct_loaded) { 
    			this.startPointInstruction();
    			//Flag instruction so they don't get shown again next time through
    			this.point_instruct_loaded = true;
    		} else {
    			this.loadPointActivity();
    		}   
    	} else {
    		this.startPolyActivity();
    	}
    },

    goToNextPointActivity: function() {
    	this.cur_point_activity_index += 1;
    	this.cur_activity_num += 1;
    	if (this.cur_point_activity_index >= point_activities.length) {
    		this.startPolyActivity();
    	} else {
    		this.startPointActivity();
    	}
    },    
    
    /* Load the point activity panel */
    loadPointActivity: function() {    	
    	var cur_activity = this.getCurPointActivity();
    	this.loadPointPanel({
    		'activity':cur_activity.name,
    		'activity_num':this.cur_activity_num
    	});
    	this.loadAddMarkerWin();    	
    },

    getCurActivity: function() {
    	if (this.cur_activity_num > point_activities.length) {
    		return poly_activities[this.cur_poly_activity_index];
    	} else {
    		return point_activities[this.cur_point_activity_index];
    	}
    },
    
    getCurPointActivity: function() {
    	return point_activities[this.cur_point_activity_index];
    },    
    
    skipPointActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePointDraw();
    	this.hideAddMarkerWin();
    	//Save skip in database
    	//Reset instruction flag so they get shown again for the next activity
    	this.point_instruct_loaded = false;
    	this.goToNextPointActivity();
    },
    
    checkPointActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePointDraw();
    	if (this.getCurActivity().num_saved > 0) {
        	this.hideAddMarkerWin();    		
    		//Reset instruction flag so they get shown again for the next activity
    		this.point_instruct_loaded = false;
    		this.goToNextPointActivity();
    	} else {
    		gwst.error.load('You must add at least one marker first.');
    	}
    },    

    startPolyActivity: function() {
		if (poly_activities.length > 0) {
			if (!this.poly_instruct_loaded) { 
				this.startPolyInstruction();
				//Flag instruction so they don't get shown again next time through
				this.poly_instruct_loaded = true;
			} else {
				this.loadPolyActivity();
			}    		
		} else {
			window.location = return_url;	
		}
	},
	
    goToNextPolyActivity: function() {
    	this.cur_poly_activity_index += 1;
    	this.cur_activity_num += 1;    	
    	if (this.cur_poly_activity_index >= poly_activities.length) {
    		this.allFinished();    		
    	} else {
    		this.startPolyActivity();
    	}
    }, 	
    
    loadPolyActivity: function() {
    	var cur_activity = this.getCurPolyActivity();
    	this.loadPolyPanel({
    		'activity':cur_activity.name,
    		'activity_num':this.cur_activity_num
    	});
    	this.loadAddPolyWin();
    },        

    getCurPolyActivity: function() {
    	return poly_activities[this.cur_poly_activity_index];
    },    
    
    skipPolyActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePolyDraw();
    	this.hideAddPolyWin();
    	//Save skip in database
    	//Reset instruction flag so they get shown again for the next activity
    	this.poly_instruct_loaded = false;
    	this.goToNextPolyActivity();    	
    },        

    checkPolyActivity: function() {
    	this.hideMapTooltip();
    	this.mapPanel.disablePolyDraw();
    	if (this.getCurActivity().num_saved > 0) {
        	this.hideAddPolyWin();    		
    		//Reset instruction flag so they get shown again for the next activity
    		this.poly_instruct_loaded = false;
    		this.goToNextPolyActivity();
    	} else {
    		gwst.error.load('You must draw at least one area first.');
    	}
    },    
    
    newFeatureHandler: function(feature) {
    	this.cur_feature = feature;
    	//If user drew a point, skip straight to satisfied
    	if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point') {
    		this.hideAddMarkerWin();
    		this.loadSatisfiedShapePanel();
    		return;
    	} else {
    		this.hideAddPolyWin();
    		this.validateShape(feature);
    	}
    },
    
    /* 
     * Listen for map panel creation and then create hooks into it and setup 
     * additional map-related widgets 
     */
    mapPanelCreated: function() {
    	this.mapPanel = Ext.getCmp('mappanel');    	
    	this.mapPanel.on('vector-completed', this.hideMapTooltip, this);
    	this.mapPanel.on('vector-completed', this.newFeatureHandler, this);
    	this.mapPanel.on('vector-completed', this.hideCancelWin, this);
    	
    },    
    
    zoomToCity: function(city_rec) {
    	this.mapPanel.zoomToPoint(city_rec.get('feature'));
    },
    
    zoomToPlacemark: function(place_rec) {
    	this.mapPanel.zoomToPoint(place_rec.get('feature'));
    },
    
    /******************** UI Utility Functions ********************/    
    
    loadAddMarkerTip: function() {
    	this.loadMapTooltip('Now click on the map where the activity took place');
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
            html: text
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