Ext.namespace('gwst', 'gwst.widgets');

gwst.widgets.ResDrawMapPanel = Ext.extend(GeoExt.MapPanel, {
    //Default properties can defined here and overriden by config object passed to contructor
    
    defaultZoom: 7,
    defaultCenter: null,
	
    initComponent: function(){		
		//Map region
		var region = {
            e_bound: -7436602.79,
            n_bound: 5611382.66,
            s_bound: 4925283.89,
            w_bound: -8256007.73,
            name: 'Oregon Coast'
        };
		var map_extent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
	    var region_extent = new OpenLayers.Bounds(region.w_bound,region.s_bound,region.e_bound,region.n_bound);
        this.defaultCenter = region_extent.getCenterLonLat();
	    	    
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
        
        var hybridLayer = new OpenLayers.Layer.Google(
            "Satellite",
            {
                type: google.maps.MapTypeId.HYBRID, 
                sphericalMercator: true        ,
                isBaseLayer: true
            }
         );

        var nautLayer = new OpenLayers.Layer.TMS(
            "Nautical Charts",
            ["http://c3429629.r29.cf0.rackcdn.com/stache/NETiles_layer/"],
            // ["/media/tiles/"],
            {
                buffer: 1,
                'isBaseLayer': false,
                visibility: true,
                'sphericalMercator': true,
                getURL: function (bounds) {
                    var z = map.getZoom();
                    var url = this.url;
                    var path = 'blank.png' ;
                    if ( z <= 15 && z >= 0 ) {
                        var res = map.getResolution();
                        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                        var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
                        var limit = Math.pow(2, z);
                        var path = z + "/" + x + "/" + y + ".png";
                    }
                    tilepath = url + path;
                    return url + path;
                }
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
            "sketchmodified": this.vecModified,
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
		map.addControl(new OpenLayers.Control.Navigation({
            handleRightClicks: true
        }));
		map.addControl(new OpenLayers.Control.PanZoomBar());
		map.addControl(new OpenLayers.Control.MousePosition());
        var layerSwitcher = new OpenLayers.Control.LayerSwitcher();
		map.addControl(layerSwitcher);
		map.addControl(new OpenLayers.Control.ScaleLine());
        layerSwitcher.maximizeControl();
        map.addControl(new OpenLayers.Control.KeyboardDefaults()); 
        
        this.borderPanControl = new OpenLayers.Control.BorderPan();
        
        map.addControl(this.borderPanControl);

        //Line
        this.drawLineControl = new OpenLayers.Control.DrawFeature(
            	this.vectorLayer,
                OpenLayers.Handler.ResumablePath
        );        		
        this.drawLineControl.handler.pause = this.linePaused.createDelegate(this);

		map.addControl(this.drawLineControl);                
        
        this.drawPointControl = new OpenLayers.Control.DrawFeature(
            	this.vectorLayer,
                OpenLayers.Handler.Point
        );        		

		map.addControl(this.drawPointControl);                
        
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
		    layers: [hybridLayer, nautLayer, this.vectorLayer],
		    extent: map_extent,
	        center: region_extent.getCenterLonLat(),
	        zoom: this.defaultZoom,
	        cls: 'tip-target'
		});    		
		
        // Call parent (required)
		gwst.widgets.ResDrawMapPanel.superclass.initComponent.call(this);
    },

    linePaused: function() {
        this.getEl().mask();
        this.lineComps = this.drawLineControl.handler.line.geometry.components;
        this.tripDistance = this.lineComps[0].distanceTo(this.lineComps[this.lineComps.length -1]);
        //Trip distance is in meters (since we use mercator) - convert to miles:
        this.milesDistance = this.tripDistance * 0.000621371192;
        this.fireEvent('line-paused', this.milesDistance);
    },
    
    lineResume: function() {
        this.getEl().unmask();
    },
    
    lineFinish: function() {
        this.getEl().unmask();
        this.drawLineControl.handler.finishPath();
    },
    
    autoCompleteRoute: function() {
        this.getEl().unmask();
        this.cur_line = this.drawLineControl.handler.line.geometry;
        this.lineComps = this.cur_line.components;
        this.i = this.lineComps.length - 1;
        for (var j = 0; j <= this.i ; j++) {
            this.cur_line.addComponent(this.lineComps[this.i - j], this.i + j );
        }
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
    
    enableLineDraw: function() {
        this.drawLineControl.activate();
        this.borderPanControl.activate();
    },
    
    disableLineDraw: function() {
        this.drawLineControl.deactivate();
        this.borderPanControl.deactivate();
    },
    
    enablePointDraw: function () {
        this.drawPointControl.activate();
        this.borderPanControl.activate();
    },
    
    disablePointDraw: function() {
        this.drawPointControl.deactivate();
        this.borderPanControl.deactivate();
    },
    
    enablePolyDraw: function() {
        this.drawPolyControl.activate();
        this.borderPanControl.activate();
    },
    
    disablePolyDraw: function() {
    	this.drawPolyControl.deactivate();
        this.borderPanControl.deactivate();
    },        
    
    cancelPoly: function() {
    	this.disablePolyDraw();        
    	this.enablePolyDraw();        
    },
    
    cancelLine: function() {
        this.disableLineDraw();
        this.enableLineDraw();
    },

    resetMapView: function() {
        this.map.setCenter(this.defaultCenter);
        this.map.zoomTo(this.defaultZoom);
    }
});
 
// register xtype to allow for lazy initialization
Ext.reg('gwst-res-draw-map-panel', gwst.widgets.ResDrawMapPanel);