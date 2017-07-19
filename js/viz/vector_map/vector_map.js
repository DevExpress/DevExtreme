"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    _parseScalar = require("../core/utils").parseScalar,
    extend = require("../../core/utils/extend").extend,
    iteratorUtils = require("../../core/utils/iterator"),
    projectionModule = require("./projection.main"),
    controlBarModule = require("./control_bar"),
    gestureHandlerModule = require("./gesture_handler"),
    trackerModule = require("./tracker"),
    themeManagerModule = require("./theme_manager"),
    dataExchangerModule = require("./data_exchanger"),
    legendModule = require("./legend"),
    layoutModule = require("./layout"),
    mapLayerModule = require("./map_layer"),
    tooltipViewerModule = require("./tooltip_viewer"),
    _noop = noop,
    _extend = extend,

    DEFAULT_WIDTH = 800,
    DEFAULT_HEIGHT = 400,

    nextDataKey = 1,

    RE_STARTS_LAYERS = /^layers/,
    RE_ENDS_DATA_SOURCE = /\.(dataSource|data)$/;   // DEPRECATED_15_2 ("|data)")

require("./projection");

function generateDataKey() {
    return "vectormap-data-" + nextDataKey++;
}

var dxVectorMap = require("../core/base_widget").inherit({
    _eventsMap: {
        "onClick": { name: "click" },
        "onCenterChanged": { name: "centerChanged" },
        "onZoomFactorChanged": { name: "zoomFactorChanged" },
        // DEPRECATED_15_2
        "onAreaClick": { name: "areaClick" },
        // DEPRECATED_15_2
        "onAreaHoverChanged": { name: "areaHoverChanged" },
        // DEPRECATED_15_2
        "onAreaSelectionChanged": { name: "areaSelectionChanged" },
        // DEPRECATED_15_2
        "onMarkerClick": { name: "markerClick" },
        // DEPRECATED_15_2
        "onMarkerHoverChanged": { name: "markerHoverChanged" },
        // DEPRECATED_15_2
        "onMarkerSelectionChanged": { name: "markerSelectionChanged" },
        "onHoverChanged": { name: "hoverChanged" },
        "onSelectionChanged": { name: "selectionChanged" }
    },

    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        _extend(this._deprecatedOptions, {
            "areaSettings": { since: "15.2", message: "Use the 'layers' option instead" },
            "markerSettings": { since: "15.2", message: "Use the 'layers' option instead" },
            "mapData": { since: "15.2", message: "Use the 'layers' option instead" },
            "markers": { since: "15.2", message: "Use the 'layers' option instead" },
            "onAreaClick": { since: "15.2", message: "Use the 'onClick' option instead" },
            "onMarkerClick": { since: "15.2", message: "Use the 'onClick' option instead" },
            "onAreaHoverChanged": { since: "15.2", message: "Use the 'onHoverChanged' option instead" },
            "onMarkerHoverChanged": { since: "15.2", message: "Use the 'onHoverChanged' option instead" },
            "onAreaSelectionChanged": { since: "15.2", message: "Use the 'onSelectionChanged' option instead" },
            "onMarkerSelectionChanged": { since: "15.2", message: "Use the 'onSelectionChanged' option instead" },
            "layers.data": { since: "15.2", message: "Use the 'layers.dataSource' option instead" }
        });
    },

    _rootClassPrefix: "dxm",

    _rootClass: "dxm-vector-map",

    _createThemeManager: function() {
        return new themeManagerModule.ThemeManager();
    },

    _initLayerCollection: function(dataKey) {
        var that = this;
        that._layerCollection = new mapLayerModule.MapLayerCollection({
            renderer: that._renderer,
            projection: that._projection,
            themeManager: that._themeManager,
            tracker: that._tracker,
            dataKey: dataKey,
            eventTrigger: that._eventTrigger,
            dataExchanger: that._dataExchanger,
            tooltip: that._tooltip,
            notifyDirty: that._notifyDirty,
            notifyReady: that._notifyReady
        });
        // DEPRECATED_15_2
        if(that._options.layers === undefined && (that._options.mapData || that._options.markers)) {
            applyDeprecatedMode(that);
        } else {
            suspendLayersData(that._layerCollection, that._options.layers);
        }
    },

    _initLegendsControl: function() {
        var that = this;
        that._legendsControl = new legendModule.LegendsControl({
            renderer: that._renderer,
            container: that._root,
            layoutControl: that._layoutControl,
            themeManager: that._themeManager,
            dataExchanger: that._dataExchanger,
            notifyDirty: that._notifyDirty,
            notifyReady: that._notifyReady
        });
    },

    _initControlBar: function(dataKey) {
        var that = this;
        that._controlBar = new controlBarModule.ControlBar({
            renderer: that._renderer,
            container: that._root,
            layoutControl: that._layoutControl,
            projection: that._projection,
            tracker: that._tracker,
            dataKey: dataKey
        });
    },

    _initElements: function() {
        var that = this,
            dataKey = generateDataKey(),
            notifyCounter = 0;

        that._notifyDirty = function() {
            that._resetIsReady();
            ++notifyCounter;
        };
        that._notifyReady = function() {
            if(--notifyCounter === 0) {
                that._drawn();
            }
        };
        that._dataExchanger = new dataExchangerModule.DataExchanger();

        // The `{ eventTrigger: that._eventTrigger }` object cannot be passed to the Projection because later backward option updating is going to be added.
        that._projection = new projectionModule.Projection({
            centerChanged: function(value) {
                if(that._initialized) {
                    that._eventTrigger("centerChanged", { center: value });
                }
            },
            zoomChanged: function(value) {
                if(that._initialized) {
                    that._eventTrigger("zoomFactorChanged", { zoomFactor: value });
                }
            }
        });
        that._tracker = new trackerModule.Tracker({ root: that._root, projection: that._projection, dataKey: dataKey });
        that._gestureHandler = new gestureHandlerModule.GestureHandler({ projection: that._projection, renderer: that._renderer, tracker: that._tracker });
        that._layoutControl = new layoutModule.LayoutControl();
        that._layoutControl.suspend();

        that._initLayerCollection(dataKey);
        that._initControlBar(dataKey);
        that._initLegendsControl();
        that._tooltipViewer = new tooltipViewerModule.TooltipViewer({ tracker: that._tracker, tooltip: that._tooltip, layerCollection: that._layerCollection });
    },

    // There are already 2 cases!
    _init: function() {
        this.callBase.apply(this, arguments);
        this._afterInit();
        this._layoutControl.resume();
    },

    _initialChanges: ["PROJECTION", "BOUNDS", "MAX_ZOOM_FACTOR", "ZOOM_FACTOR", "CENTER"],

    _afterInit: function() {
        // This is a total shit but for now I haven't found a better way
        // The problem is that items can only be drawn when container size (after layout) is available
        resumeLayersData(this._layerCollection, this._options.layers, this._renderer);
    },

    _initCore: function() {
        this._root = this._renderer.root.attr({ align: "center", cursor: "default" });
        this._initElements();
    },

    _disposeCore: function() {
        var that = this;
        that._controlBar.dispose();
        that._gestureHandler.dispose();
        that._tracker.dispose();
        that._legendsControl.dispose();
        that._layerCollection.dispose();
        that._layoutControl.dispose();
        that._tooltipViewer.dispose();
        that._dataExchanger.dispose();
        that._projection.dispose();

        that._dataExchanger = that._gestureHandler = that._projection = that._tracker = that._layoutControl =
            that._root = that._layerCollection = that._controlBar = that._legendsControl = null;
    },

    _setupInteraction: function() {
        var options = {
            centeringEnabled: !!_parseScalar(this._getOption("panningEnabled", true), true),
            zoomingEnabled: !!_parseScalar(this._getOption("zoomingEnabled", true), true)
        };
        this._gestureHandler.setInteraction(options);
        this._controlBar.setInteraction(options);
    },

    _getDefaultSize: function() {
        return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
    },

    _applySize: function(rect) {
        var layout = { left: rect[0], top: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1], right: 0, bottom: 0 };
        this._projection.setSize(layout);
        this._layoutControl.setSize(layout);
        this._layerCollection.setRect([layout.left, layout.top, layout.width, layout.height]);
    },

    // The "layers_data", "mapData", "markers" options must never be merged (because of their meaning)
    // For "layers_data" there are special cases: "layers", "layers.data", "layers[i]", "layers[i].data"
    // Because of the cases (1) and (3) "option by reference" mechanism cannot be used -
    // so separate (for dxVectorMap only by now) mechanism is introduced - it handles all cases (including "option by reference")
    // T318992
    // Previously mechanism used the "_optionValuesEqual" method but after T318992 usage of "_optionValuesEqual" was stopped
    // and new (more meaningful) method was added - "_optionChanging"
    _optionChanging: function(name, currentValue, nextValue) {
        if(currentValue && nextValue) {
            if(RE_STARTS_LAYERS.test(name)) {
                if(currentValue.dataSource && nextValue.dataSource && currentValue !== nextValue) {
                    currentValue.dataSource = null;
                } else if(currentValue.data && nextValue.data && currentValue !== nextValue) {     // DEPRECATED_15_2
                    currentValue.data = null;
                } else if(RE_ENDS_DATA_SOURCE.test(name)) {
                    this.option(name, null);
                }
            }
            // DEPRECATED_15_2
            if(name === "mapData") {
                this._options.mapData = null;
            }
            // DEPRECATED_15_2
            if(name === "markers") {
                this._options.markers = null;
            }
        }
    },

    _applyChanges: function() {
        this._notifyDirty();
        this.callBase.apply(this, arguments);
        this._notifyReady();
    },

    _optionChangesMap: {
        background: "BACKGROUND",
        layers: "LAYERS",
        areaSettings: "LAYERS",       // DEPRECATED_15_2
        markerSettings: "LAYERS",     // DEPRECATED_15_2
        mapData: "LAYERS",            // DEPRECATED_15_2
        markers: "LAYERS",            // DEPRECATED_15_2
        controlBar: "CONTROL_BAR",
        legends: "LEGENDS",
        touchEnabled: "TRACKER",
        wheelEnabled: "TRACKER",
        panningEnabled: "INTERACTION",
        zoomingEnabled: "INTERACTION",
        projection: "PROJECTION",
        bounds: "BOUNDS",
        maxZoomFactor: "MAX_ZOOM_FACTOR",
        zoomFactor: "ZOOM_FACTOR",
        center: "CENTER"
    },

    _optionChangesOrder: ["PROJECTION", "BOUNDS", "MAX_ZOOM_FACTOR", "ZOOM_FACTOR", "CENTER", "BACKGROUND", "LAYERS", "CONTROL_BAR", "LEGENDS", "TRACKER", "INTERACTION"],

    _change_PROJECTION: function() {
        this._setProjection();
    },

    _change_BOUNDS: function() {
        this._setBounds();
    },

    _change_MAX_ZOOM_FACTOR: function() {
        this._setMaxZoom();
    },

    _change_ZOOM_FACTOR: function() {
        this._setZoom();
    },

    _change_CENTER: function() {
        this._setCenter();
    },

    _change_BACKGROUND: function() {
        this._setBackgroundOptions();
    },

    _change_LAYERS: function() {
        this._setLayerCollectionOptions();
    },

    _change_CONTROL_BAR: function() {
        this._setControlBarOptions();
    },

    _change_LEGENDS: function() {
        this._setLegendsOptions();
    },

    _change_TRACKER: function() {
        this._setTrackerOptions();
    },

    _change_INTERACTION: function() {
        this._setupInteraction();
    },

    _themeDependentChanges: ["BACKGROUND", "LAYERS", "CONTROL_BAR", "LEGENDS", "TRACKER", "INTERACTION"],

    _setProjection: function() {
        this._projection.setEngine(this.option("projection"));
    },

    _setBounds: function() {
        this._projection.setBounds(this.option("bounds"));
    },

    _setMaxZoom: function() {
        this._projection.setMaxZoom(this.option("maxZoomFactor"));
    },

    _setZoom: function() {
        this._projection.setZoom(this.option("zoomFactor"));
    },

    _setCenter: function() {
        this._projection.setCenter(this.option("center"));
    },

    _setBackgroundOptions: function() {
        this._layerCollection.setBackgroundOptions(this._getOption("background"));
    },

    _setLayerCollectionOptions: function() {
        this._layerCollection.setOptions(this.option("layers"));
    },

    _setControlBarOptions: function() {
        this._controlBar.setOptions(this._getOption("controlBar"));
    },

    _setLegendsOptions: function() {
        this._legendsControl.setOptions(this.option("legends"));
    },

    _setTrackerOptions: function() {
        this._tracker.setOptions({
            touchEnabled: this._getOption("touchEnabled", true),
            wheelEnabled: this._getOption("wheelEnabled", true)
        });
    },

    getLayers: function() {
        var layers = this._layerCollection.items(),
            list = [],
            i,
            ii = list.length = layers.length;
        for(i = 0; i < ii; ++i) {
            list[i] = layers[i].proxy;
        }
        return list;
    },

    getLayerByIndex: function(index) {
        var layer = this._layerCollection.byIndex(index);
        return layer ? layer.proxy : null;
    },

    getLayerByName: function(name) {
        var layer = this._layerCollection.byName(name);
        return layer ? layer.proxy : null;
    },

    clearSelection: function(_noEvent) {
        var layers = this._layerCollection.items(),
            i,
            ii = layers.length;
        for(i = 0; i < ii; ++i) {
            layers[i].clearSelection(_noEvent);
        }
        return this;
    },

    // DEPRECATED_15_2
    getAreas: _noop,

    // DEPRECATED_15_2
    getMarkers: _noop,

    // DEPRECATED_15_2
    clearAreaSelection: _noop,

    // DEPRECATED_15_2
    clearMarkerSelection: _noop,

    center: function(value) {
        var that = this;
        if(value === undefined) {
            return that._projection.getCenter();
        } else {
            that._projection.setCenter(value);
            return that;
        }
    },

    zoomFactor: function(value) {
        var that = this;
        if(value === undefined) {
            return that._projection.getZoom();
        } else {
            that._projection.setZoom(value);
            return that;
        }
    },

    viewport: function(value) {
        var that = this;
        if(value === undefined) {
            return that._projection.getViewport();
        } else {
            that._projection.setViewport(value);
            return that;
        }
    },

    convertCoordinates: function(coordinates) {
        coordinates = coordinates && coordinates.length ? coordinates : [arguments[0], arguments[1]];
        return this._projection.fromScreenPoint(coordinates);
    }
});

function suspendLayersData(layerCollection, options) {
    if(options) {
        layerCollection.__data = options.length ? iteratorUtils.map(options, patch) : patch(options);
    }
    function patch(ops) {
        var result = {};
        swapData(ops || {}, result);
        return result;
    }
}

function resumeLayersData(layerCollection, options, renderer) {
    var data = layerCollection.__data;
    if(data) {
        layerCollection.__data = undefined;
        if(data.length) {
            iteratorUtils.each(data, function(i, item) {
                swapData(item, options[i]);
            });
        } else {
            swapData(data, options);
        }
        renderer.lock();
        layerCollection.setOptions(options);
        renderer.unlock();
    }
}

// DEPRECATED_15_2
function swapData(source, target) {
    var name = !("dataSource" in source) && ("data" in source) ? "data" : "dataSource";
    target[name] = source[name];
    source[name] = undefined;
}

// DEPRECATED_15_2
function applyDeprecatedMode(map) {
    var log = require("../../core/errors").log,
        mapData = map._options.mapData,
        markers = map._options.markers;
    map._options.mapData = map._options.markers = undefined;
    map._afterInit = function() {
        this._options.mapData = mapData;
        this._options.markers = markers;
        this._renderer.lock();
        this._setLayerCollectionOptions();
        this._renderer.unlock();
        mapData = markers = undefined;
    };
    map._setLayerCollectionOptions = function() {
        var options = this._options,
            mapData = options.mapData,
            markers = options.markers;
        mapData = mapData && mapData.features ? _extend({}, mapData) : mapData;
        markers = markers && markers.features ? _extend({}, markers) : markers;
        this._layerCollection.setOptions([
            _extend({}, options.areaSettings, { name: "areas", _deprecated: true, dataSource: mapData, type: "area" }),
            _extend({}, options.markerSettings, { name: "markers", _deprecated: true, dataSource: markers, type: "marker", elementType: options.markerSettings && options.markerSettings.type })
        ]);
    };
    map.getAreas = function() {
        log("W0002", this.NAME, "getAreas", "15.2", "Use the 'getLayerByName('areas').getElements()' instead");
        return this.getLayerByName("areas").getElements();
    };
    map.getMarkers = function() {
        log("W0002", this.NAME, "getMarkers", "15.2", "Use the 'getLayerByName('markers').getElements()' instead");
        return this.getLayerByName("markers").getElements();
    };
    map.clearAreaSelection = function(_noEvent) {
        log("W0002", this.NAME, "clearAreaSelection", "15.2", "Use the 'getLayerByName('areas').clearSelection()' instead");
        this.getLayerByName("areas").clearSelection(_noEvent);
        return this;
    };
    map.clearMarkerSelection = function(_noEvent) {
        log("W0002", this.NAME, "clearMarkerSelection", "15.2", "Use the 'getLayerByName('markers').clearSelection()' instead");
        this.getLayerByName("markers").clearSelection(_noEvent);
        return this;
    };
    var clickMap = { areas: "areaClick", markers: "markerClick" },
        hoverChangedMap = { areas: "areaHoverChanged", markers: "markerHoverChanged" },
        selectionChangedMap = { areas: "areaSelectionChanged", markers: "markerSelectionChanged" };
    map.on("click", function(e) {
        if(e.target) {
            this._eventTrigger(clickMap[e.target.layer.name], e);
        }
    });
    map.on("hoverChanged", function(e) {
        if(e.target) {
            this._eventTrigger(hoverChangedMap[e.target.layer.name], e);
        }
    });
    map.on("selectionChanged", function(e) {
        if(e.target) {
            this._eventTrigger(selectionChangedMap[e.target.layer.name], e);
        }
    });
}

require("../../core/component_registrator")("dxVectorMap", dxVectorMap);

module.exports = dxVectorMap;

///#DEBUG
module.exports._TESTS_resetDataKey = function() {
    nextDataKey = 1;
};
///#ENDDEBUG

// PLUGINS_SECTION
dxVectorMap.addPlugin(require("../core/export").plugin);
dxVectorMap.addPlugin(require("../core/title").plugin);
dxVectorMap.addPlugin(require("../core/tooltip").plugin);
dxVectorMap.addPlugin(require("../core/loading_indicator").plugin);
