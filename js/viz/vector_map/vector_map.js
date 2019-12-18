var _parseScalar = require('../core/utils').parseScalar,
    projectionModule = require('./projection.main'),
    controlBarModule = require('./control_bar'),
    gestureHandlerModule = require('./gesture_handler'),
    trackerModule = require('./tracker'),
    dataExchangerModule = require('./data_exchanger'),
    legendModule = require('./legend'),
    layoutModule = require('./layout'),
    mapLayerModule = require('./map_layer'),
    tooltipViewerModule = require('./tooltip_viewer'),

    DEFAULT_WIDTH = 800,
    DEFAULT_HEIGHT = 400,

    nextDataKey = 1,

    RE_STARTS_LAYERS = /^layers/,
    RE_ENDS_DATA_SOURCE = /\.dataSource$/;

require('./projection');

function generateDataKey() {
    return 'vectormap-data-' + nextDataKey++;
}

var dxVectorMap = require('../core/base_widget').inherit({
    _eventsMap: {
        'onClick': { name: 'click' },
        'onCenterChanged': { name: 'centerChanged' },
        'onZoomFactorChanged': { name: 'zoomFactorChanged' },
        'onHoverChanged': { name: 'hoverChanged' },
        'onSelectionChanged': { name: 'selectionChanged' }
    },

    _rootClassPrefix: 'dxm',

    _rootClass: 'dxm-vector-map',

    _themeSection: 'map',

    _fontFields: [
        'layer:area.label.font',
        'layer:marker:dot.label.font', 'layer:marker:bubble.label.font', 'layer:marker:pie.label.font', 'layer:marker:image.label.font',
        'legend.font', 'legend.title.font', 'legend.title.subtitle.font'
    ],

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
            notifyCounter = 0,
            preventProjectionEvents = true;

        that._notifyDirty = function() {
            that._resetIsReady();
            ++notifyCounter;
        };
        that._notifyReady = function() {
            preventProjectionEvents = false;
            if(--notifyCounter === 0) {
                that._drawn();
            }
        };
        that._dataExchanger = new dataExchangerModule.DataExchanger();

        // The `{ eventTrigger: that._eventTrigger }` object cannot be passed to the Projection because later backward option updating is going to be added.
        that._projection = new projectionModule.Projection({
            centerChanged: function(value) {
                if(!preventProjectionEvents) {
                    that._eventTrigger('centerChanged', { center: value });
                }
            },
            zoomChanged: function(value) {
                if(!preventProjectionEvents) {
                    that._eventTrigger('zoomFactorChanged', { zoomFactor: value });
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

    _change_RESUME_LAYOUT: function() {
        this._layoutControl.resume();
    },

    _initialChanges: ['PROJECTION', 'RESUME_LAYOUT', 'LAYOUT_INIT', 'BOUNDS', 'MAX_ZOOM_FACTOR', 'ZOOM_FACTOR', 'CENTER'],

    _layoutChangesOrder: ['RESUME_LAYOUT', 'LAYERS'],

    _initCore: function() {
        this._root = this._renderer.root.attr({ align: 'center', cursor: 'default' });
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
            centeringEnabled: !!_parseScalar(this._getOption('panningEnabled', true), true),
            zoomingEnabled: !!_parseScalar(this._getOption('zoomingEnabled', true), true)
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
                } else if(RE_ENDS_DATA_SOURCE.test(name)) {
                    this.option(name, null);
                }
            }
        }
    },

    _applyChanges: function() {
        this._notifyDirty();
        this.callBase.apply(this, arguments);
        this._notifyReady();
    },

    _optionChangesMap: {
        background: 'BACKGROUND',
        layers: 'LAYERS',
        controlBar: 'CONTROL_BAR',
        legends: 'LEGENDS',
        touchEnabled: 'TRACKER',
        wheelEnabled: 'TRACKER',
        panningEnabled: 'INTERACTION',
        zoomingEnabled: 'INTERACTION',
        projection: 'PROJECTION',
        bounds: 'BOUNDS',
        maxZoomFactor: 'MAX_ZOOM_FACTOR',
        zoomFactor: 'ZOOM_FACTOR',
        center: 'CENTER'
    },

    _optionChangesOrder: ['PROJECTION', 'BOUNDS', 'MAX_ZOOM_FACTOR', 'ZOOM_FACTOR', 'CENTER', 'BACKGROUND', 'CONTROL_BAR', 'LEGENDS', 'TRACKER', 'INTERACTION'],

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

    _themeDependentChanges: ['BACKGROUND', 'LAYERS', 'CONTROL_BAR', 'LEGENDS', 'TRACKER', 'INTERACTION'],

    _setProjection: function() {
        this._projection.setEngine(this.option('projection'));
    },

    _setBounds: function() {
        this._projection.setBounds(this.option('bounds'));
    },

    _setMaxZoom: function() {
        this._projection.setMaxZoom(this.option('maxZoomFactor'));
    },

    _setZoom: function() {
        this._projection.setZoom(this.option('zoomFactor'));
    },

    _setCenter: function() {
        this._projection.setCenter(this.option('center'));
    },

    _setBackgroundOptions: function() {
        this._layerCollection.setBackgroundOptions(this._getOption('background'));
    },

    _setLayerCollectionOptions: function() {
        this._layerCollection.setOptions(this.option('layers'));
    },

    _setControlBarOptions: function() {
        this._controlBar.setOptions(this._getOption('controlBar'));
    },

    _setLegendsOptions: function() {
        this._legendsControl.setOptions(this.option('legends'));
    },

    _setTrackerOptions: function() {
        this._tracker.setOptions({
            touchEnabled: this._getOption('touchEnabled', true),
            wheelEnabled: this._getOption('wheelEnabled', true)
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

require('../../core/component_registrator')('dxVectorMap', dxVectorMap);

module.exports = dxVectorMap;

///#DEBUG
module.exports._TESTS_resetDataKey = function() {
    nextDataKey = 1;
};
///#ENDDEBUG

// PLUGINS_SECTION
dxVectorMap.addPlugin(require('../core/export').plugin);
dxVectorMap.addPlugin(require('../core/title').plugin);
dxVectorMap.addPlugin(require('../core/tooltip').plugin);
dxVectorMap.addPlugin(require('../core/loading_indicator').plugin);
