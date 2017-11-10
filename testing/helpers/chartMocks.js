"use strict";

/* global currentAssert */

(function(root, factory) {
    /* global jQuery */
    var reg = function(exports) {
        jQuery.extend(root, exports);

        Object.defineProperty(root, "renderer", {
            get: function() {
                return exports.renderer;
            }
        });
        Object.defineProperty(root, "seriesMockData", {
            get: function() {
                return exports.seriesMockData;
            }
        });
    };

    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            reg(factory(
                require("jquery"),
                require("core/class"),
                require("core/utils/common"),
                require("viz/core/loading_indicator"),
                require("viz/axes/base_axis"),
                require("viz/series/points/base_point"),
                require("viz/translators/translator1d"),
                require("viz/translators/translator2d"),
                require("viz/core/series_family"),
                require("viz/series/base_series"),
                require("./vizMocks.js")
            ));
        });
    } else {
        reg(factory(
            jQuery,
            DevExpress.require("core/class"),
            DevExpress.require("core/utils/common"),
            DevExpress.require("viz/core/loading_indicator"),
            DevExpress.require("viz/axes/base_axis"),
            DevExpress.require("viz/series/points/base_point"),
            DevExpress.require("viz/translators/translator1d"),
            DevExpress.require("viz/translators/translator2d"),
            DevExpress.require("viz/core/series_family"),
            DevExpress.require("viz/series/base_series"),
            require("./vizMocks.js")
        ));
    }
}(window, function($, Class, commonUtils, loadingIndicatorModule, axisModule, pointModule, translator1DModule, translator2DModule, seriesFamilyModule, seriesModule, vizMocks) {

    var exports = {};

    var seriesMockData;
    var pointsMockData;
    var firstCategory = "First";
    var secondCategory = "Second";
    var thirdCategory = "Third";
    var fourthCategory = "Fourth";
    exports.categories = [firstCategory, secondCategory, thirdCategory, fourthCategory];
    var renderer;

    Object.defineProperty(exports, "renderer", {
        get: function() {
            return renderer;
        }
    });
    Object.defineProperty(exports, "seriesMockData", {
        get: function() {
            return seriesMockData;
        }
    });

    var canvas = {
        width: 610,
        height: 400,
        left: 70,
        top: 0,
        right: 40,
        bottom: 60
    };
    exports.horizontalStart = canvas.left;
    exports.horizontalDelta = 100;
    exports.horizontalEnd = exports.horizontalStart + exports.horizontalDelta * 5;
    exports.verticalStart = 0;
    exports.verticalDelta = 85;
    exports.verticalEnd = exports.verticalStart + exports.verticalDelta * 5;
    exports.horizontalContinuousXData = {
        "0": exports.horizontalStart,
        "20": exports.horizontalStart + exports.horizontalDelta,
        "40": exports.horizontalStart + exports.horizontalDelta * 2,
        "60": exports.horizontalStart + exports.horizontalDelta * 3,
        "80": exports.horizontalStart + exports.horizontalDelta * 4,
        '100': exports.horizontalStart + exports.horizontalDelta * 5
    };
    exports.horizontalContinuousXDataUntranslate = {
        "70": 0,
        "170": 20,
        "270": 40,
        "370": 60,
        "470": 80,
        "570": 100,
    };
    exports.horizontalContinuousXDataSpecialCases = {
        'canvas_position_start': exports.horizontalStart,
        'canvas_position_end': exports.horizontalEnd,
        'canvas_position_default': exports.horizontalStart,
        'canvas_position_left': exports.horizontalStart,
        'canvas_position_center': exports.horizontalStart + exports.horizontalDelta * 2.5,
        'canvas_position_right': exports.horizontalEnd
    };
    exports.horizontalContinuousYData = {
        '0': exports.verticalStart,
        '20': exports.verticalStart + exports.verticalDelta,
        '40': exports.verticalStart + exports.verticalDelta * 2,
        '60': exports.verticalStart + exports.verticalDelta * 3,
        '80': exports.verticalStart + exports.verticalDelta * 4,
        '100': exports.verticalStart + exports.verticalDelta * 5
    };
    exports.horizontalContinuousYDataSpecialCases = {
        'canvas_position_start': exports.verticalEnd,
        'canvas_position_end': exports.verticalStart,
        'canvas_position_default': exports.verticalStart,
        'canvas_position_bottom': exports.verticalStart,
        'canvas_position_center': exports.verticalStart + exports.verticalDelta * 2.5,
        'canvas_position_top': exports.verticalEnd
    };
    exports.horizontalCategoryDelta = 125;
    exports.horizontalCategoryStart = canvas.left + exports.horizontalCategoryDelta / 2;
    exports.horizontalCategoryEnd = exports.horizontalCategoryStart + exports.horizontalDelta * 3;
    exports.horizontalCategoryTick = exports.horizontalCategoryDelta / 2;
    exports.verticalCategoryDelta = 85;
    exports.verticalCategoryStart = 0 + exports.verticalCategoryDelta / 2;
    exports.verticalCategoryEnd = exports.verticalStart + exports.verticalDelta * 3;
    exports.verticalCategoryTick = exports.verticalCategoryDelta / 2;
    exports.continuousTranslatorDataX = {
        translate: exports.horizontalContinuousXData,
        specialCases: exports.horizontalContinuousXDataSpecialCases,
        untranslate: exports.horizontalContinuousXDataUntranslate,
        interval: 20
    };
    exports.continuousTranslatorDataY = {
        translate: exports.horizontalContinuousYData,
        specialCases: exports.horizontalContinuousYDataSpecialCases
    };
    exports.horizontalCategoryXData = {
        'First': exports.horizontalCategoryStart,
        'Second': exports.horizontalCategoryStart + exports.horizontalCategoryDelta,
        'Third': exports.horizontalCategoryStart + exports.horizontalCategoryDelta * 2,
        'Fourth': exports.horizontalCategoryStart + exports.horizontalCategoryDelta * 3
    };
    exports.horizontalCategoryXDataUntranslate = {
        70: 'First',
        170: 'Second',
        270: 'Third',
        370: 'Fourth'
    };
    exports.horizontalCategoryXDataSpecialCases = {
        'canvas_position_start': exports.horizontalStart,
        'canvas_position_end': exports.horizontalEnd,
        'canvas_position_default': exports.horizontalStart,
        'canvas_position_left': exports.horizontalStart,
        'canvas_position_center': exports.horizontalStart + exports.horizontalDelta * 2.5,
        'canvas_position_right': exports.horizontalEnd
    };
    exports.horizontalCategoryYData = {
        'First': exports.verticalCategoryStart,
        'Second': exports.verticalCategoryStart + exports.verticalCategoryDelta,
        'Third': exports.verticalCategoryStart + exports.verticalCategoryDelta * 2,
        'Fourth': exports.verticalCategoryStart + exports.verticalCategoryDelta * 3
    };
    exports.horizontalCategoryYDataSpecialCases = {
        'canvas_position_start': exports.verticalStart,
        'canvas_position_end': exports.verticalEnd,
        'canvas_position_default': exports.verticalStart,
        'canvas_position_bottom': exports.verticalStart,
        'canvas_position_center': exports.verticalStart + exports.verticalDelta * 2.5,
        'canvas_position_top': exports.verticalEnd
    };
    exports.categoriesHorizontalTranslatorDataX = {
        translate: exports.horizontalCategoryXData,
        specialCases: exports.horizontalCategoryXDataSpecialCases,
        interval: exports.horizontalCategoryDelta,
        untranslate: exports.horizontalCategoryXDataUntranslate
    };
    exports.categoriesHorizontalTranslatorDataY = {
        translate: exports.horizontalContinuousYData,
        specialCases: exports.horizontalContinuousYDataSpecialCases
    };
    exports.categoriesVerticalTranslatorDataX = {
        translate: exports.horizontalContinuousXData,
        specialCases: exports.horizontalContinuousXDataSpecialCases
    };
    exports.categoriesVerticalTranslatorDataY = {
        translate: exports.horizontalCategoryYData,
        specialCases: exports.horizontalCategoryYDataSpecialCases,
        interval: exports.verticalCategoryDelta
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
            //TODO: make sure we really need it
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
            //TODO: make sure we really need it
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

    exports.createHorizontalAxis = function createHorizontalAxis(translatorData, orthogonalTranslatorData, allOptions) {
        return createAxis(translatorData, orthogonalTranslatorData, $.extend(true, {}, defaultAxisXOptions, { incidentOccurred: vizMocks.incidentOccurred() }, allOptions), true);
    };
    exports.createVerticalAxis = function createVerticalAxis(translatorData, orthogonalTranslatorData, allOptions) {
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
                return new exports.MockTranslator(data || {});
            }
        }


        renderer = new vizMocks.Renderer();

        translatorData = $.extend({}, translatorData);
        orthogonalTranslatorData = $.extend({}, orthogonalTranslatorData);

        var translator = createTranslator(translatorData, allOptions),
            orthogonalTranslator = createTranslator(orthogonalTranslatorData, allOptions),
            mergedOptions = $.extend(true, {}, allOptions),
            axis;

        axis = new axisModule.Axis({
            renderer: renderer,
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
        //we emulate this call to allow testing partial draw methods (such as drawTicks)
        //in production it"s called from axis.draw() method
        axis._initAxisPositions(axis);
        return axis;
    }

    exports.insertMockFactory = function insertMockFactory() {
        seriesMockData = {
            series: [],
            args: [],
            currentSeries: 0
        };

        pointsMockData = {
            points: [],
            args: []
        };

        pointModule.Point = function(series, data, options) {
            var opt = $.extend(true, {}, data, options);
            opt.series = series;
            return new exports.MockPoint(opt);
        };

        seriesModule.Series = function(renderSettings, options) {
            seriesMockData.args.push(arguments);
            if(seriesMockData.series.length > seriesMockData.currentSeries) {
                var series = seriesMockData.series[seriesMockData.currentSeries++];
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
        };


        loadingIndicatorModule.LoadingIndicator = function(parameters) {
            return new vizMocks.LoadingIndicator(parameters);
        };

        axisModule && (axisModule.Axis = function(parameters) {
            var axis = new MockAxis(parameters);
            axis.draw = sinon.spy(axis.draw);
            return axis;
        });
    };

    exports.resetMockFactory = function resetMockFactory() {
        seriesMockData = null;
        pointsMockData = null;
    };

    exports.setupSeriesFamily = function() {
        seriesFamilyModule.SeriesFamily = function(options) {
            return new MockSeriesFamily(options);
        };
    };
    //////  Translator


    exports.MockTranslator = function(data) {
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
            getVisibleCategories: function() {

            },
            getMinBarSize: function() {
                return arguments[0];
            },
            reinit: commonUtils.noop
        };
    };

    exports.MockAngularTranslator = function(data) {
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

    /// Mock series
    exports.MockSeries = function MockSeries(options) {
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
            pointsByArgument: (function() {
                var pointsByArgument = {};

                $.each(options.points, function(_, p) {
                    if(p.argument && p.argument.valueOf()) {
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
            getRangeData: function(visibleArea, calcInterval) {
                if(options.visible === false) {
                    return { arg: {}, val: {} };
                }
                var range = $.extend(true, {}, options.range || {});

                range.arg = range.arg || {};
                range.val = range.val || {};
                range.viewport = range.viewport || {};

                var minSelector = "minVisible",
                    maxSelector = "maxVisible";

                options.calcInterval = calcInterval;
                this.calcInterval = calcInterval;

                visibleArea = visibleArea || {};

                visibleArea.minArg && (range.arg[minSelector] = visibleArea.minArg);
                visibleArea.maxArg && (range.arg[maxSelector] = visibleArea.maxArg);
                visibleArea.minVal && (range.val[minSelector] = visibleArea.minVal);
                visibleArea.maxVal && (range.val[maxSelector] = visibleArea.maxVal);

                return range;
            },
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
            arrangePoints: function() {
                this.pointsWereArranged = true;
                this.arrangePointsArgs = $.makeArray(arguments);
            },
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
            resamplePoints: sinon.spy(function() {
                this.resampled = true;
            }),
            sort: commonUtils.noop,
            updateTemplateFieldNames: function() {
                this.updatedFields = true;
            },
            getTemplateFields: function() {
                return [{ originalField: this._options.valueField, templateField: this._options.valueField + this.name },
                    { originalField: this._options.tagField, templateField: this._options.tagField + this.name },
                { originalField: this._options.sizeField, templateField: this._options.sizeField + this.name }];
            },
            isUpdated: commonUtils.isDefined(options.isUpdated) ? options.isUpdated : true,

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
            correctPosition: sinon.spy(),
            correctRadius: sinon.spy(),
            updateDataType: sinon.spy(),
            getViewport: sinon.stub().returns({})
        };
    };


    exports.MockPoint = Class.inherit(
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
                    hide: function() {
                        this._isLabelHidden = true;
                    }
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
                    //emulate real point behavior
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
                //correct angles?...
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
            resetHoles: function() { }
        });


    var MockAxis = exports.MockAxis = function(renderOptions) {
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
                this._tickManager = {
                    _tickInterval: this._options.mockTickInterval,
                    getTickInterval: function() {
                        return this._tickInterval;
                    }
                };
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
                return this._options && this._options.mockTranslator || new exports.MockTranslator(businessRange);
            },
            _isHorizontal: renderOptions.isHorizontal,
            _incidentOccurred: renderOptions.incidentOccurred,
            _stripsGroup: renderOptions.stripsGroup,
            _labelAxesGroup: renderOptions.labelAxesGroup,
            _constantLinesGroup: renderOptions.constantLinesGroup,
            axesContainerGroup: renderOptions.axesContainerGroup,
            gridGroup: renderOptions.gridGroup,
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
            zoom: sinon.spy(function(min, max) {
                return { min: min, max: max };
            }),
            getViewport: sinon.stub().returns({}),
            resetZoom: function() {

            },
            resetTypes: sinon.spy()
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

    exports.checkTextSpecial = function(i, text, x, y, attr) {
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

    exports.commonMethodsForTests = {
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

    return exports;

}));
