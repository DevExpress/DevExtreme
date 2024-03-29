const $ = require('jquery');
const vizMocks = require('../../../helpers/vizMocks.js');
const dxVectorMapUtils = require('viz/vector_map/vector_map.utils');

const projectionModule = require('viz/vector_map/projection.main');
const controlBarModule = require('viz/vector_map/control_bar/control_bar');
const gestureHandlerModule = require('viz/vector_map/gesture_handler');
const trackerModule = require('viz/vector_map/tracker');
const themeManagerModule = require('viz/core/base_theme_manager');
const dataExchangerModule = require('viz/vector_map/data_exchanger');
const legendModule = require('viz/vector_map/legend');
const layoutModule = require('viz/vector_map/layout');
const mapLayerModule = require('viz/vector_map/map_layer');
const tooltipViewerModule = require('viz/vector_map/tooltip_viewer');

const StubProjection = vizMocks.stubClass(projectionModule.Projection);
const StubControlBar = vizMocks.stubClass(controlBarModule.ControlBar);
const StubGestureHandler = vizMocks.stubClass(gestureHandlerModule.GestureHandler);
const StubTracker = vizMocks.stubClass(trackerModule.Tracker);
const StubThemeManager = vizMocks.stubClass(themeManagerModule.BaseThemeManager);
const StubDataExchanger = vizMocks.stubClass(dataExchangerModule.DataExchanger);
const StubLegendsControl = vizMocks.stubClass(legendModule.LegendsControl);
const StubLayoutControl = vizMocks.stubClass(layoutModule.LayoutControl);
const StubMapLayerCollection = vizMocks.stubClass(mapLayerModule.MapLayerCollection);
const StubTooltipViewer = vizMocks.stubClass(tooltipViewerModule.TooltipViewer);

const rendererModule = require('viz/core/renderers/renderer');
const titleModule = require('viz/core/title');
const exportModule = require('viz/core/export');
const tooltipModule = require('viz/core/tooltip');
const { implementationsMap } = require('core/utils/size');

require('viz/vector_map');

const StubExportMenu = vizMocks.stubClass(exportModule.ExportMenu);

function returnValue(value) {
    return function() { return value; };
}
exports.returnValue = returnValue;

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

function stubComponentConstructors(test) {
    rendererModule.Renderer = returnValue(test.renderer);
    // $.extend(DevExpress.viz, {
    //     LoadingIndicator: returnValue(test.loadingIndicator)
    // });
    titleModule.DEBUG_set_title(returnValue(test.title));
    tooltipModule.DEBUG_set_tooltip(returnValue(test.tooltip));
    exportModule.DEBUG_set_ExportMenu(returnValue(test.exportMenu));

    projectionModule.Projection = returnValue(test.projection);
    controlBarModule.ControlBar = returnValue(test.controlBar);
    gestureHandlerModule.GestureHandler = returnValue(test.gestureHandler);
    trackerModule.Tracker = returnValue(test.tracker);
    themeManagerModule.BaseThemeManager = returnValue(test.themeManager);
    dataExchangerModule.DataExchanger = returnValue(test.dataExchanger);
    legendModule.LegendsControl = returnValue(test.legendsControl);
    layoutModule.LayoutControl = returnValue(test.layoutControl);
    mapLayerModule.MapLayerCollection = returnValue(test.layerCollection);
    tooltipViewerModule.TooltipViewer = returnValue(test.tooltipViewer);
}
exports.stubComponentConstructors = stubComponentConstructors;

exports.environment = {
    beforeEach: function() {
        dxVectorMapUtils._TESTS_resetDataKey();
        this.$container = $('<div id="test-container"></div>');
        this.renderer = new vizMocks.Renderer();
        this.themeManager = new StubThemeManager();
        this.themeManager.stub('theme').returns({});
        this.dataExchanger = new StubDataExchanger();
        this.gestureHandler = new StubGestureHandler();
        this.projection = new StubProjection();
        this.layoutControl = new StubLayoutControl();
        this.tracker = new StubTracker();
        this.layerCollection = new StubMapLayerCollection();
        this.controlBar = new StubControlBar();
        this.legendsControl = new StubLegendsControl();
        this.tooltipViewer = new StubTooltipViewer();
        this.loadingIndicator = new vizMocks.LoadingIndicator();
        this.title = new vizMocks.Title();
        this.exportMenu = new StubExportMenu();
        this.tooltip = new vizMocks.Tooltip();
        this._$fn_width = implementationsMap.getWidth;
        this._$fn_height = implementationsMap.getHeight;
        implementationsMap.getWidth = returnValue(400);
        implementationsMap.getHeight = returnValue(300);
        stubComponentConstructors(this);
    },

    afterEach: function() {
        this.$container.remove(); //  To invoke Component disposing mechanism
        implementationsMap.getWidth = this._$fn_width;
        implementationsMap.getHeight = this._$fn_height;
    },

    createMap: function(options) {
        this.map = this.$container.dxVectorMap(options).dxVectorMap('instance');
        return this.map;
    }
};
