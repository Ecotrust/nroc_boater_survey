/**
* @requires OpenLayers/Layer/Grid.js
* @requires OpenLayers/Layer/Image.js
 */

/** 
 * Class: OpenLayers.Layer.GeoWebCache
 * Create a layer to read from a GeoWebCache tile cache (without running
 *     GeoWebCache).
 * 
 * Examples:
 *
 * Create a new layer based on a cache in geographic coordinates.
 * (code)
 *     var layer = new OpenLayers.Layer.GeoWebCache({
 *         url: "http://example.com/mylayer/"
 *     });
 * (end)
 *
 * Create a layer in geographic coordinates with a custom tile origin.
 * (code)
 *     var layer = new OpenLayers.Layer.GeoWebCache({
 *         url: "http://example.com/mylayer/",
 *         gridBounds: new OpenLayers.Bounds(-100, 45, 80, 90)
 *     });
 * (end)
 * 
 * Inherits from: 
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.GeoWebCache = OpenLayers.Class(OpenLayers.Layer.Grid, {
    
    /**
     * APIProperty: isBaseLayer
     * Default is true, as this is designed to be a base tile source. 
     */
    isBaseLayer: true,

    /**
     * APIProperty: url
     * {String | Array} The base URL for the layer cache.  If your tiles can
     *     be accessed at "http://example.com/mylayer/EPSG_900913_04/0_1/01_10.png"
     *     this value would be "http://example.com/mylayer/" (with trailing slash).
     *     You can also provide a list of URL strings for the layer if your
     *     cache is available from multiple origins.  This must be set before
     *     the layer is drawn.
     */
    url: null,
    
    /**
     * APIProperty: gridBounds
     * {<OpenLayers.Bounds>} The gridBounds from your GeoWebCache configuration.
     * If not provided, the <maxExtent> of this layer will be used.
     */
    gridBounds: null,
    
    /**
     * APIProperty: type
     * {String} Image type for the layer.  This becomes the filename extension
     *     in tile requests.  Default is "png" (generating a url like
     *     "http://example.com/mylayer/EPSG_900913_04/0_1/01_10.png").
     */
    type: "png",
    
    /**
     * APIProperty: params
     * {Object} An optional object with members representing query string
     *     parameters to be appended to tile requests.  By default, no query
     *     string is appended (params is null).  If a params object is provided,
     *     all property name/value pairs will be URI component encoded in the
     *     query string for each tile.  Call mergeNewParams to update the
     *     params object after layer construction.
     */
    params: null,

    /**
     * APIProperty: zoomOffset
     * {Number} If your cache has more zoom levels than you want to provide
     *     access to with this layer, supply a zoomOffset.  This zoom offset
     *     is added to the current map zoom level to determine the level
     *     for a requested tile.  For example, if you supply a zoomOffset
     *     of 3, when the map is at the zoom 0, tiles will be requested from
     *     level 3 of your cache.  Default is 0 (assumes cache level and map
     *     zoom are equivalent).
     */
    zoomOffset: 0,
    
    /**
     * APIProperty: gridSetId
     * {String} If no gridSetId is provided, the layer's projection id will be
     * used (replacing ":" with "_").  If your tiles can be accessed at a URL
     * like "http://example.com/mylayer/EPSG_900913_04/0_1/01_10.png", and the
     * layer projection id is "EPSG:900913", the gridSetId will be correctly
     * derived.  If this default is not correct, specify the gridSetId.
     */
    gridSetId: null,
    
    /**
     * APIProperty: name
     * {String} The layer title (for display in UI components like a layer
     *     switcher.)
     */
    name: "",
    
    /**
     * Constructor: OpenLayers.Layer.GeoWebCache
     * Create a new layer for displaying tiles from an ArcGIS tile cache.
     *
     * Parameters:
     * options - {Object} Properties to be set on the layer.  Any of the layer
     *     properties may be set by including members in this object.  The <url>
     *     property is the only required property.
     */
    initialize: function(options) {
        var args = [options.name, options.url, {}, options];
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, args);
        
        if (options && options.params) {
            this.params = OpenLayers.Util.extend({}, options.params);
        } else {
            this.params = null;
        }
    },
    
    /* Method: setMap
     * When the layer is added to a map, then we can fetch our gridBounds 
     *    (if we don't have one). 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.gridBounds) { 
            this.gridBounds = this.maxExtent.clone();
        }                                       
    },

    /**
     * Method: zeroPad
     * Create a zero padded string optionally with a radix for casting numbers.
     *
     * Parameters:
     * num - {Number} The number to be zero padded.
     * len - {Number} The length of the string to be returned.
     * radix - {Number} An integer between 2 and 36 specifying the base to use
     *     for representing numeric values.
     */
    zeroPad: function(num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    },

    
    /**
     * Method: getUrl
     * Determine the URL for a tile given the tile bounds.  This is a generous
     *     algorithm that determines the row and column numbers given the center
     *     of the tile bounds.  This allows for some imprecision in the
     *     <gridBounds> and resolution based calculations.
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {String} The URL for a tile based on given bounds.
     */
    getURL: function(bounds) {
        
        // use tile center to avoid precision issues at tile edges
        var center = bounds.getCenterLonLat();        
        var res = this.map.getResolution();

        // x is column index counting in the positive x direction from grid origin (lower left)
        var x = Math.floor((center.lon - this.gridBounds.left) / (res * this.tileSize.h));
        
        // y is row index counting in the positive y direction from the grid origin (lower left)
        var y = Math.floor((center.lat - this.gridBounds.bottom) / (res * this.tileSize.w));

        var z = this.zoomOffset + this.map.getZoom();

        var shift = z / 2 | 0;
        var half = Math.pow(2, shift + 1);
        var digits = 1;
        if (half > 10) {
            digits = ((Math.log(half) / Math.LN10).toFixed(14) | 0) + 1;
        }
        var halfX = x / half | 0;
        var halfY = y / half | 0;
        
        var path = [
            (this.gridSetId || this.projection.projCode.replace(":", "_")) + "_" + this.zeroPad(z, 2),
            this.zeroPad(halfX, digits) + "_" + this.zeroPad(halfY, digits),
            this.zeroPad(x, 2 * digits) + "_" + this.zeroPad(y, 2 * digits) + "." + this.type            
        ].join("/");
        
        var url = this.url;
        if (url instanceof Array) {
            url = this.selectUrl(path, url);
        }
        
        // optionally append a query string based on params
        var query = "";
        if (this.params) {
            query = "?" + OpenLayers.Util.getParameterString(this.params);
        }

        var base = url.replace(/\/$/, "") + "/";
        return base + path + query; 
    },
    
    /**
     * Method: addTile
     * Create a tile to be added to the layer container. 
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     * 
     * Returns:
     * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
     */
    addTile: function(bounds, position) {
        return new OpenLayers.Tile.Image(
            this, position, bounds, null, this.tileSize
        );
    },
     
    /**
     * APIMethod: clone
     * Create a copy of this layer.
     *
     * Returns:
     * {<OpenLayers.Layer.GeoWebCache>} A new layer with the same properties
     *     as this one.
     */
    clone: function(obj) {
        // this allows subclasses to apply this method with impunity
        if (!obj) {
            var options = OpenLayers.Util.extend({}, this.options);
            obj = new OpenLayers.Layer.GeoWebCache(options);
        }
        return OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
    },

    CLASS_NAME: "OpenLayers.Layer.GeoWebCache"
});
