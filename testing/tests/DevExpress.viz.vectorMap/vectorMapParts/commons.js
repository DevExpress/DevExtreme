var $ = require('jquery'),
    renderer = require('core/renderer'),
    vizMocks = require('../../../helpers/vizMocks.js'),
    dxVectorMapModule = require('viz/vector_map/vector_map'),

    projectionModule = require('viz/vector_map/projection.main'),
    controlBarModule = require('viz/vector_map/control_bar'),
    gestureHandlerModule = require('viz/vector_map/gesture_handler'),
    trackerModule = require('viz/vector_map/tracker'),
    themeManagerModule = require('viz/core/base_theme_manager'),
    dataExchangerModule = require('viz/vector_map/data_exchanger'),
    legendModule = require('viz/vector_map/legend'),
    layoutModule = require('viz/vector_map/layout'),
    mapLayerModule = require('viz/vector_map/map_layer'),
    tooltipViewerModule = require('viz/vector_map/tooltip_viewer'),

    StubProjection = vizMocks.stubClass(projectionModule.Projection),
    StubControlBar = vizMocks.stubClass(controlBarModule.ControlBar),
    StubGestureHandler = vizMocks.stubClass(gestureHandlerModule.GestureHandler),
    StubTracker = vizMocks.stubClass(trackerModule.Tracker),
    StubThemeManager = vizMocks.stubClass(themeManagerModule.BaseThemeManager),
    StubDataExchanger = vizMocks.stubClass(dataExchangerModule.DataExchanger),
    StubLegendsControl = vizMocks.stubClass(legendModule.LegendsControl),
    StubLayoutControl = vizMocks.stubClass(layoutModule.LayoutControl),
    StubMapLayerCollection = vizMocks.stubClass(mapLayerModule.MapLayerCollection),
    StubTooltipViewer = vizMocks.stubClass(tooltipViewerModule.TooltipViewer),

    rendererModule = require('viz/core/renderers/renderer'),
    titleModule = require('viz/core/title'),
    exportModule = require('viz/core/export'),
    tooltipModule = require('viz/core/tooltip'),

    StubExportMenu = vizMocks.stubClass(exportModule.ExportMenu);

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
    titleModule.Title = returnValue(test.title);
    tooltipModule.Tooltip = returnValue(test.tooltip);
    exportModule.ExportMenu = returnValue(test.exportMenu);

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
        dxVectorMapModule._TESTS_resetDataKey();
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
        this._$fn_width = renderer.fn.width;
        this._$fn_height = renderer.fn.height;
        renderer.fn.width = returnValue(400);
        renderer.fn.height = returnValue(300);
        stubComponentConstructors(this);
    },

    afterEach: function() {
        this.$container.remove(); //  To invoke Component disposing mechanism
        renderer.fn.width = this._$fn_width;
        renderer.fn.height = this._$fn_height;
    },

    createMap: function(options) {
        this.map = this.$container.dxVectorMap(options).dxVectorMap('instance');
        return this.map;
    }
};
