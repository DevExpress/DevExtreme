import $ from 'jquery';
import {
    stubClass,
    forceThemeOptions,
    Renderer,
    LoadingIndicator,
    Tooltip,
    Title,
} from '../../../helpers/vizMocks.js';
import { _TESTS_resetDataKey } from '__internal/viz/vector_map/vector_map.utils';

import projectionModule from 'viz/vector_map/projection.main';
import controlBarModule from 'viz/vector_map/control_bar/control_bar';
import gestureHandlerModule from 'viz/vector_map/gesture_handler';
import trackerModule from 'viz/vector_map/tracker';
import themeManagerModule from 'viz/core/base_theme_manager';
import dataExchangerModule from 'viz/vector_map/data_exchanger';
import legendModule from 'viz/vector_map/legend';
import layoutModule from 'viz/vector_map/layout';
import mapLayerModule from 'viz/vector_map/map_layer';
import tooltipViewerModule from 'viz/vector_map/tooltip_viewer';
import rendererModule from 'viz/core/renderers/renderer_default';
import titleModule from 'viz/core/title';
import exportModule from 'viz/core/export';
import tooltipModule from 'viz/core/tooltip';
import { implementationsMap } from 'core/utils/size';

import '__internal/viz/vector_map/vector_map';

const StubProjection = stubClass(projectionModule.Projection);
const StubControlBar = stubClass(controlBarModule.ControlBar);
const StubGestureHandler = stubClass(gestureHandlerModule.GestureHandler);
const StubTracker = stubClass(trackerModule.Tracker);
const StubThemeManager = stubClass(themeManagerModule.BaseThemeManager);
const StubDataExchanger = stubClass(dataExchangerModule.DataExchanger);
const StubLegendsControl = stubClass(legendModule.LegendsControl);
const StubLayoutControl = stubClass(layoutModule.LayoutControl);
const StubMapLayerCollection = stubClass(mapLayerModule.MapLayerCollection);
const StubTooltipViewer = stubClass(tooltipViewerModule.TooltipViewer);
const StubExportMenu = stubClass(exportModule.ExportMenu);

export function returnValue(value) {
    return function() { return value; };
}

StubThemeManager.prototype.setTheme = function() {
    forceThemeOptions(this);
};

function stubComponentConstructors(test) {
    rendererModule.Renderer = returnValue(test.renderer);
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
export { stubComponentConstructors };

export const environment = {
    beforeEach: function() {
        _TESTS_resetDataKey();
        this.$container = $('<div id="test-container"></div>');
        this.renderer = new Renderer();
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
        this.loadingIndicator = new LoadingIndicator();
        this.title = new Title();
        this.exportMenu = new StubExportMenu();
        this.tooltip = new Tooltip();
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
