var $ = require('jquery'),
    vizMocks = require('../../../helpers/vizMocks.js'),
    labelModule = require('viz/series/points/label'),
    LabelCtor = new vizMocks.ObjectPool(labelModule.Label),
    ThemeManager = vizMocks.stubClass(require('viz/components/chart_theme_manager').ThemeManager),
    layoutManagerModule = require('viz/chart_components/layout_manager'),
    LayoutManager = vizMocks.stubClass(layoutManagerModule.LayoutManager),
    vizUtils = require('viz/core/utils'),
    StubTooltip = vizMocks.Tooltip,
    seriesFamilyModule = require('viz/core/series_family'),
    legendModule = require('viz/components/legend'),
    rendererModule = require('viz/core/renderers/renderer'),
    tooltipModule = require('viz/core/tooltip'),
    titleModule = require('viz/core/title'),
    crosshairModule = require('viz/chart_components/crosshair'),
    Crosshair = crosshairModule.Crosshair,
    chartThemeManagerModule = require('viz/components/chart_theme_manager'),
    scrollBarClassModule = require('viz/chart_components/scroll_bar'),
    ScrollBarClass = scrollBarClassModule.ScrollBar,
    trackerModule = require('viz/chart_components/tracker'),
    ChartTrackerSub = vizMocks.stubClass(trackerModule.ChartTracker),
    PieTrackerSub = vizMocks.stubClass(trackerModule.PieTracker),
    chartModule = require('viz/chart'),
    dataValidatorModule = require('viz/components/data_validator'),
    chartMocks = require('../../../helpers/chartMocks.js'),
    insertMockFactory = chartMocks.insertMockFactory,
    resetMockFactory = chartMocks.resetMockFactory,
    exportModule = require('viz/core/export'),
    restoreMockFactory = chartMocks.restoreMockFactory;

exports.LabelCtor = LabelCtor;
exports.rendererModule = rendererModule;

var resetModules = exports.resetModules = function() {
    trackerModule.ChartTracker.reset();
    trackerModule.PieTracker.reset();

    legendModule.Legend.reset();

    rendererModule.Renderer.reset();
    exportModule.ExportMenu.reset();
    titleModule.Title.reset();
};

function stubExport() {
    var that = this;
    that.export = new vizMocks.ExportMenu();
    that.export.stub('measure').returns([0, 0]);
    sinon.stub(exportModule, 'ExportMenu', function() {
        return that.export;
    });
}

stubExport();

vizMocks.Element.prototype.updateRectangle = sinon.spy(window.vizMocks.Element.prototype.updateRectangle);

var categories = ['First', 2005, 'Last'];
exports.categories = categories;

var baseEnvironment = {
    beforeEach: function() {
        this.$container = $('#chartContainer');
    }
};

// stubs
rendererModule.Renderer = sinon.spy(function(parameters) {
    return new vizMocks.Renderer(parameters);
});

titleModule.Title = sinon.spy(function(parameters) {
    var title = new vizMocks.Title(parameters);
    title.stub('layoutOptions').returns({ horizontalAlignment: 'center', verticalAlignment: 'top' });
    title.stub('measure').returns([0, 0]);
    return title;
});

legendModule.Legend = sinon.spy(function(parameters) {
    var legend = new vizMocks.Legend(parameters);
    legend.getActionCallback = sinon.spy(function(arg) {
        return arg;
    });
    return legend;
});

trackerModule.ChartTracker = sinon.spy(function(parameters) {
    return new ChartTrackerSub(parameters);
});

trackerModule.PieTracker = sinon.spy(function(parameters) {
    return new PieTrackerSub(parameters);
});

// stubs getters
function getTitleStub() {
    return titleModule.Title.lastCall.returnValue;
}
exports.getTitleStub = getTitleStub;

function getLegendStub() {
    return legendModule.Legend.lastCall.returnValue;
}
exports.getLegendStub = getLegendStub;

function getTrackerStub(isPie) {
    return trackerModule[isPie ? 'PieTracker' : 'ChartTracker'].lastCall.returnValue;
}
exports.getTrackerStub = getTrackerStub;

function createChartInstance(options, chartContainer) {
    return chartContainer.dxChart(options).dxChart('instance');
}
exports.createChartInstance = createChartInstance;

function setupMocks($container) {
    $container.width(300);
    $container.height(150);
    $container.show();
    insertMockFactory();
}

exports.environment = {
    beforeEach: function() {
        var that = this;
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
            marginsThemeApplied: true,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });
        that.themeManager.getOptions.withArgs('commonPaneSettings').returns({
            backgroundColor: 'none',
            border: {
                visible: false,
                top: true,
                bottom: true,
                left: true,
                right: true,
                dashStyle: 'solid'
            }
        });

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
            var ScrollBar = vizMocks.stubClass(ScrollBarClass),
                scrollBar = new ScrollBar();
            scrollBar.stub('init').returns(scrollBar);
            scrollBar.stub('update').returns(scrollBar);
            scrollBar.stub('getMargins').returns({ left: 0, top: 0, right: 0, bottom: 0 });
            scrollBar.stub('estimateMargins').returns({ left: 0, top: 0, right: 0, bottom: 0 });
            return scrollBar;
        });
        that.createChart = function(options) {
            $.each(options || {}, function(k, v) {
                if(k === 'commonPaneSettings') {
                    that.themeManager.getOptions.withArgs(k).returns($.extend(true, {
                        backgroundColor: 'none',
                        border: {
                            visible: false,
                            top: true,
                            bottom: true,
                            left: true,
                            right: true,
                            dashStyle: 'solid'
                        }
                    }, v));
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
        var family = sinon.createStubInstance(seriesFamilyModule.SeriesFamily);
        this.createSeriesFamily = sinon.stub(seriesFamilyModule, 'SeriesFamily', function() {
            family.pane = 'default';
            family.adjustSeriesDimensions = sinon.stub();
            family.adjustSeriesValues = sinon.stub();
            family.updateSeriesValues = sinon.stub();
            return family;
        });
        this.prepareSegmentRectPoints = chartModule._test_prepareSegmentRectPoints(function(x, y, w, h, borderOptions) { return { points: [x, y, w, h], pathType: borderOptions }; });
        this.createCrosshair = sinon.stub(crosshairModule, 'Crosshair', function() {
            return sinon.createStubInstance(Crosshair);
        });

        tooltipModule.Tooltip = sinon.spy(function(parameters) {
            return that.tooltip;
        });
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
        window.vizMocks.Element.prototype.updateRectangle.reset();
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
        tooltipModule.Tooltip.reset();

        this.tooltip = null;

        tooltipModule.Tooltip = null;


    },

    mockValidateData: function() {
        this.validateData = sinon.stub(dataValidatorModule, 'validateData', function(data, groupsData) {
            var categories = [];
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
