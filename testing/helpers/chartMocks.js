"use strict";

/* global currentAssert */
import $ from "jquery";
import Class from "core/class";
import commonUtils from "core/utils/common";
import typeUtils from "core/utils/type";
import loadingIndicatorModule from "viz/core/loading_indicator";
import axisModule from "viz/axes/base_axis";
import pointModule from "viz/series/points/base_point";
import translator2DModule from "viz/translators/translator2d";
import seriesFamilyModule from "viz/core/series_family";
import seriesModule from "viz/series/base_series";
import vizMocks from "./vizMocks.js";

let pointsMockData;
const firstCategory = "First";
const secondCategory = "Second";
const thirdCategory = "Third";
const fourthCategory = "Fourth";
const sourceItemsToMocking = {};

export const categories = [firstCategory, secondCategory, thirdCategory, fourthCategory];
let renderer;

export let seriesMockData = {};

const canvas = {
    width: 610,
    height: 400,
    left: 70,
    top: 0,
    right: 40,
    bottom: 60
};

export const horizontalStart = canvas.left;
export const horizontalDelta = 100;
export const horizontalEnd = horizontalStart + horizontalDelta * 5;
export const verticalStart = 0;
export const verticalDelta = 85;
export const verticalEnd = verticalStart + verticalDelta * 5;
export const horizontalContinuousXData = {
    "0": horizontalStart,
    "20": horizontalStart + horizontalDelta,
    "40": horizontalStart + horizontalDelta * 2,
    "60": horizontalStart + horizontalDelta * 3,
    "80": horizontalStart + horizontalDelta * 4,
    '100': horizontalStart + horizontalDelta * 5
};
export const horizontalContinuousXDataUntranslate = {
    "70": 0,
    "170": 20,
    "270": 40,
    "370": 60,
    "470": 80,
    "570": 100,
};
export const horizontalContinuousXDataSpecialCases = {
    'canvas_position_start': horizontalStart,
    'canvas_position_end': horizontalEnd,
    'canvas_position_default': horizontalStart,
    'canvas_position_left': horizontalStart,
    'canvas_position_center': horizontalStart + horizontalDelta * 2.5,
    'canvas_position_right': horizontalEnd
};
export const horizontalContinuousYData = {
    '0': verticalStart,
    '20': verticalStart + verticalDelta,
    '40': verticalStart + verticalDelta * 2,
    '60': verticalStart + verticalDelta * 3,
    '80': verticalStart + verticalDelta * 4,
    '100': verticalStart + verticalDelta * 5
};
export const horizontalContinuousYDataSpecialCases = {
    'canvas_position_start': verticalEnd,
    'canvas_position_end': verticalStart,
    'canvas_position_default': verticalStart,
    'canvas_position_bottom': verticalStart,
    'canvas_position_center': verticalStart + verticalDelta * 2.5,
    'canvas_position_top': verticalEnd
};
export const horizontalCategoryDelta = 125;
export const horizontalCategoryStart = canvas.left + horizontalCategoryDelta / 2;
export const horizontalCategoryEnd = horizontalCategoryStart + horizontalDelta * 3;
export const horizontalCategoryTick = horizontalCategoryDelta / 2;
export const verticalCategoryDelta = 85;
export const verticalCategoryStart = verticalCategoryDelta / 2;
export const verticalCategoryEnd = verticalStart + verticalDelta * 3;
export const verticalCategoryTick = verticalCategoryDelta / 2;
export const continuousTranslatorDataX = {
    translate: horizontalContinuousXData,
    specialCases: horizontalContinuousXDataSpecialCases,
    untranslate: horizontalContinuousXDataUntranslate,
    interval: 20
};
export const continuousTranslatorDataY = {
    translate: horizontalContinuousYData,
    specialCases: horizontalContinuousYDataSpecialCases
};
export const horizontalCategoryXData = {
    'First': horizontalCategoryStart,
    'Second': horizontalCategoryStart + horizontalCategoryDelta,
    'Third': horizontalCategoryStart + horizontalCategoryDelta * 2,
    'Fourth': horizontalCategoryStart + horizontalCategoryDelta * 3
};
export const horizontalCategoryXDataUntranslate = {
    70: 'First',
    170: 'Second',
    270: 'Third',
    370: 'Fourth'
};
export const horizontalCategoryXDataSpecialCases = {
    'canvas_position_start': horizontalStart,
    'canvas_position_end': horizontalEnd,
    'canvas_position_default': horizontalStart,
    'canvas_position_left': horizontalStart,
    'canvas_position_center': horizontalStart + horizontalDelta * 2.5,
    'canvas_position_right': horizontalEnd
};
export const horizontalCategoryYData = {
    'First': verticalCategoryStart,
    'Second': verticalCategoryStart + verticalCategoryDelta,
    'Third': verticalCategoryStart + verticalCategoryDelta * 2,
    'Fourth': verticalCategoryStart + verticalCategoryDelta * 3
};
export const horizontalCategoryYDataSpecialCases = {
    'canvas_position_start': verticalStart,
    'canvas_position_end': verticalEnd,
    'canvas_position_default': verticalStart,
    'canvas_position_bottom': verticalStart,
    'canvas_position_center': verticalStart + verticalDelta * 2.5,
    'canvas_position_top': verticalEnd
};
export const categoriesHorizontalTranslatorDataX = {
    translate: horizontalCategoryXData,
    specialCases: horizontalCategoryXDataSpecialCases,
    interval: horizontalCategoryDelta,
    untranslate: horizontalCategoryXDataUntranslate
};
export const categoriesHorizontalTranslatorDataY = {
    translate: horizontalContinuousYData,
    specialCases: horizontalContinuousYDataSpecialCases
};
export const categoriesVerticalTranslatorDataX = {
    translate: horizontalContinuousXData,
    specialCases: horizontalContinuousXDataSpecialCases
};
export const categoriesVerticalTranslatorDataY = {
    translate: horizontalCategoryYData,
    specialCases: horizontalCategoryYDataSpecialCases,
    interval: verticalCategoryDelta
};

var defaultAxisXOptions = $.extend(true, {}, {
    isHorizontal: true,
    valueMarginsEnabled: true,
    position: 'bottom',
    axisDivisionFactor: 50,
    visible: true,
    label: {
        alignment: "center",
        indentFromAxis: 10,
        // TODO: make sure we really need it
        precision: 0,
        format: "",
        customizeText: undefined

    },
    tick: {
        visible: false
    },
    grid: {
        visible: true
    },
    title: {
        font: {
            color: "#000000",
            family: "Helvetica",
            size: 20
        },
        margin: 10
    },
    stripStyle: {
    },
    constantLineStyle: {
    },
    drawingType: "normal"
});

var defaultAxisYOptions = $.extend(true, {}, {
    isHorizontal: false,
    valueMarginsEnabled: true,
    position: "left",
    axisDivisionFactor: 30,
    visible: true,
    label: {
        alignment: "right",
        indentFromAxis: 10,
        // TODO: make sure we really need it
        precision: 0,
        format: "",
        customizeText: undefined
    },
    tick: {
        visible: false
    },
    grid: {
        visible: true
    },
    title: {
        font: {
            color: "#000000",
            family: "Helvetica",
            size: 20
        },
        margin: 10
    },
    stripStyle: {
    },
    constantLineStyle: {
    },
    drawingType: "normal"
});

export const createHorizontalAxis = function createHorizontalAxis(translatorData, orthogonalTranslatorData, allOptions) {
    return createAxis(translatorData, orthogonalTranslatorData, $.extend(true, {}, defaultAxisXOptions, { incidentOccurred: vizMocks.incidentOccurred() }, allOptions), true);
};
export const createVerticalAxis = function createVerticalAxis(translatorData, orthogonalTranslatorData, allOptions) {
    return createAxis(translatorData, orthogonalTranslatorData, $.extend(true, {}, defaultAxisYOptions, { incidentOccurred: vizMocks.incidentOccurred() }, allOptions));
};

function createAxis(translatorData, orthogonalTranslatorData, allOptions, isHorizontal) {
    function createTranslator(data, options) {
        var useOriginalTranslator = options.useOriginalTranslator;
        data.stubData = data.stubData || options.stubData;
        data.categories = data.categories || options.categories;
        data.maxVisible = data.maxVisible || options.max;
        data.minVisible = data.minVisible || options.min;
        data.addRange = function() { };

        if(useOriginalTranslator) {
            return new translator2DModule.Translator2D(data || {}, canvas, isHorizontal ? { direction: 'horizontal' } : {});
        } else {
            return new MockTranslator(data || {});
        }
    }

    translatorData = $.extend({}, translatorData);
    orthogonalTranslatorData = $.extend({}, orthogonalTranslatorData);

    var translator = createTranslator(translatorData, allOptions),
        orthogonalTranslator = createTranslator(orthogonalTranslatorData, allOptions),
        mergedOptions = $.extend(true, {}, allOptions),
        axis;

    axis = new axisModule.Axis({
        renderer: new vizMocks.Renderer(),
        stripsGroup: allOptions.stripsGroup,
        labelAxesGroup: allOptions.labelAxesGroup,
        constantLinesGroup: allOptions.constantLinesGroup,
        axesContainerGroup: allOptions.axesContainerGroup,
        gridGroup: allOptions.gridGroup,
        axisType: "xyAxes",
        drawingType: "linear",
        isHorizontal: isHorizontal,
        incidentOccurred: allOptions.incidentOccurred
    });
    axis.updateOptions(mergedOptions);

    axis.setTranslator(translator, orthogonalTranslator);
    // we emulate this call to allow testing partial draw methods (such as drawTicks)
    // in production it"s called from axis.draw() method
    axis._initAxisPositions(axis);
    return axis;
}

function mockItem(itemKey, moduleName, mock) {
    if(sourceItemsToMocking[itemKey]) {
        throw "Item " + itemKey + " already mocked";
    }
    sourceItemsToMocking[itemKey] = moduleName[itemKey];
    moduleName[itemKey] = mock;
}

function restoreItem(itemKey, moduleName) {
    moduleName[itemKey] = sourceItemsToMocking[itemKey];
    sourceItemsToMocking[itemKey] = null;
}

export const insertMockFactory = function insertMockFactory() {
    seriesMockData = {
        series: [],
        args: [],
        currentSeries: 0
    };

    pointsMockData = {
        points: [],
        args: []
    };

    mockItem("Point", pointModule, function(series, data, options) {
        var opt = $.extend(true, {}, data, options);
        opt.series = series;
        return new MockPoint(opt);
    });

    mockItem("Series", seriesModule, function(renderSettings, options) {
        seriesMockData.args.push(arguments);
        if(seriesMockData.series.length > seriesMockData.currentSeries) {
            var series = seriesMockData.series[seriesMockData.currentSeries++];
            series.name = series.name || options.name;
            series.type = options.type;
            series.axis = options.axis;
            series.pane = options.pane;
            series._valueAxis = renderSettings.valueAxis;
            series._argumentAxis = renderSettings.argumentAxis;
            series.options = series.options || {};
            $.extend(true, series.options, options);
            series.userOptions = options;
            series.userOptions.userOptions = true;
            if(!series.userOptions.point) {
                series.userOptions.point = {};
            }
            series.userOptions.point.userOptions = true;
            series.renderer = renderSettings.renderer;
            series._extGroups = renderSettings;
            series.renderSettings = renderSettings;
            return series;
        }
        currentAssert().ok(false, "Unexpected series request (request #" + seriesMockData.currentSeries + ")");
        throw "Unexpected series request";
    });

    mockItem("LoadingIndicator", loadingIndicatorModule, function(parameters) {
        return new vizMocks.LoadingIndicator(parameters);
    });

    axisModule && mockItem("Axis", axisModule, function(parameters) {
        var axis = new MockAxis(parameters);
        axis.draw = sinon.spy(axis.draw);
        return axis;
    });
};

export const restoreMockFactory = function() {
    restoreItem("Point", pointModule);
    restoreItem("Series", seriesModule);
    restoreItem("LoadingIndicator", loadingIndicatorModule);
    axisModule && restoreItem("Axis", axisModule);
};

export const resetMockFactory = function resetMockFactory() {
    seriesMockData = null;
    pointsMockData = null;
};

export const setupSeriesFamily = function() {
    seriesFamilyModule.SeriesFamily = function(options) {
        return new MockSeriesFamily(options);
    };
};
//  Translator

export const MockTranslator = function(data) {
    var innerData = data,
        failOnWrongData = data && data.failOnWrongData;
    return {
        translate: function(index) {
            currentAssert().ok(index !== null, 'Verification of value that was passed to Translator (translate)');
            index = index === undefined ? 0 : index;
            var result = innerData.translate[index.toString()];
            if(typeof index === "number" && failOnWrongData && result === undefined) {
                currentAssert().ok(false, 'translate(' + index + ') = undefined');
            }
            return result;
        },
        untranslate: function(index) {
            currentAssert().ok(index !== undefined && index !== null, 'Verification of value that was passed to Translator (untranslate)');
            var result = innerData.untranslate[index.toString()];
            if(typeof index === "number" && failOnWrongData && result === undefined) {
                currentAssert().ok(false, 'untranslate(' + index + ') = undefined');
            }
            return result;
        },
        translateSpecialCase: function(specialCase) {
            currentAssert().ok(specialCase !== undefined && specialCase !== null, 'Verification of value that was passed to Translator (translateSpecialCase)');
            var result = innerData.specialCases[specialCase];
            if(failOnWrongData && result === undefined) {
                currentAssert().ok(false, 'translateSpecialCase(' + specialCase + ') = undefined');
            }
            return result;
        },
        getInterval: function() {
            var result = innerData.interval;
            if(failOnWrongData && result === undefined) {
                currentAssert().ok(false, 'interval = undefined');
            }
            return result;
        },
        getCanvasVisibleArea: function() {
            var result = innerData.getCanvasVisibleArea;
            if(failOnWrongData && result === undefined) {
                currentAssert().ok(false, "getCanvasVisibleArea = undefined");
            }
            return result || {};
        },
        getBusinessRange: function() {
            return this._businessRange || innerData;
        },
        updateBusinessRange: function() {

        },
        getMinBarSize: function() {
            return arguments[0];
        },
        checkMinBarSize: function() {
            return Math.abs(arguments[0]) < arguments[1] ? arguments[0] >= 0 ? arguments[1] : -arguments[1] : arguments[0];
        },
        reinit: commonUtils.noop,
        isEqualRange: function() {
            return true;
        }
    };
};

export const MockAngularTranslator = function(data) {
    var innerData = data;
    return {
        translate: function(index) {
            currentAssert().ok(index !== undefined && index !== null, 'Verification of value that was passed to Translator (translate)');
            return innerData.translate[index.toString()];
        },
        translateDifference: function(index) {
            currentAssert().ok(index !== undefined && index !== null, 'Verification of value that was passed to Translator (translate)');
            return innerData.translateDifference[index.toString()];
        }
    };
};

// Mock series
export const MockSeries = function MockSeries(options) {
    options = options || {};
    return {
        dispose: function() {
            delete this.options;
            delete this.offsetParams;

            this._extGroups =
                this.drawArguments =
                this._options = null;

            this.disposed = true;
        },
        type: options.type || "mockType",
        wasDrawn: false,
        dataReinitialized: false,
        reinitializedData: [],
        offsetParams: null,
        name: options.name,
        axis: options.axis,
        showInLegend: options.showInLegend,
        _visible: options.visible,
        _options: options,
        _extGroups: {},
        _valueAxis: options.valueAxis,
        _argumentAxis: options.argumentAxis,
        createPoints: sinon.spy(),
        pointsByArgument: (function() {
            var pointsByArgument = {};

            $.each(options.points, function(_, p) {
                if(p.argument) {
                    pointsByArgument[p.argument.valueOf()] = pointsByArgument[p.argument.valueOf()] || [];
                    pointsByArgument[p.argument.valueOf()].push(p);
                }
            });

            return pointsByArgument;
        })(),
        styles: {
            themeColor: "seriesThemeColor", point: {}, pointStyles: []
        },
        getValueAxis: function() {
            return this._valueAxis;
        },
        getArgumentAxis: function() {
            return this._argumentAxis;
        },
        draw: sinon.spy(function(animationEnabled, hideLayoutLabels, legendCallback) {
            this.wasDrawn = true;
            this.hideLayoutLabels = hideLayoutLabels;
            this.drawArguments = $.makeArray(arguments);
            this.legendCallback = legendCallback;
            animationEnabled && (this.wasAnimated = true);
        }),
        drawTrackers: function() {
            this.drawnTrackers = true;
        },
        getRangeData: function() {
            if(options.visible === false) {
                return { arg: {}, val: {} };
            }
            var range = $.extend(true, {}, options.range || {});

            range.arg = range.arg || {};
            range.val = range.val || {};
            range.viewport = range.viewport || {};

            return range;
        },
        getArgumentRange: sinon.stub().returns({ min: 0, max: 10 }),
        animate: function() {
            this.wasAnimated = true;
        },
        getVisiblePoints: function() {
            return this.visiblePoints;
        },
        getPoints: function() {
            this.returnPointsCountCall = this.returnPointsCountCall || 0;
            this.returnPointsCountCall++;
            return options.points || [];
        },
        updateData: function(data) { this.dataReinitialized = true; this.reinitializedData = data; },
        setOptions: function(data) { $.extend(true, options, data || {}); },
        updateOptions: function(options, settings) {
            $.extend(true, this.options, options || {});
            this.type = options.type;
            this.pane = options.pane;
            this.renderSettings.commonSeriesModes = settings.commonSeriesModes || this.renderSettings.commonSeriesModes;
            this._valueAxis = settings.valueAxis || this._valueAxis;
            this.axis = this._valueAxis && this._valueAxis.name;
            this._argumentAxis = settings.argumentAxis || this._argumentAxis;
        },
        arrangePoints: function() {
            this.pointsWereArranged = true;
            this.arrangePointsArgs = $.makeArray(arguments);
        },
        getPointsCount: function() {
            return (this.reinitializedData || []).length;
        },
        setMaxPointsCount: sinon.stub(),
        canRenderCompleteHandle: function() {
            return true;
        },
        getStackName: function() {
            return options.stack;
        },
        isFullStackedSeries: function() {
            return this.type && this.type.indexOf("fullstacked") !== -1;
        },
        isStackedSeries: function() {
            return this.type.indexOf("stacked") === 0;
        },
        isFinancialSeries: function() {
            return this.type === "stock" || this.type === "candlestick";
        },

        select: function() {
            this.selected = true;
        },
        selectPoint: function(point) {
            this.selectedPoint = point;
        },
        deselectPoint: function(point) {
            this.deselectedPoint = point;
        },
        getPointsByArg: function(arg) {
            var f = [];
            $.each(options.points, function(_, point) {
                // jshint eqeqeq:false
                if(point.argument.valueOf() == arg.valueOf()) {
                    f.push(point);
                }
            });
            return f;
        },
        getPointsByKeys: sinon.stub(),
        getArgumentField: function() {
            var options = this._options;
            return options.argumentField;
        },
        showPointTooltip: function(point) {
            this.showTooltip = point;
        },
        getValueFields: function() {
            return this._options.valueFields || [this._options.valueField] || [];
        },
        hidePointTooltip: function(point) {
            this.hideTooltip = point;
        },
        getTagField: function() {
            return this._options.tagFields || this._options.tagField;
        },
        _segmentPoints: commonUtils.noop,
        sort: commonUtils.noop,
        isUpdated: typeUtils.isDefined(options.isUpdated) ? options.isUpdated : true,

        getOptions: function() {
            return this._options;
        },
        getColor: function() {
            return "seriesColor";
        },
        getLegendStyles: function() {
            return {
                normal: {
                    opacity: this._options && this._options.opacity
                }
            };
        },
        isVisible: function() {
            return this._visible !== undefined ? this._visible : true;
        },
        setClippingParams: function(baseId, wideId, force) {
            this["clip-path"] = baseId,
                this.wideId = wideId,
                this.forceClipping = force;
        },
        drawLabelsWOPoints: sinon.spy(),
        hideLabels: sinon.spy(),

        areErrorBarsVisible: function() {
            return (this._options.errorBars || {}).visible;
        },
        adjustLabels: sinon.spy(),
        checkLabelsOverflow: sinon.spy(),
        correctPosition: sinon.spy(),
        correctRadius: sinon.spy(),
        updateDataType: sinon.spy(),
        getViewport: sinon.stub().returns({}),
        getMarginOptions: sinon.stub().returns(options.marginOptions || {}),
        useAggregation: sinon.stub().returns(false)
    };
};

export const MockPoint = Class.inherit(
    {
        ctor: function(options) {
            this.update(options);
        },

        update: function(options) {
            this._options = this.mockOptions = options || {};
            this.argument = options.argument;
            this.value = options.value !== undefined ? options.value : 0;
            this.size = options.size;
            this.originalValue = this.value;
            this.minValue = options.minValue !== undefined ? options.minValue : 0;
            this.initialValue = this.value;
            this.rotated = !!options.rotated;
            this.tag = options.tag;

            this.translatorPassed = false;

            this.openValue = options.openValue;
            this.highValue = options.highValue;
            this.lowValue = options.lowValue;
            this.closeValue = options.closeValue;
            if(this.openValue || this.highValue || this.lowValue || this.closeValue) {
                this.value = options.reductionValue;
            }
            this.labelFormatObject = {};
            this.series = options.series;

            this.options = this.mockOptions.options;
            this.pointClassName = options.pointClassName;

            this.x = options.x;
            this.minX = options.minX;
            this.y = options.y;
            this.minY = options.minY;
            this._visible = options.visible;
            this._label = {
                draw: sinon.spy()
            };
            this.highError = options.highError;
            this.lowError = options.lowError;
        },
        dispose: function() {
            delete this.options;
            delete this.series;
            delete this.mockOptions;
            this.disposed = true;
        },
        isInVisibleArea: function() {
            return true;
        },
        correctValue: function(val, percent, base) {
            // store value for comparison in tests
            if(this.hasValue()) {
                this.correctedValue = val;
                // emulate real point behavior
                if(this.hasValue()) {
                    this.value = (base || this.initialValue) + val;
                    this.minValue = val;
                }

                if(percent) {
                    this.percent = percent;
                    this.labelFormatObject.percent = percent;
                }
                this.correctionWasReset = false;
            }
        },

        resetCorrection: function() {
            this.correctionWasReset = true;
        },

        isSelected: function() {
            return this.fullState & 2;
        },

        isHovered: function() {
            return this.fullState & 1;
        },
        correctLabel: function() {

        },
        correctPosition: function(correction) {
            // correct angles?...
            var that = this;
            that.radiusInner = correction.radiusInner;
            that.radiusOuter = correction.radiusOuter;
            that.centerX = correction.centerX;
            that.centerY = correction.centerY;
        },
        setPercentValue: function(total, fullStacked) {
            if(this.hasValue()) {
                this.total = total;
                this.percent = this.value / total;
                if(fullStacked) {
                    this.value = this.value / total;
                    this.minValue = this.minValue / total;
                }
            }
        },
        setOptions: function(pointOptions) {
            pointOptions.wereSet = true;

            this.options = pointOptions;
        },
        translate: function(translator) {
            this.translatorPassed = true;
        },
        clearVisibility: function() {

        },
        hide: function() {
            this._visible = false;
        },
        getCoords: function(min) {
            if(min) {
                return this.rotated ? { x: this.minX || 0, y: this.y } : { x: this.x, y: this.minY || 0 };
            }
            return { x: this.x, y: this.y };
        },
        drawMarker: function(renderer, group) {
            this.markerRendered = {
                renderer: renderer,
                group: group
            };
        },
        draw: function(renderer, group) {
            this.markerRendered = {
                renderer: renderer,
                group: group
            };
        },
        drawTrackerMarker: function(renderer, group) {
            this.trackerMarkerRendered = {
                renderer: renderer,
                group: group
            };
        },
        drawTracker: function(renderer, group) {
            this.trackerMarkerRendered = {
                renderer: renderer,
                group: group
            };
        },
        drawLabel: function(renderer, group) {
            this.labelRendered = {
                renderer: renderer,
                group: group
            };
        },
        correctCoordinates: function(correction) {
            this.coordinatesCorrected = true;
            this.coordinatesCorrection = correction;
        },
        setHoverState: function() {
            this.hoverStateWasSet = true;
        },
        releaseHoverState: function() {
            this.hoverStateWasReleased = true;
        },
        setSelectedState: function() {
            this.selectedStateWasSet = true;
        },
        releaseSelectedState: function() {
            this.selectedStateWasReleased = true;
        },
        applyNormalStyle: function() {
            this.currentStyle = "normal";
        },
        applyHoverStyle: function() {
            this.currentStyle = "hovered";
        },
        applySelectionStyle: function() {
            this.currentStyle = "selected";
        },
        select: function() {
            this.selected = true;
        },
        hasValue: function() {
            return this.value !== null && this.minValue !== null && this.highValue !== null && this.lowValue !== null;
        },
        hasCoords: function() {
            return true;
        },
        getDefaultCoords: function() {
            return $.extend({ defaultCoords: true }, this);
        },
        animate: function() {
            this.animation = true;
            this.animationArguments = arguments;
        },
        getTooltipFormatObject: function() {
            return { valueText: NaN };
        },
        getTooltipParams: function(location) {
            return location === 'edge' ? { x: 'edge', y: 'edge', offset: 0 } : {
                x: this.argument, y: this.value, offset: 0
            };
        },
        getColor: function() {
            return this;
        },
        getClassName: function() {
            return "pointClass";
        },
        updateOptions: sinon.spy(function() { }),
        isVisible: function() {
            return this._visible !== undefined ? this._visible : true;
        },
        getOptions: function() {
            return this.options;
        },
        getLegendStyles: function() {
            return {
                hover: undefined,
                selection: undefined,
                normal: {
                }
            };
        },
        setHole: function() { },
        resetHoles: function() { },
        setInvisibility: sinon.spy(),
        setDefaultCoords: sinon.spy()
    });

export const MockAxis = function(renderOptions) {
    var renderer = renderOptions.renderer,
        axisElementsGroup = renderer.g();
    return {
        updateOptions: function(options) {
            this.pane = options.pane;
            this.name = options.name;
            this._virtual = options.virtual;
            this.priority = options.priority;
            this._options = options;
        },
        dispose: function() {
            this.resetMock();

            this._axisElementsGroup =
                this._constantLinesGroup =
                this._scaleBreaksGroup =
                this._renderer =
                this._labelAxesGroup =
                this._orthogonalTranslator =
                this._stripsGroup =
                this._translator =
                this.axesContainerGroup =
                this.gridGroup =
                this._options = null;

            this.disposed = true;
        },
        wasDrawn: false,
        draw: function() {
            this.wasDrawn = true;
        },
        shift: function(x, y) {
            this.shifted = { x: x, y: y };
        },
        estimateMargins: function() {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        },
        getMargins: function() {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        },
        updateSize: sinon.stub(),

        setBusinessRange: sinon.stub(),

        setGroupSeries: sinon.stub(),

        restoreBusinessRange: sinon.stub(),

        updateCanvas: sinon.stub(),

        setPane: function(pane) {
            this.pane = pane;
            this._options.pane = pane;
        },
        setTypes: function(type, axisType, typeSelector) {
            this._options.type = type || this._options.type;
            this._options[typeSelector] = axisType || this._options[typeSelector];
        },
        getOptions: function() {
            return this._options;
        },
        getRangeData: function() {
            return this._options.mockRange || {};
        },
        resetMock: function() {
            delete this.range;
            delete this.wasDrawn;
            delete this._translator;
            delete this._orthogonalTranslator;
            delete this.shifted;
        },
        setPercentLabelFormat: sinon.stub(),
        resetAutoLabelFormat: sinon.stub(),
        getTicksValues: function() {
            if(!this._minorTicks) {
                this._minorTicks = $.map(this._options.mockMinorTicks || [], function(item) { return { value: item }; });
            }
            if(!this._majorTicks) {
                this._majorTicks = $.map(this._options.mockTickValues || [], function(item) { return { value: item }; });
            }
            this._tickInterval = this._options.mockTickInterval;
            this._minorTickInterval = this._options.mockMinorTickInterval;
            return {
                majorTicksValues: $.map(this._majorTicks, function(item) { return item.value; }),
                minorTicksValues: $.map(this._minorTicks || [], function(item) { return item.value; })
            };
        },
        setTicks: function(ticks) {
            this._majorTicks = $.map(ticks.majorTicks, function(item) { return { value: item }; });
            this._minorTicks = $.map(ticks.minorTicks, function(item) { return { value: item }; });
        },
        createTicks: function() {

        },
        getMultipleAxesSpacing: function() {
            return this._options.mockAxesSpacing || 5;
        },
        getTranslator: function() {
            var businessRange = this.setBusinessRange.lastCall && this.setBusinessRange.lastCall.args[0] || {};
            businessRange.minVisible = businessRange.minVisible || businessRange.min;
            businessRange.maxVisible = businessRange.maxVisible || businessRange.max;
            return this._options && this._options.mockTranslator || new MockTranslator(businessRange);
        },
        _isHorizontal: renderOptions.isHorizontal,
        _incidentOccurred: renderOptions.incidentOccurred,
        _stripsGroup: renderOptions.stripsGroup,
        _labelAxesGroup: renderOptions.labelAxesGroup,
        _constantLinesGroup: renderOptions.constantLinesGroup,
        _scaleBreaksGroup: renderOptions.scaleBreaksGroup,
        axesContainerGroup: renderOptions.axesContainerGroup,
        gridGroup: renderOptions.gridGroup,
        isArgumentAxis: renderOptions.isArgumentAxis,
        _renderer: renderer,
        applyClipRects: function(clipRect) {
            this.clipRectsApplied = true;
        },
        _axisElementsGroup: axisElementsGroup,
        validate: function(isArgumentAxisType, incidentOccurred) {
            this.validated = true,
                this.incidentOccurred = incidentOccurred;
            this.isArgumentAxisType = isArgumentAxisType;
        },
        validateUnit: function(value) {
            return value;
        },
        formatRange: sinon.stub(),
        zoom: sinon.spy(function(min, max) {
            return { min: min, max: max };
        }),
        adjust: sinon.spy(),
        getViewport: sinon.stub().returns({}),
        resetZoom: sinon.spy(),
        drawScaleBreaks: sinon.spy(),
        resetTypes: sinon.spy(),
        setMarginOptions: sinon.spy(),
        getAggregationInfo: function() {
            return {
                interval: null,
                ticks: []
            };
        },
        isZoomed: function() {
            return true;
        },
        getCategoriesSorter: function() {
            return this._options.categoriesSortingMethod;
        }
    };
};

var MockSeriesFamily = Class.inherit({
    ctor: function(options) {
        this.options = options;
        this.addedSeries = [];
    },
    updateOptions: function(options) {
        this.options = options;
    },
    dispose: function() {
        this.disposed = true;
    },
    adjustSeriesValues: function() {
        this.adjustedValues = true;

        this.allSeriesHavePoints = (this.addedSeries || [])
            .reduce(function(r, s) { return r.concat(s); }, [])
            .reduce(function(r, s) {

                return r && (s.getAllPoints ? !!s.getAllPoints().length : true);
            }, true);
    },
    adjustSeriesDimensions: function() {
        this.adjustedDimensions = true;
    },
    add: function(series) {
        this.addedSeries.push(series);
        series.parentFamily = this;
    },
    updateSeriesValues: function() {
        this.updatedValues = true;
    },
    resetMock: function() {
        this.disposed = null;
        this.adjustedValues = null;
        this.adjustedDimensions = null;
        this.updatedValues = null;
    }
});

export const checkTextSpecial = function(i, text, x, y, attr) {
    var assert = currentAssert();
    assert.strictEqual(renderer.text.getCall(i).args[0], text, "Text for text " + i);
    assert.equal(renderer.text.getCall(i).args[1], x, "X for text " + i);
    assert.equal(renderer.text.getCall(i).args[2], y, "Y for text " + i);

    assert.ok(renderer.text.getCall(i).returnValue.attr.firstCall.args[0], "attributes were passed for text " + i);
    assert.equal(renderer.text.getCall(i).returnValue.attr.firstCall.args[0]["align"], attr.align, "Incorrect label align for text " + i);
    if(attr.rotate) {
        assert.equal(renderer.text.getCall(i).returnValue.attr.firstCall.args[0]["rotate"], attr.rotate, "Incorrect label rotation for text " + i);
    }
};

export const commonMethodsForTests = {
    checkTranslatorsCount: function(assert, translators, panesCount, axesCount) {
        var i = 0;
        $.each(translators, function(pane, axes) {
            panesCount--;
            $.each(axes, function(axis, tr) {
                axesCount[i]--;
                assert.ok(tr.arg);
                assert.ok(tr.val);
            });
            assert.strictEqual(axesCount[i]--, 0);
            i++;
        });
        assert.strictEqual(panesCount, 0);
    },

    assertRange: function(assert, range, options) {
        assert.ok(range, "Range is created for pane " + options.pane);
        assert.equal(range.pane, options.pane, "Pane name set for " + options.pane);
        assert.strictEqual(range.min, options.min, "Min for " + options.pane);
        assert.strictEqual(range.max, options.max, "Max for " + options.pane);
    }
};
