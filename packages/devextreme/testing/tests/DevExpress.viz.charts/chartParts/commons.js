import '../../../helpers/trackerMock.js';
import 'viz/chart';

import $ from 'jquery';
import {
    Renderer,
    stubClass,
    ObjectPool,
    Tooltip,
    ExportMenu,
    Element,
    Title,
    Legend,
} from '../../../helpers/vizMocks.js';
import { Label } from 'viz/series/points/label';
import chartThemeManagerModule from 'viz/components/chart_theme_manager';
import layoutManagerModule from 'viz/chart_components/layout_manager';
import vizUtils from 'viz/core/utils';
import seriesFamilyModule from 'viz/core/series_family';
import legendModule from 'viz/components/legend';
import rendererModule from 'viz/core/renderers/renderer';
import tooltipModule from 'viz/core/tooltip';
import titleModule from 'viz/core/title';
import crosshairModule from 'viz/chart_components/crosshair';
import scrollBarClassModule from 'viz/chart_components/scroll_bar';
import trackerModule from 'viz/chart_components/tracker';
import dataValidatorModule from 'viz/components/data_validator';
import {
    insertMockFactory,
    resetMockFactory,
    restoreMockFactory,
} from '../../../helpers/chartMocks.js';
import exportModule from 'viz/core/export';
import { _test_prepareSegmentRectPoints } from 'viz/utils';

const ThemeManager = stubClass(chartThemeManagerModule.ThemeManager);
const LayoutManager = stubClass(layoutManagerModule.LayoutManager);
const StubTooltip = Tooltip;
const Crosshair = crosshairModule.Crosshair;
const ScrollBarClass = scrollBarClassModule.ScrollBar;
const LabelCtor = new ObjectPool(Label);
const tooltipOrig = tooltipModule.Tooltip;
const { ExportMenu: ExportMenuOrig } = exportModule;

function stubExport() {
    const that = this;
    that.export = new ExportMenu();
    that.export.stub('measure').returns([0, 0]);
    exportModule.DEBUG_set_ExportMenu(sinon.spy(function() {
        return that.export;
    }));
}

Element.prototype.updateRectangle = sinon.spy(Element.prototype.updateRectangle);

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
sinon.stub(rendererModule, 'Renderer').callsFake((parameters) => {
    return new Renderer(parameters);
});

titleModule.DEBUG_set_title(sinon.spy(function(parameters) {
    const title = new Title(parameters);
    title.stub('layoutOptions').returns({ horizontalAlignment: 'center', verticalAlignment: 'top' });
    title.stub('measure').returns([0, 0]);
    return title;
}));

sinon.stub(legendModule, 'Legend').callsFake((parameters) => {
    const legend = new Legend(parameters);
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

const resetModules = function() {
    trackerModule.ChartTracker.resetHistory();
    trackerModule.PieTracker.resetHistory();

    legendModule.Legend.resetHistory();

    rendererModule.Renderer.resetHistory();
    exportModule.ExportMenu.resetHistory();
    titleModule.Title.resetHistory();
};

// stubs getters
function getTitleStub() {
    return titleModule.Title.lastCall.returnValue;
}

function getLegendStub() {
    return legendModule.Legend.lastCall.returnValue;
}

function getTrackerStub(isPie) {
    return trackerModule[isPie ? 'PieTracker' : 'ChartTracker'].lastCall.returnValue;
}

function createChartInstance(options, chartContainer) {
    return chartContainer.dxChart(options).dxChart('instance');
}

function setupMocks($container) {
    $container.width(300);
    $container.height(150);
    $container.show();
    insertMockFactory();
}

/*
    The behavior of withArgs(...).returnsArg() and withArgs(...).returns() has changed
    after updating sinon from 2.4.1 to 17.0.1 (https://github.com/DevExpress/DevExtreme/pull/26744):

    In 2.4.1:
    stub.withArgs('test').returnsArg(1);
    stub.withArgs('test').returns('overrided value');

    stub('test', '123'); // return '123'
    --------------------------------------------------
    In 17.0.1:
    stub.withArgs('test').returnsArg(1);
    stub.withArgs('test').returns('overrided value');

    stub('test', '123'); // return 'overrided value'
    --------------------------------------------------

    Therefore, in this case we do not override stubs with the same arguments.
*/
const NON_OVERRIDING_PROPERTIES = ['valueAxis', 'series'];

const environment = {
    beforeEach: function() {
        const that = this;
        baseEnvironment.beforeEach.apply(that, arguments);

        stubExport.call(this);
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
        this.StubLayoutManager = sinon.stub(layoutManagerModule, 'LayoutManager').callsFake(function() {
            return that.layoutManager;
        });

        sinon.stub(scrollBarClassModule, 'ScrollBar').callsFake(function() {
            const ScrollBar = stubClass(ScrollBarClass);
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
                } else if(NON_OVERRIDING_PROPERTIES.indexOf(k) === -1) {
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
        this.createThemeManager = sinon.stub(chartThemeManagerModule, 'ThemeManager').callsFake(function() {
            return that.themeManager;
        });
        const family = sinon.createStubInstance(seriesFamilyModule.SeriesFamily);
        this.createSeriesFamily = sinon.stub(seriesFamilyModule, 'SeriesFamily').callsFake(function() {
            family.pane = 'default';
            family.adjustSeriesDimensions = sinon.stub();
            family.adjustSeriesValues = sinon.stub();
            family.updateSeriesValues = sinon.stub();
            return family;
        });
        this.prepareSegmentRectPoints = _test_prepareSegmentRectPoints(function(x, y, w, h, borderOptions) { return { points: [x, y, w, h], pathType: borderOptions }; });
        this.createCrosshair = sinon.stub(crosshairModule, 'Crosshair').callsFake(function() {
            return sinon.createStubInstance(Crosshair);
        });

        tooltipModule.DEBUG_set_tooltip(sinon.spy(function(parameters) {
            return that.tooltip;
        }));
        sinon.stub(vizUtils, 'updatePanesCanvases').callsFake(function(panes, canvas) {
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
        Element.prototype.updateRectangle.resetHistory();
        scrollBarClassModule.ScrollBar.restore();
        this.createSeriesFamily.restore();
        this.prepareSegmentRectPoints.restore();
        this.createCrosshair.restore();
        vizUtils.updatePanesCanvases.restore();

        this.layoutManager.layoutElements.resetHistory();
        this.layoutManager = null;
        this.StubLayoutManager.reset();
        this.StubLayoutManager.restore();

        this.themeManager.getOptions.reset();
        this.themeManager = null;

        this.restoreValidateData();

        resetModules();
        tooltipModule.DEBUG_set_tooltip(tooltipOrig);
        exportModule.DEBUG_set_ExportMenu(ExportMenuOrig);

        this.tooltip = null;

        tooltipModule.DEBUG_set_tooltip(null);
    },
    mockValidateData: function() {
        this.validateData = sinon.stub(dataValidatorModule, 'validateData').callsFake(function(data, groupsData) {
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

export {
    LabelCtor,
    categories,
    rendererModule,
    environment,
    resetModules,
    getTitleStub,
    getLegendStub,
    getTrackerStub,
    createChartInstance,
};
