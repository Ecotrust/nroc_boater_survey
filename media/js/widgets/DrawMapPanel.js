Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
	
    initComponent: function(){		
		//Map region
		var region = {
            e_bound: -7670000,
            n_bound: 5380000,
            s_bound: 4980000,
            w_bound: -8110000,
            name: 'Oregon Coast'
        };
		var map_extent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
	    var region_extent = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound)
	    	    
	    //Map base options
        var map_options = {
			controls: [],
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            units: "m",
            numZoomLevels: 18,
            maxResolution: 156543.0339,
            maxExtent: map_extent
        };        

            var defaultStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                fillColor: "#ee9900",
                fillOpacity: 0.4,                
                strokeColor: "#ff6600",
                strokeWidth: 2                
            }, OpenLayers.Feature.Vector.style["default"]));
            
            var selectStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                fillColor: 'blue',
                fillOpacity: 0.4, 
                strokeColor: 'blue',
                strokeWidth: 2                                
            }, OpenLayers.Feature.Vector.style["select"]));

            var tempStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                fillColor: "#ee9900",
                fillOpacity: 0.4,                                
                strokeColor: "#ff6600",
                strokeWidth: 2                                
            }, OpenLayers.Feature.Vector.style["temporary"]));

        var myStyle = new OpenLayers.StyleMap({
            'default': defaultStyle,
            'select': selectStyle,
            'temporary': tempStyle
        }); 
        
	    //Map base layers
        var hybridLayer = new OpenLayers.Layer.Google(
            "Satellite",
            {
            	type: G_HYBRID_MAP, 
            	sphericalMercator: true
            }
        );             

        var physicalLayer = new OpenLayers.Layer.Google(
            "Terrain",
            {
            	type: G_PHYSICAL_MAP, 
            	sphericalMercator: true
            }
        );     
        
        var nautLayer = new OpenLayers.Layer.WMS(
            "Nautical Charts", "http://map-dev.maboatersurvey.com:8080/geoserver/wms", 
            {
                layers: 'rbsw:13006_1',
                styles: '',
                srs: 'EPSG:900913',
                format: 'image/jpeg',
                transparent: 'True'
            },{
                'isBaseLayer': true,
                'visibility': false
            }
        ); 
        
        var rampLayer = new OpenLayers.Layer.WMS(
            "Boat Ramps", "http://map-dev.maboatersurvey.com:8080/geoserver/wms", 
            {
                layers: 'rbsw:massgis_ofba_Coastal',
                styles: '',
                srs: 'EPSG:900913',
                format: 'image/jpeg',
                transparent: 'True'
            },{
                'isBaseLayer': false,
                'visibility': false
            }
        ); 
        
        this.vectorLayer = new OpenLayers.Layer.Vector(
    		"Vector Layer", 
    		{
    		    displayInLayerSwitcher: false,
    		    styleMap: myStyle
    		}
        );        
        this.vectorLayer.events.on({
            "sketchstarted": this.vecStarted,
            "skethmodified": this.vecModified,
            "sketchcomplete": this.vecComplete,
            scope: this
        });        
        
		//Required: Create div element for OL map before constructing it.  OL really wants you to tell
        //it what it's div is in the constructor.  If you let Ext create it's own div element at render time
        //OL won't know where it is.  This is fine usually except the Google base map doesn't work properly in
        //Safari in this case, it won't let you draw vectors.
		Ext.DomHelper.append(document.body, [{
			id: 'the-map',
			tag: 'div'
		}]);        
        
        //Create the map and dump everything in
	    map = new OpenLayers.Map('the-map', map_options);
		map.addControl(new OpenLayers.Control.Navigation());		
		map.addControl(new OpenLayers.Control.PanZoomBar());
		map.addControl(new OpenLayers.Control.MousePosition());
		var layerSwitcher = new OpenLayers.Control.LayerSwitcher();
		map.addControl(layerSwitcher);
		layerSwitcher.maximizeControl();				
        
        //Line
        this.drawLineControl = new OpenLayers.Control.DrawFeature(
            	this.vectorLayer,
                OpenLayers.Handler.ResumablePath
        );        		
        this.drawLineControl.handler.pause = this.linePaused.createDelegate(this);

		map.addControl(this.drawLineControl);                
        
        this.modifyControl = new OpenLayers.Control.ModifyFeature(this.vectorLayer);
        map.addControl(this.modifyControl);
        
        //Polygon 
        this.drawPolyControl = new OpenLayers.Control.DrawFeature(
           	this.vectorLayer,
               OpenLayers.Handler.Polygon
        );        		
		map.addControl(this.drawPolyControl);                		
		
        //Update internal MapPanel properties
		Ext.apply(this, {
		    map: map,
		    layers: [hybridLayer, physicalLayer, nautLayer, rampLayer, this.vectorLayer],
		    extent: map_extent,
	        center: region_extent.getCenterLonLat(),
	        zoom: 8,
	        cls: 'tip-target'
		});    		
		
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },

    linePaused: function() {
        this.getEl().mask();
        this.fireEvent('line-paused');
    },
    
    lineResume: function() {
        this.getEl().unmask();
    },
    
    lineFinish: function() {
        this.getEl().unmask();
        this.drawLineControl.handler.finishPath();
    },

    vecStarted: function(evt) {
    	this.fireEvent('vector-started', evt);
    },
    
    vecModified: function(evt) {
    	this.fireEvent('vector-modified', evt);
    },
    
    vecComplete: function(evt) {
    	this.fireEvent('vector-completed', evt.feature);
    	this.curFeature = evt.feature;
    	// this.disablePointDraw();
        this.disableLineDraw();
    	this.disablePolyDraw();
    },
    
    modifyFeature: function(feature) {
        this.modifyControl.activate();
        this.modifyControl.selectControl.select(feature);
    },
    
    finModifyFeature: function() {
        this.modifyControl.deactivate();
    },
    
    removeLastFeature: function() {
    	this.vectorLayer.removeFeatures([this.curFeature]);
    },    
    
//    onPopupClose: function(evt) {
//        selectControl.unselect(selectedFeature);
//    },
    
//    onFeatureSelect: function(feature) {
//        selectedFeature = feature;
//        popup = new OpenLayers.Popup.FramedCloud("chicken", 
//                                 feature.geometry.getBounds().getCenterLonLat(),
//                                 null,
//                                 "<div style='font-size:.8em'><a href='#'>Delete</a></div>",
//                                 null, true, this.onPopupClose);
//        feature.popup = popup;
//        map.addPopup(popup);
//    },
    
//    onFeatureUnselect: function(feature) {
//        map.removePopup(feature.popup);
//        feature.popup.destroy();
//        feature.popup = null;
//    },
    
    // enablePointDraw: function() {
   	// this.selectControl.unselectAll();
        // this.drawPointControl.activate();        
    // },
    
    // disablePointDraw: function() {
    	// this.drawPointControl.deactivate();
    // },
    
    enableLineDraw: function() {
        this.drawLineControl.activate();
    },
    
    disableLineDraw: function() {
        this.drawLineControl.deactivate();
    },
    
    enablePolyDraw: function() {
//    	this.selectControl.unselectAll();
        this.drawPolyControl.activate();        
    },
    
    disablePolyDraw: function() {
    	this.drawPolyControl.deactivate();
    },    
    
    // zoomToPoint: function(pnt) {
    	// var lonlat = new OpenLayers.LonLat(pnt.geometry.x, pnt.geometry.y);
    	// this.map.setCenter(lonlat, 8);
    // },
    
    cancelPoly: function() {
    	this.disablePolyDraw();        
    },
    
    cancelLine: function() {
        this.disableLineDraw();
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-draw-map-panel', gwst.widgets.ResDrawMapPanel);