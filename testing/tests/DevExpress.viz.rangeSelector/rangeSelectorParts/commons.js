/* global createTestContainer */

const themeManagerModule = require('viz/core/base_theme_manager');
const rangeViewModule = require('viz/range_selector/range_view');
const slidersControllerModule = require('viz/range_selector/sliders_controller');
const trackerModule = require('viz/range_selector/tracker');
const axisModule = require('viz/axes/base_axis');
const seriesDataSourceModule = require('viz/range_selector/series_data_source');
const rangeModule = require('viz/translators/range');
const translator2DModule = require('viz/translators/translator2d');
const rendererModule = require('viz/core/renderers/renderer');
const vizMocks = require('../../../helpers/vizMocks.js');

const StubThemeManager = vizMocks.stubClass(themeManagerModule.BaseThemeManager);
const StubRangeView = vizMocks.stubClass(rangeViewModule.RangeView);
const StubSlidersController = vizMocks.stubClass(slidersControllerModule.SlidersController, {
    getSelectedRange: function() {
        return { startValue: 'startValue', endValue: 'endValue' };
    }
});
const StubTracker = vizMocks.stubClass(trackerModule.Tracker);
const StubAxis = vizMocks.stubClass(axisModule.Axis);
const StubSeriesDataSource = vizMocks.stubClass(seriesDataSourceModule.SeriesDataSource, {
    getThemeManager: function() {
        return {
            getOptions: function() { return { valueAxis: {} }; },
            dispose: sinon.spy()
        };
    }
});
const StubRange = vizMocks.stubClass(rangeModule.Range);
const StubTranslator2D = vizMocks.stubClass(translator2DModule.Translator2D, {
    isValid: function() {
        return true;
    },
    getBusinessRange: function() {
        return new StubRange();
    }
});

require('viz/range_selector/range_selector');

StubThemeManager.prototype.setTheme = function() {
    vizMocks.forceThemeOptions(this);
};

exports.StubThemeManager = StubThemeManager;
exports.StubRange = StubRange;

function returnValue(value) {
    return function() {
        return value;
    };
}
exports.returnValue = returnValue;

exports.environment = {
    beforeEach: function() {
        this.$container = createTestContainer('#test-container', { width: 300, height: 150 });
        this.StubAxis = StubAxis;

        this.renderer = new vizMocks.Renderer();
        this.themeManager = new StubThemeManager();
        this.translator = new StubTranslator2D();
        this.rangeView = new StubRangeView();
        this.slidersController = new StubSlidersController();
        this.tracker = new StubTracker();
        this.axis = new StubAxis();
        this.axis.stub('getMarginOptions').returns({});
        this.axis.stub('getOptions').returns({});

        this.axis.stub('getTranslator').returns(this.translator);
        this.axis.calculateInterval = function(a, b) { return a - b; };
        this.seriesDataSource = new StubSeriesDataSource();

        rendererModule.Renderer = returnValue(this.renderer);
        themeManagerModule.BaseThemeManager = returnValue(this.themeManager);
        rangeViewModule.RangeView = returnValue(this.rangeView);
        slidersControllerModule.SlidersController = returnValue(this.slidersController);
        trackerModule.Tracker = returnValue(this.tracker);
        seriesDataSourceModule.SeriesDataSource = returnValue(this.seriesDataSource);
        translator2DModule.Translator2D = returnValue(this.translator);

        sinon.stub(axisModule, 'Axis');
        axisModule.Axis.returns(this.axis);
    },

    afterEach: function() {
        this.$container.remove();
        axisModule.Axis.restore();
    },

    createWidget: function(options) {
        const that = this;
        that.themeManager.stub('theme').withArgs('scale').returns({
            tick: {},
            minorTick: {},
            label: {},
            marker: {
                label: {}
            },
            endOnTick: false
        });

        that.themeManager.stub('theme').withArgs('chart').returns({
            valueAxis: {}
        });

        return that.$container.dxRangeSelector(options).dxRangeSelector('instance');
    }
};

