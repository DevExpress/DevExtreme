/* global createTestContainer */

import $ from 'jquery';
import themeManagerModule from 'viz/core/base_theme_manager';
import rangeViewModule from 'viz/range_selector/range_view';
import slidersControllerModule from 'viz/range_selector/sliders_controller';
import trackerModule from 'viz/range_selector/tracker';
import axisModule from 'viz/axes/base_axis';
import seriesDataSourceModule from 'viz/range_selector/series_data_source';
import rangeModule from 'viz/translators/range';
import translator2DModule from 'viz/translators/translator2d';
import rendererModule from 'viz/core/renderers/renderer';
import {
    stubClass,
    forceThemeOptions,
    Renderer,
} from '../../../helpers/vizMocks.js';

const StubThemeManager = stubClass(themeManagerModule.BaseThemeManager);
const StubRangeView = stubClass(rangeViewModule.RangeView);
const StubSlidersController = stubClass(slidersControllerModule.SlidersController, {
    getSelectedRange: function() {
        return { startValue: 'startValue', endValue: 'endValue' };
    }
});
const StubTracker = stubClass(trackerModule.Tracker);
const StubAxis = stubClass(axisModule.Axis);
const StubSeriesDataSource = stubClass(seriesDataSourceModule.SeriesDataSource, {
    getThemeManager: function() {
        return {
            getOptions: function() { return { valueAxis: {} }; },
            dispose: sinon.spy()
        };
    }
});
const StubRange = stubClass(rangeModule.Range);
const StubTranslator2D = stubClass(translator2DModule.Translator2D, {
    isValid: function() {
        return true;
    },
    getBusinessRange: function() {
        return new StubRange();
    }
});

import 'viz/range_selector/range_selector';

StubThemeManager.prototype.setTheme = function() {
    forceThemeOptions(this);
};

export { StubThemeManager, StubRange };

export function returnValue(value) {
    return function() {
        return value;
    };
}

export const environment = {
    beforeEach: function() {
        this.$container = $(createTestContainer('#qunit-fixture', { width: '300px', height: '150px' }));
        this.StubAxis = StubAxis;

        this.renderer = new Renderer();
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

