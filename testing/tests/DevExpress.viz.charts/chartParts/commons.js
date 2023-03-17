import $ from 'jquery';
import { mock } from '../../../helpers/mockModule.js';
import vizMocks from '../../../helpers/vizMocks.js';
import { Label } from 'viz/series/points/label';
import { ThemeManager as OriginalThemeManager } from 'viz/components/chart_theme_manager';
import * as layoutManagerModule from 'viz/chart_components/layout_manager';
import vizUtils from 'viz/core/utils';
import * as seriesFamilyModule from 'viz/core/series_family';
import * as legendModule from 'viz/components/legend';
import * as rendererModule from 'viz/core/renderers/renderer';
import * as tooltipModule from 'viz/core/tooltip';
import * as titleModule from 'viz/core/title';
import * as crosshairModule from 'viz/chart_components/crosshair';
import * as chartThemeManagerModule from 'viz/components/chart_theme_manager';
import * as scrollBarClassModule from 'viz/chart_components/scroll_bar';
import { ChartTracker, PieTracker } from 'viz/chart_components/tracker';

import dataValidatorModule from 'viz/components/data_validator';
import * as chartMocks from '../../../helpers/chartMocks.js';
import exportModule from 'viz/core/export';
import { _test_prepareSegmentRectPoints } from 'viz/utils';

const insertMockFactory = chartMocks.insertMockFactory;
const resetMockFactory = chartMocks.resetMockFactory;
const ThemeManager = vizMocks.stubClass(OriginalThemeManager);
const restoreMockFactory = chartMocks.restoreMockFactory;
const StubTooltip = vizMocks.Tooltip;
const LayoutManager = vizMocks.stubClass(layoutManagerModule.LayoutManager);
const tooltipOrig = tooltipModule.Tooltip;
const ScrollBarClass = scrollBarClassModule.ScrollBar;
const ChartTrackerSub = vizMocks.stubClass(ChartTracker);
const PieTrackerSub = vizMocks.stubClass(PieTracker);
const Crosshair = crosshairModule.Crosshair;

function stubExport() {
    // const that = this;
    // that.export = new vizMocks.ExportMenu();
    // that.export.stub('measure').returns([0, 0]);
    // exportModule.DEBUG_set_ExportMenu(sinon.spy(function() {
    //     return that.export;
    // }));
}

stubExport();

vizMocks.Element.prototype.updateRectangle = sinon.spy(vizMocks.Element.prototype.updateRectangle);

const categories = ['First', 2005, 'Last'];

const baseEnvironment = {
    beforeEach: function() {
        this.$container = $('#chartContainer');
    }
};
const defaultCommonPaneSettings = {
    backgroundColor: 'none',
    border: {
        visible: false,
        top: true,
        bottom: true,
        left: true,
        right: true,
        dashStyle: 'solid'
    }
};

const defaultCrosshairOptions = {
    horizontalLine: {},
    verticalLine: {}
};

// stubs
rendererModule.Renderer = sinon.spy(function(parameters) {
    return new vizMocks.Renderer(parameters);
});

titleModule.DEBUG_set_title(sinon.spy(function(parameters) {
    const title = new vizMocks.Title(parameters);
    title.stub('layoutOptions').returns({ horizontalAlignment: 'center', verticalAlignment: 'top' });
    title.stub('measure').returns([0, 0]);
    return title;
}));

legendModule.Legend = sinon.spy(function(parameters) {
    const legend = new vizMocks.Legend(parameters);
    legend.getActionCallback = sinon.spy(function(arg) {
        return arg;
    });
    legend.getTemplatesGroups = sinon.spy(function() {
        return [];
    });
    legend.getTemplatesDef = sinon.spy(function() {
        return [];
    });
    return legend;
});

const trackerModule = mock('viz/chart_components/tracker', {
    ChartTracker: sinon.spy((parameters) => new ChartTrackerSub(parameters)),
    PieTracker: sinon.spy((parameters) => new PieTrackerSub(parameters))
});

const resetModules = function() {
    trackerModule.ChartTracker.reset();
    trackerModule.PieTracker.reset();

    legendModule.Legend.reset();

    rendererModule.Renderer.reset();
    exportModule.ExportMenu.reset();
    titleModule.Title.reset();
};

// stubs getters
export function getTitleStub() {
    return titleModule.Title.lastCall.returnValue;
}

export function getLegendStub() {
    return legendModule.Legend.lastCall.returnValue;
}

export function getTrackerStub(isPie) {
    return trackerModule[isPie ? 'PieTracker' : 'ChartTracker'].lastCall.returnValue;
}

export function createChartInstance(options, chartContainer) {
    return chartContainer.dxChart(options).dxChart('instance');
}

function setupMocks($container) {
    $container.width(300);
    $container.height(150);
    $container.show();
    insertMockFactory();
}

export const environment = {
    beforeEach: function() {
        const that = this;
        baseEnvironment.beforeEach.apply(that, arguments);

        setupMocks(that.$container);
        that.tooltip = new StubTooltip();
        that.themeManager = new ThemeManager();
        that.themeManager.stub('theme').withArgs('legend').returns({ title: {} });
        that.themeManager.stub('getOptions').withArgs('rotated').returns(false);
        that.themeManager.getOptions.withArgs('panes').returns({ name: 'default' });
        that.themeManager.getOptions.withArgs('containerBackgroundColor').returns('#ffffff');
        that.themeManager.getOptions.withArgs('animation').returns(true);
        that.themeManager.getOptions.withArgs('valueAxis').returnsArg(1);
        that.themeManager.getOptions.withArgs('series').returnsArg(1);
        that.themeManager.getOptions.withArgs('seriesTemplate').returns(false);
        that.themeManager.getOptions.withArgs('margin').returns({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        that.themeManager.getOptions.withArgs('commonPaneSettings').returns(defaultCommonPaneSettings);
        that.themeManager.getOptions.withArgs('crosshair').returns(defaultCrosshairOptions);

        that.themeManager.getOptions.withArgs('dataPrepareSettings').returns({
            checkTypeForAllData: true,
            convertToAxisDataType: false
        });
        that.themeManager.getOptions.withArgs('resolveLabelOverlapping').returns(false);
        that.themeManager.getOptions.withArgs('zoomAndPan').returns({ valueAxis: {}, argumentAxis: {} });
        that.themeManager.getOptions.returns({});

        that.layoutManager = new LayoutManager();
        that.layoutManager.layoutElements = sinon.spy(function() {
            arguments[2]();
        });
        this.StubLayoutManager = sinon.stub(layoutManagerModule, 'LayoutManager', function() {
            return that.layoutManager;
        });

        sinon.stub(scrollBarClassModule, 'ScrollBar', function() {
            const ScrollBar = vizMocks.stubClass(ScrollBarClass);
            const scrollBar = new ScrollBar();
            scrollBar.stub('init').returns(scrollBar);
            scrollBar.stub('update').returns(scrollBar);
            scrollBar.stub('getMargins').returns({ left: 0, top: 0, right: 0, bottom: 0 });
            scrollBar.stub('estimateMargins').returns({ left: 0, top: 0, right: 0, bottom: 0 });
            scrollBar.stub('getOptions').returns({});
            return scrollBar;
        });
        that.createChart = function(options) {
            $.each(options || {}, function(k, v) {
                if(k === 'commonPaneSettings') {
                    that.themeManager.getOptions.withArgs(k).returns($.extend(true, {}, defaultCommonPaneSettings, v));
                } else if(k === 'crosshair') {
                    that.themeManager.getOptions.withArgs(k).returns($.extend(true, {}, defaultCrosshairOptions, v));
                } else if(k !== 'series') {
                    that.themeManager.getOptions.withArgs(k).returns(v);
                }
            });
            that.themeManager.getOptions.withArgs('argumentAxis').returns($.extend(true, {
                tick: {},
                minorTick: {},
                label: {}
            }, options.argumentAxis));
            return createChartInstance(options, this.$container);
        };
        this.createThemeManager = sinon.stub(chartThemeManagerModule, 'ThemeManager', function() {
            return that.themeManager;
        });
        const family = sinon.createStubInstance(seriesFamilyModule.SeriesFamily);
        this.createSeriesFamily = sinon.stub(seriesFamilyModule, 'SeriesFamily', function() {
            family.pane = 'default';
            family.adjustSeriesDimensions = sinon.stub();
            family.adjustSeriesValues = sinon.stub();
            family.updateSeriesValues = sinon.stub();
            return family;
        });
        this.prepareSegmentRectPoints = _test_prepareSegmentRectPoints(function(x, y, w, h, borderOptions) { return { points: [x, y, w, h], pathType: borderOptions }; });
        this.createCrosshair = sinon.stub(crosshairModule, 'Crosshair', function() {
            return sinon.createStubInstance(Crosshair);
        });

        tooltipModule.DEBUG_set_tooltip(sinon.spy(function(parameters) {
            return that.tooltip;
        }));
        sinon.stub(vizUtils, 'updatePanesCanvases', function(panes, canvas) {
            $.each(panes, function(_, item) {
                item.canvas = $.extend({}, canvas);
            });
        });

        this.mockValidateData();
    },
    afterEach: function() {
        this.$container.remove();
        restoreMockFactory();
        resetMockFactory();
        this.createThemeManager.reset();
        this.createThemeManager.restore();
        vizMocks.Element.prototype.updateRectangle.reset();
        scrollBarClassModule.ScrollBar.restore();
        this.createSeriesFamily.restore();
        this.prepareSegmentRectPoints.restore();
        this.createCrosshair.restore();
        vizUtils.updatePanesCanvases.restore();

        this.layoutManager.layoutElements.reset();
        this.layoutManager = null;
        this.StubLayoutManager.reset();
        this.StubLayoutManager.restore();

        this.themeManager.getOptions.reset();
        this.themeManager = null;

        this.restoreValidateData();

        resetModules();
        tooltipModule.DEBUG_set_tooltip(tooltipOrig);

        this.tooltip = null;

        tooltipModule.DEBUG_set_tooltip(null);


    },

    mockValidateData: function() {
        this.validateData = sinon.stub(dataValidatorModule, 'validateData', function(data, groupsData) {
            const categories = [];
            if(data) {
                data.forEach(function(item) {
                    categories.push(item.arg);
                });
                groupsData.categories = categories;
            }
            return { arg: data || [] };
        });
    },

    restoreValidateData: function() {
        this.validateData.reset();
        this.validateData.restore();
    }
};

import 'viz/chart';

export const LabelCtor = new vizMocks.ObjectPool(Label);

export {
    rendererModule,
    categories,
    resetModules,
};
