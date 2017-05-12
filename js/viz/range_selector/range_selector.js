"use strict";

var $ = require("jquery"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    vizUtils = require("../core/utils"),
    adjustValue = vizUtils.adjustValue,
    dateUtils = require("../../core/utils/date"),
    addInterval = dateUtils.addInterval,
    dateToMilliseconds = dateUtils.dateToMilliseconds,
    getSequenceByInterval = dateUtils.getSequenceByInterval,
    rangeModule = require("../translators/range"),
    translator2DModule = require("../translators/translator2d"),
    axisModule = require("../axes/base_axis"),
    patchFontOptions = vizUtils.patchFontOptions,
    parseUtils = require("../components/parse_utils"),
    _normalizeEnum = vizUtils.normalizeEnum,
    formatHelper = require("../../format_helper"),
    commonModule = require("./common"),
    slidersControllerModule = require("./sliders_controller"),
    trackerModule = require("./tracker"),
    rangeViewModule = require("./range_view"),
    seriesDataSourceModule = require("./series_data_source"),
    themeManagerModule = require("./theme_manager"),
    tickManagerModule = require("../axes/base_tick_manager"),
    log = require("../../core/errors").log,

    _isDefined = commonUtils.isDefined,
    _isNumber = commonUtils.isNumber,
    _isDate = commonUtils.isDate,
    _max = Math.max,
    _ceil = Math.ceil,
    _floor = Math.floor,

    START_VALUE = "startValue",
    END_VALUE = "endValue",
    DATETIME = "datetime",
    SELECTED_RANGE = "selectedRange",
    VALUE = "value",
    DISCRETE = "discrete",
    SEMIDISCRETE = "semidiscrete",
    STRING = "string",
    SELECTED_RANGE_CHANGED = SELECTED_RANGE + "Changed",
    VALUE_CHANGED = VALUE + "Changed",
    CONTAINER_BACKGROUND_COLOR = "containerBackgroundColor",
    SLIDER_MARKER = "sliderMarker",
    OPTION_BACKGROUND = "background",
    LOGARITHMIC = "logarithmic",
    INVISIBLE_POS = -1000,
    SEMIDISCRETE_GRID_SPACING_FACTOR = 50,

    logarithmBase = 10;

// This method exists only to wrap "{}, {}" ugliness
function createTranslator() {
    return new translator2DModule.Translator2D({}, {});
}

// This method exists only to wrap "left-width-isHorizontal" ugliness
function updateTranslator(translator, valueRange, screenRange, interval) {
    translator.update(valueRange, { left: screenRange[0], width: screenRange[1] }, { isHorizontal: true, interval: interval });
}

function calculateMarkerHeight(renderer, value, sliderMarkerOptions) {
    var formattedText = (value === undefined ? commonModule.consts.emptySliderMarkerText : commonModule.formatValue(value, sliderMarkerOptions)),
        textBBox = getTextBBox(renderer, formattedText, sliderMarkerOptions.font);
    return _ceil(textBBox.height) + 2 * sliderMarkerOptions.paddingTopBottom + commonModule.consts.pointerSize;
}

function calculateScaleLabelHalfWidth(renderer, value, scaleOptions) {
    var formattedText = commonModule.formatValue(value, scaleOptions.label),
        textBBox = getTextBBox(renderer, formattedText, scaleOptions.label.font);

    return _ceil(textBBox.width / 2);
}

function parseValue(value) {
    return { startValue: value[0], endValue: value[1] };
}

function parseSelectedRange(selectedRange) {
    return [selectedRange.startValue, selectedRange.endValue];
}

function parseSliderMarkersPlaceholderSize(placeholderSize) {
    var placeholderWidthLeft,
        placeholderWidthRight,
        placeholderHeight;

    if(_isNumber(placeholderSize)) {
        placeholderWidthLeft = placeholderWidthRight = placeholderHeight = placeholderSize;
    } else if(placeholderSize) {
        if(_isNumber(placeholderSize.height)) {
            placeholderHeight = placeholderSize.height;
        }
        if(_isNumber(placeholderSize.width)) {
            placeholderWidthLeft = placeholderWidthRight = placeholderSize.width;
        } else if(placeholderSize.width) {
            if(_isNumber(placeholderSize.width.left)) {
                placeholderWidthLeft = placeholderSize.width.left;
            }
            if(_isNumber(placeholderSize.width.right)) {
                placeholderWidthRight = placeholderSize.width.right;
            }
        }
    } else {
        return null;
    }

    return {
        widthLeft: placeholderWidthLeft,
        widthRight: placeholderWidthRight,
        height: placeholderHeight
    };
}

function calculateIndents(renderer, scale, sliderMarkerOptions, indentOptions) {
    var leftMarkerHeight,
        leftScaleLabelWidth = 0,
        rightScaleLabelWidth = 0,
        rightMarkerHeight,
        placeholderWidthLeft = 0,
        placeholderWidthRight = 0,
        placeholderHeight,
        parsedPlaceholderSize;

    indentOptions = indentOptions || {};
    parsedPlaceholderSize = parseSliderMarkersPlaceholderSize(sliderMarkerOptions.placeholderSize);
    if(parsedPlaceholderSize && indentOptions.left === undefined && indentOptions.right === undefined) {   //for deprecated in 15.1 sliderMarker.placeholderSize
        placeholderWidthLeft = parsedPlaceholderSize.widthLeft;
        placeholderWidthRight = parsedPlaceholderSize.widthRight;
    } else {
        placeholderWidthLeft = indentOptions.left;
        placeholderWidthRight = indentOptions.right;
    }

    if(parsedPlaceholderSize && sliderMarkerOptions.placeholderHeight === undefined) {    //for deprecated in 15.1 sliderMarker.placeholderSize.height
        placeholderHeight = parsedPlaceholderSize.height;
    } else {
        placeholderHeight = sliderMarkerOptions.placeholderHeight;
    }

    if(sliderMarkerOptions.visible) {
        leftMarkerHeight = calculateMarkerHeight(renderer, scale.startValue, sliderMarkerOptions);
        rightMarkerHeight = calculateMarkerHeight(renderer, scale.endValue, sliderMarkerOptions);
        if(placeholderHeight === undefined) {
            placeholderHeight = _max(leftMarkerHeight, rightMarkerHeight);
        }
    }

    if(scale.label.visible) {
        leftScaleLabelWidth = calculateScaleLabelHalfWidth(renderer, scale.startValue, scale);
        rightScaleLabelWidth = calculateScaleLabelHalfWidth(renderer, scale.endValue, scale);
    }
    placeholderWidthLeft = placeholderWidthLeft !== undefined ? placeholderWidthLeft : leftScaleLabelWidth;
    placeholderWidthRight = (placeholderWidthRight !== undefined ? placeholderWidthRight : rightScaleLabelWidth) || 1;  //T240698

    return {
        left: placeholderWidthLeft,
        right: placeholderWidthRight,
        top: placeholderHeight || 0,
        bottom: 0
    };
}

function calculateValueType(firstValue, secondValue) {
    var typeFirstValue = $.type(firstValue),
        typeSecondValue = $.type(secondValue),
        validType = function(type) {
            return typeFirstValue === type || typeSecondValue === type;
        };

    return validType("date") ? DATETIME : validType("number") ? "numeric" : validType(STRING) ? STRING : "";
}

function showScaleMarkers(scaleOptions) {
    return scaleOptions.valueType === DATETIME && scaleOptions.marker.visible;
}

function updateTranslatorRangeInterval(translatorRange, scaleOptions) {
    var intervalX = scaleOptions.minorTickInterval || scaleOptions.tickInterval;
    if(scaleOptions.valueType === "datetime") {
        intervalX = dateUtils.dateToMilliseconds(intervalX);
    }
    translatorRange.addRange({ interval: intervalX });
}

function checkLogarithmicOptions(options, defaultLogarithmBase, incidentOccurred) {
    var logarithmBase;

    if(!options) {
        return;
    }

    logarithmBase = options.logarithmBase;
    if(options.type === LOGARITHMIC && logarithmBase <= 0 || (logarithmBase && !_isNumber(logarithmBase))) {
        options.logarithmBase = defaultLogarithmBase;
        incidentOccurred("E2104");
    } else if(options.type !== LOGARITHMIC) {
        options.logarithmBase = undefined;
    }
}

function calculateScaleAreaHeight(renderer, scaleOptions, visibleMarkers) {
    var textBBox,
        value = "0",
        formatObject = {
            value: 0,
            valueText: value
        },
        labelScaleOptions = scaleOptions.label,
        markerScaleOptions = scaleOptions.marker,
        customizeText = labelScaleOptions.customizeText,
        placeholderHeight = scaleOptions.placeholderHeight,
        text = commonUtils.isFunction(customizeText) ? customizeText.call(formatObject, formatObject) : value,
        visibleLabels = labelScaleOptions.visible;

    if(placeholderHeight) {
        return placeholderHeight;
    } else {
        textBBox = getTextBBox(renderer, text, labelScaleOptions.font);
        return (visibleLabels ? labelScaleOptions.topIndent + textBBox.height : 0) +
            (visibleMarkers ? markerScaleOptions.topIndent + markerScaleOptions.separatorHeight : 0);
    }
}

function getNextTickInterval(tickInterval, minorTickInterval, isDateType) {
    if(!tickInterval) {
        tickInterval = minorTickInterval;
    } else {
        if(isDateType) {
            tickInterval = dateUtils.getNextDateUnit(tickInterval);
        } else {
            tickInterval += minorTickInterval;
        }
    }

    return tickInterval;
}

function calculateTickIntervalsForSemidiscreteScale(scaleOptions, min, max, screenDelta) {
    var minorTickInterval = scaleOptions.minorTickInterval,
        tickInterval = scaleOptions.tickInterval,
        interval,
        isDateType = scaleOptions.valueType === "datetime",
        gridSpacingFactor = scaleOptions.axisDivisionFactor || {},
        tickCountByInterval,
        tickCountByScreen;

    if(!tickInterval) {
        do {
            interval = getNextTickInterval(tickInterval, minorTickInterval, isDateType);

            if(tickInterval !== interval) {
                tickInterval = interval;
            } else {
                break;
            }

            if(isDateType) {
                interval = dateToMilliseconds(tickInterval);
            }

            tickCountByInterval = _ceil((max - min) / interval);
            tickCountByScreen = _floor(screenDelta / (gridSpacingFactor[tickInterval] || SEMIDISCRETE_GRID_SPACING_FACTOR)) || 1;
        } while(interval && tickCountByInterval > tickCountByScreen);
    }

    return {
        tickInterval: tickInterval,
        minorTickInterval: minorTickInterval,
        bounds: {
            minVisible: min, maxVisible: max
        },
        ticks: []
    };
}

function updateTickIntervals(scaleOptions, screenDelta, incidentOccurred, range) {
    var result,
        min = _isDefined(range.minVisible) ? range.minVisible : range.min,
        max = _isDefined(range.maxVisible) ? range.maxVisible : range.max,
        categoriesInfo = scaleOptions._categoriesInfo,
        tickManager,
        ticks;

    if(scaleOptions.type === SEMIDISCRETE) {
        result = calculateTickIntervalsForSemidiscreteScale(scaleOptions, min, max, screenDelta);
    } else {
        tickManager = new tickManagerModule.TickManager({
            axisType: scaleOptions.type,
            dataType: scaleOptions.valueType
        }, {
            min: min,
            max: max,
            screenDelta: screenDelta,
            customTicks: categoriesInfo && categoriesInfo.categories
        }, {
            labelOptions: {
            },
            boundCoef: 1,
            minorTickInterval: scaleOptions.minorTickInterval,
            tickInterval: scaleOptions.tickInterval,
            incidentOccurred: incidentOccurred,
            base: scaleOptions.logarithmBase,
            showMinorTicks: true,
            withMinorCorrection: true,
            stick: range.stick !== false
        });
        ticks = tickManager.getTicks(true); //Important to call this method before those below

        result = {
            tickInterval: tickManager.getTickInterval(),
            minorTickInterval: tickManager.getMinorTickInterval(),
            bounds: tickManager.getTickBounds(),
            ticks: ticks
        };
    }

    return result;
}

function calculateTranslatorRange(seriesDataSource, scaleOptions) {
    var minValue, maxValue,
        inverted = false,
        isEqualDates,
        startValue = scaleOptions.startValue,
        endValue = scaleOptions.endValue,
        categories,
        categoriesInfo,
        // TODO: There should be something like "seriesDataSource.getArgumentRange()"
        translatorRange = seriesDataSource ? seriesDataSource.getBoundRange().arg : new rangeModule.Range(),
        rangeForCategories,
        isDate = scaleOptions.valueType === "datetime",
        minRange = scaleOptions.minRange;

    if(scaleOptions.type === DISCRETE) {
        rangeForCategories = new rangeModule.Range({
            minVisible: startValue,
            maxVisible: endValue
        });

        rangeForCategories.addRange(translatorRange);
        translatorRange = rangeForCategories;

        categories = seriesDataSource ? seriesDataSource.argCategories : (scaleOptions.categories || (!seriesDataSource) && startValue && endValue && [startValue, endValue]);
        categories = categories || [];
        scaleOptions._categoriesInfo = categoriesInfo = vizUtils.getCategoriesInfo(categories, startValue || categories[0], endValue || categories[categories.length - 1]);
    }

    if(scaleOptions.type === SEMIDISCRETE) {
        startValue = scaleOptions.startValue = correctValueByInterval(scaleOptions.startValue, isDate, minRange);
        endValue = scaleOptions.endValue = correctValueByInterval(scaleOptions.endValue, isDate, minRange);

        translatorRange.minVisible = correctValueByInterval(translatorRange.minVisible, isDate, minRange);
        translatorRange.maxVisible = correctValueByInterval(translatorRange.maxVisible, isDate, minRange);

        translatorRange.min = correctValueByInterval(translatorRange.min, isDate, minRange);
        translatorRange.max = correctValueByInterval(translatorRange.max, isDate, minRange);
    }

    if(_isDefined(startValue) && _isDefined(endValue)) {
        inverted = categoriesInfo ? categoriesInfo.inverted : startValue > endValue;
        minValue = categoriesInfo ? categoriesInfo.start : inverted ? endValue : startValue;
        maxValue = categoriesInfo ? categoriesInfo.end : inverted ? startValue : endValue;
    } else if(_isDefined(startValue) || _isDefined(endValue)) {
        minValue = startValue;
        maxValue = endValue;
    } else if(categoriesInfo) {
        minValue = categoriesInfo.start;
        maxValue = categoriesInfo.end;
    }

    isEqualDates = _isDate(minValue) && _isDate(maxValue) && (minValue.getTime() === maxValue.getTime());
    if((scaleOptions.type === SEMIDISCRETE) || ((minValue !== maxValue) && !isEqualDates)) {
        translatorRange.addRange({
            invert: inverted,
            min: minValue,
            max: maxValue,
            minVisible: minValue,
            maxVisible: maxValue,
            dataType: scaleOptions.valueType
        });
    }

    translatorRange.addRange({
        categories: !seriesDataSource ? categories : undefined,
        base: scaleOptions.logarithmBase,
        axisType: scaleOptions.type
    });
    seriesDataSource && translatorRange.sortCategories(categories);

    // Setting stub data is required only for axis.
    if(!translatorRange.isDefined()) {
        if(isEqualDates) {
            scaleOptions.valueType = "numeric";
        }
        translatorRange.setStubData(scaleOptions.valueType);
    }
    return translatorRange;
}

function startEndNotDefined(start, end) {
    return !_isDefined(start) || !_isDefined(end);
}

function getTextBBox(renderer, text, fontOptions) {
    var textElement = renderer.text(text, INVISIBLE_POS, INVISIBLE_POS).css(patchFontOptions(fontOptions)).append(renderer.root);

    var textBBox = textElement.getBBox();
    textElement.remove();
    return textBBox;
}

function getDateMarkerVisibilityChecker(screenDelta) {
    return function(isDateScale, isMarkerVisible, min, max, tickInterval) {
        if(isMarkerVisible && isDateScale) {
            if(tickInterval.years || tickInterval.months >= 6 ||
                (screenDelta / SEMIDISCRETE_GRID_SPACING_FACTOR < (_ceil((max - min) / dateToMilliseconds("year")) + 1))) {
                isMarkerVisible = false;
            }
        }
        return isMarkerVisible;
    };
}

function updateScaleOptions(scaleOptions, seriesDataSource, translatorRange, tickIntervalsInfo, checkDateMarkerVisibility) {
    var bounds,
        isEmptyInterval,
        categoriesInfo = scaleOptions._categoriesInfo,
        intervals,
        isDateTime = scaleOptions.valueType === DATETIME;

    if(seriesDataSource && !seriesDataSource.isEmpty() && !translatorRange.stubData) {
        bounds = tickIntervalsInfo.bounds;
        translatorRange.addRange(bounds);
        scaleOptions.startValue = translatorRange.invert ? bounds.maxVisible : bounds.minVisible;
        scaleOptions.endValue = translatorRange.invert ? bounds.minVisible : bounds.maxVisible;
    }

    scaleOptions.marker.visible = checkDateMarkerVisibility(isDateTime && scaleOptions.type.indexOf(DISCRETE) === -1, scaleOptions.marker.visible, scaleOptions.startValue, scaleOptions.endValue, tickIntervalsInfo.tickInterval);

    if(categoriesInfo) {
        scaleOptions.startValue = categoriesInfo.start;
        scaleOptions.endValue = categoriesInfo.end;
    }
    if(scaleOptions.type.indexOf(DISCRETE) === -1) {
        isEmptyInterval = ((_isDate(scaleOptions.startValue) && _isDate(scaleOptions.endValue) && (scaleOptions.startValue.getTime() === scaleOptions.endValue.getTime())) || (scaleOptions.startValue === scaleOptions.endValue));
    }
    scaleOptions.isEmpty = startEndNotDefined(scaleOptions.startValue, scaleOptions.endValue) || isEmptyInterval;

    if(scaleOptions.isEmpty) {
        scaleOptions.startValue = scaleOptions.endValue = undefined;
    } else {
        scaleOptions.minorTickInterval = tickIntervalsInfo.minorTickInterval;
        scaleOptions.tickInterval = tickIntervalsInfo.tickInterval;
        if(isDateTime && (!_isDefined(scaleOptions.label.format) || (scaleOptions.type === SEMIDISCRETE && scaleOptions.minorTickInterval !== scaleOptions.tickInterval))) {
            if(scaleOptions.type === DISCRETE) {
                scaleOptions.label.format = formatHelper.getDateFormatByTicks(tickIntervalsInfo.ticks);
            } else {
                if(!scaleOptions.marker.visible) {
                    scaleOptions.label.format = formatHelper.getDateFormatByTickInterval(scaleOptions.startValue, scaleOptions.endValue, scaleOptions.tickInterval);
                } else {
                    scaleOptions.label.format = dateUtils.getDateFormatByTickInterval(scaleOptions.tickInterval);
                }
            }
        }
    }

    if(scaleOptions.type === SEMIDISCRETE) {
        intervals = getIntervalCustomTicks(scaleOptions);
        scaleOptions.customMinorTicks = intervals.altIntervals;
        scaleOptions.customTicks = intervals.intervals;
        scaleOptions.customBoundTicks = [scaleOptions.customTicks[0]];
    }
}

function prepareScaleOptions(scaleOption, seriesDataSource, incidentOccurred) {
    var parsedValue = 0,
        valueType = parseUtils.correctValueType(_normalizeEnum(scaleOption.valueType)),
        parser,
        validateStartEndValues = function(field, parser) {
            var messageToIncidentOccurred = field === START_VALUE ? "start" : "end";

            if(_isDefined(scaleOption[field])) {
                parsedValue = parser(scaleOption[field]);
                if(_isDefined(parsedValue)) {
                    scaleOption[field] = parsedValue;
                } else {
                    scaleOption[field] = undefined;
                    incidentOccurred("E2202", [messageToIncidentOccurred]);
                }
            }
        };

    if(seriesDataSource) {
        valueType = seriesDataSource.getCalculatedValueType() || valueType;
    }

    if(!valueType) {
        valueType = calculateValueType(scaleOption.startValue, scaleOption.endValue) || "numeric";
    }

    if(valueType === STRING || scaleOption.categories) {
        scaleOption.type = DISCRETE;
        valueType = STRING;
    }

    scaleOption.valueType = valueType;
    parser = parseUtils.getParser(valueType);

    validateStartEndValues(START_VALUE, parser);
    validateStartEndValues(END_VALUE, parser);

    checkLogarithmicOptions(scaleOption, logarithmBase, incidentOccurred);
    if(!scaleOption.type) {
        scaleOption.type = "continuous";
    }

    //DEPRECATED IN 15_2 start
    scaleOption.tickInterval === undefined && (scaleOption.tickInterval = scaleOption.majorTickInterval);
    scaleOption.minorTick.visible && (scaleOption.minorTick.visible = scaleOption.showMinorTicks);
    //DEPRECATED IN 15_2 end

    scaleOption.parser = parser;
    if(scaleOption.type === SEMIDISCRETE) {
        scaleOption.minorTick.visible = false;
        scaleOption.minorTickInterval = scaleOption.minRange;
        scaleOption.marker.visible = false;
        scaleOption.maxRange = undefined;
    }
    return scaleOption;
}

function correctValueByInterval(value, isDate, interval) {
    if(_isDefined(value)) {
        value = isDate
            ? dateUtils.correctDateWithUnitBeginning(new Date(value), interval)
            : adjustValue(_floor(value / interval) * interval);
    }
    return value;
}

function getIntervalCustomTicks(options) {
    var min = options.startValue,
        max = options.endValue,
        isDate = options.valueType === "datetime",
        tickInterval = options.tickInterval,
        res = {
            intervals: []
        };

    if(!_isDefined(min) || !_isDefined(max)) {
        return res;
    }

    res.intervals = getSequenceByInterval(min, max, options.minorTickInterval);

    if(tickInterval !== options.minorTickInterval) {
        res.altIntervals = res.intervals;

        min = correctValueByInterval(min, isDate, tickInterval);
        max = correctValueByInterval(max, isDate, tickInterval);

        res.intervals = getSequenceByInterval(min, max, tickInterval);
    }

    return res;
}

var dxRangeSelector = require("../core/base_widget").inherit({
    _eventsMap: {
        "onSelectedRangeChanged": { name: SELECTED_RANGE_CHANGED }, //deprecated in 16_2
        "onValueChanged": { name: VALUE_CHANGED }
    },

    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        $.extend(this._deprecatedOptions, {
            "sliderMarker.padding": {
                since: "15.1", message: "Use the 'paddingTopBottom' and 'paddingLeftRight' options instead"
            },
            "sliderMarker.placeholderSize": {
                since: "15.1", message: "Use the 'placeholderHeight' and 'indent' options instead"
            },
            "scale.majorTickInterval": {
                since: "15.2", message: "Use the 'tickInterval' options instead"
            },
            "scale.showMinorTicks": {
                since: "15.2", message: "Use the 'minorTick.visible' options instead"
            },
            "selectedRange": {
                since: "16.2", message: "Use the 'value' option instead"
            },
            "onSelectedRangeChanged": {
                since: "16.2", message: "Use the 'onValueChanged' option instead"
            },
            "behavior.callSelectedRangeChanged": {
                since: "16.2", message: "Use the 'behavior.callValueChanged' option instead"
            }
        });
    },

    _rootClassPrefix: "dxrs",

    _rootClass: "dxrs-range-selector",

    _dataIsReady: function() {
        return this._dataIsLoaded();
    },

    _initialChanges: ["DATA_SOURCE", "SELECTED_RANGE", "VALUE", "DISABLED"],

    _themeDependentChanges: ["MOSTLY_TOTAL"],

    _initCore: function() {
        var that = this,
            renderer = that._renderer,
            root = renderer.root,
            rangeViewGroup,
            slidersGroup,
            scaleGroup,
            trackersGroup;

        // TODO: Move it to the SlidersEventManager
        root.css({
            "touch-action": "pan-y", "-ms-touch-action": "pan-y"
        });

        // RangeContainer
        that._clipRect = renderer.clipRect();   // TODO: Try to remove it
        // TODO: Groups could be created by the corresponding components
        rangeViewGroup = renderer.g().attr({ "class": "dxrs-view" }).append(root);
        slidersGroup = renderer.g().attr({ "class": "dxrs-slidersContainer", "clip-path": that._clipRect.id }).append(root);
        scaleGroup = renderer.g().attr({ "class": "dxrs-scale", "clip-path": that._clipRect.id }).append(root);
        trackersGroup = renderer.g().attr({ "class": "dxrs-trackers" }).append(root);
        that._translator = createTranslator();
        that._rangeView = new rangeViewModule.RangeView({
            renderer: renderer,
            root: rangeViewGroup,
            translator: that._translator
        });

        that._slidersController = new slidersControllerModule.SlidersController({
            renderer: renderer,
            root: slidersGroup,
            trackersGroup: trackersGroup,
            updateSelectedRange: function(range, lastSelectedRange) {
                if(!that._rangeOption) {
                    that._suppressDeprecatedWarnings();
                    that.option(SELECTED_RANGE, range);
                    that._resumeDeprecatedWarnings();
                    that.option(VALUE, parseSelectedRange(range));
                }
                //event is deprecated and should not be triggered without the need
                if(that._options.onSelectedRangeChanged || that.hasEvent("selectedRangeChanged")) {
                    // Event target has to be copied (T226597)
                    that._eventTrigger(SELECTED_RANGE_CHANGED, { startValue: range.startValue, endValue: range.endValue }); //deprecated in 16_2
                }

                that._eventTrigger(VALUE_CHANGED, {
                    value: parseSelectedRange(range),
                    previousValue: parseSelectedRange(lastSelectedRange)
                });
            },
            translator: that._translator
        });
        that._axis = new AxisWrapper({
            renderer: renderer,
            root: scaleGroup,
            updateSelectedRange: function(range) { that.setValue(parseSelectedRange(range)); },
            translator: that._translator
        });
        that._tracker = new trackerModule.Tracker({
            renderer: renderer,
            controller: that._slidersController
        });
    },

    _getDefaultSize: function() {
        return {
            width: 400, height: 160
        };
    },

    _disposeCore: function() {
        this._axis.dispose();
        this._slidersController.dispose();
        this._tracker.dispose();
    },

    _createThemeManager: function() {
        return new themeManagerModule.ThemeManager();
    },

    _applySize: function(rect) {
        this._clientRect = rect.slice();
        this._change(["MOSTLY_TOTAL"]);
    },

    _optionChangesMap: {
        scale: "SCALE",
        selectedRange: "SELECTED_RANGE",
        value: "VALUE",
        dataSource: "DATA_SOURCE",
        disabled: "DISABLED"
    },

    _optionChangesOrder: ["SCALE", "DATA_SOURCE"],

    _change_SCALE: function() {
        this._change(["MOSTLY_TOTAL"]);
    },

    _change_DATA_SOURCE: function() {
        if(this._initialized || this._options.dataSource) {
            this._options[SELECTED_RANGE] = this._options[VALUE] = null;
            this._updateDataSource();
        }
    },

    _customChangesOrder: ["MOSTLY_TOTAL", "SELECTED_RANGE", "VALUE", "SLIDER_SELECTION", "DISABLED"],

    _change_MOSTLY_TOTAL: function() {
        this._applyMostlyTotalChange();
    },

    _change_SLIDER_SELECTION: function() {
        var that = this,
            range = that._options[SELECTED_RANGE],
            value = that._options[VALUE];

        that._slidersController.setSelectedRange(value ? parseValue(value) : (range && range));
    },

    _change_SELECTED_RANGE: function() {
        var that = this,
            option = that._rangeOption && that._rangeOption[SELECTED_RANGE];
        if(option) {
            that._options[SELECTED_RANGE] = option;
            that._validateRange(option.startValue, option.endValue);
            that.setValue(parseSelectedRange(option));
        }
    },

    _change_VALUE: function() {
        var that = this,
            option = that._rangeOption && that._rangeOption[VALUE];
        if(option) {
            that._options[VALUE] = option;
            that._validateRange(option[0], option[1]);
            that.setValue(option);
        }
    },

    _change_DISABLED: function() {
        var renderer = this._renderer,
            root = renderer.root;
        if(this.option("disabled")) {
            root.attr({
                "pointer-events": "none",
                filter: renderer.getGrayScaleFilter().id
            });
        } else {
            root.attr({
                "pointer-events": null,
                filter: null
            });
        }
    },

    _validateRange: function(start, end) {
        var that = this;
        if(start !== null && !that._translator.isValid(start) ||
            end !== null && !that._translator.isValid(end)) {
            that._incidentOccurred("E2203");
        }
    },

    _applyChanges: function() {
        var that = this,
            selectedRange = that._options[SELECTED_RANGE],
            value = that._options[VALUE];

        if(that._changes.has("VALUE") && value) {
            that._rangeOption = { "value": [value[0], value[1]] };
        } else if(that._changes.has("SELECTED_RANGE") && selectedRange) {
            that._rangeOption = { "selectedRange": selectedRange };
        }
        that.callBase.apply(that, arguments);
        that._rangeOption = null;
        that.__isResizing = false;
    },

    _applyMostlyTotalChange: function() {
        var that = this,
            renderer = that._renderer,
            rect = that._clientRect,
            currentAnimationEnabled;
        if(that.__isResizing) {
            currentAnimationEnabled = renderer.animationEnabled();
            renderer.updateAnimationOptions({
                enabled: false
            });
        }

        that._clipRect.attr({
            x: rect[0], y: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1]
        });
        that._updateContent({
            left: rect[0], top: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1]
        });

        if(that.__isResizing) {
            renderer.updateAnimationOptions({
                enabled: currentAnimationEnabled
            });
        }

        that._drawn();
    },

    _dataSourceChangedHandler: function() {
        this._requestChange(["MOSTLY_TOTAL"]);
    },

    // It seems that we REALLY like to translate option structures from one form to another.
    // TODO: The more appropriate way is the following:
    // that._rangeView.update([
    //     that._getOption("background"),
    //     that._getOption("chart"),
    //     that.option("dataSource")
    // ]);
    // that._slidersController.update([
    //     that._getOption("sliderHandle"),
    //     that._getOption("sliderMarker"),
    //     that._getOption("shutter"),
    //     that._getOption("behavior")
    // ]);
    // that._axis.update(that._getOption("scale"));
    _updateContent: function(canvas) {
        var that = this,
            chartOptions = that.option("chart"),
            seriesDataSource = that._createSeriesDataSource(chartOptions),
            isCompactMode = !((seriesDataSource && seriesDataSource.isShowChart()) || that.option("background.image.url")),
            scaleOptions = prepareScaleOptions(that._getOption("scale"), seriesDataSource, that._incidentOccurred),
            argTranslatorRange = calculateTranslatorRange(seriesDataSource, scaleOptions),
            tickIntervalsInfo = updateTickIntervals(scaleOptions, canvas.width, that._incidentOccurred, argTranslatorRange),
            sliderMarkerOptions,
            indents,
            scaleLabelsAreaHeight,
            rangeContainerCanvas,
            chartThemeManager = seriesDataSource && seriesDataSource.isShowChart() && seriesDataSource.getThemeManager();

        if(chartThemeManager) {
            // TODO: Looks like usage of "chartThemeManager" can be replaced with "that._getOption("chart").valueAxis.logarithmBase - check it
            checkLogarithmicOptions(chartOptions && chartOptions.valueAxis, chartThemeManager.getOptions("valueAxis").logarithmBase, that._incidentOccurred);
        }

        updateScaleOptions(scaleOptions, seriesDataSource, argTranslatorRange, tickIntervalsInfo, getDateMarkerVisibilityChecker(canvas.width));
        updateTranslatorRangeInterval(argTranslatorRange, scaleOptions);
        sliderMarkerOptions = that._prepareSliderMarkersOptions(scaleOptions, canvas.width, tickIntervalsInfo);
        indents = calculateIndents(that._renderer, scaleOptions, sliderMarkerOptions, that.option("indent"));
        scaleLabelsAreaHeight = calculateScaleAreaHeight(that._renderer, scaleOptions, showScaleMarkers(scaleOptions));
        rangeContainerCanvas = {
            left: canvas.left + indents.left,
            top: canvas.top + indents.top,
            width: _max(canvas.width - indents.left - indents.right, 1),
            height: _max(!isCompactMode ? canvas.height - indents.top - indents.bottom - scaleLabelsAreaHeight : commonModule.HEIGHT_COMPACT_MODE, 0)
        };
        updateTranslator(that._translator, argTranslatorRange, [rangeContainerCanvas.left, rangeContainerCanvas.left + rangeContainerCanvas.width], scaleOptions.minRange);

        scaleOptions.minorTickInterval = scaleOptions.isEmpty ? 0 : scaleOptions.minorTickInterval;

        // RangeContainer
        that._updateElements(scaleOptions, sliderMarkerOptions, isCompactMode, rangeContainerCanvas, seriesDataSource);

        if(chartThemeManager) {
            chartThemeManager.dispose();    // TODO: Move it inside "SeriesDataSource"
        }
    },

    _updateElements: function(scaleOptions, sliderMarkerOptions, isCompactMode, canvas, seriesDataSource) {
        var that = this,
            behavior = that._getOption("behavior"),
            shutterOptions = that._getOption("shutter"),
            isNotSemiDiscrete = scaleOptions.type !== SEMIDISCRETE;

        shutterOptions.color = shutterOptions.color || that._getOption(CONTAINER_BACKGROUND_COLOR, true);

        that._rangeView.update(that.option("background"), that._themeManager.theme("background"), canvas, isCompactMode,
            behavior.animationEnabled && that._renderer.animationEnabled(), seriesDataSource);

        // TODO: There should be one call to some axis method (not 4 methods)
        that._axis.update(scaleOptions, isCompactMode, canvas);

        // TODO: Is entire options bag really needed for SlidersContainer?
        that._isUpdating = true;
        that._slidersController.update([canvas.top, canvas.top + canvas.height], behavior, isCompactMode,
            that._getOption("sliderHandle"), sliderMarkerOptions, shutterOptions, {
                minRange: isNotSemiDiscrete ? that.option("scale.minRange") : undefined,
                maxRange: isNotSemiDiscrete ? that.option("scale.maxRange") : undefined
            }, that._axis.getFullTicks(), that._getOption("selectedRangeColor", true));

        that._requestChange(["SLIDER_SELECTION"]);
        that._isUpdating = false;
        that._tracker.update(!that._translator.isEmptyValueRange(), behavior);
    },

    _createSeriesDataSource: function(chartOptions) {
        var that = this,
            seriesDataSource,
            dataSource = that._dataSourceItems(),  // TODO: This code can be executed when data source is not loaded (it is an error)!
            scaleOptions = that._getOption("scale"),
            valueType = scaleOptions.valueType || calculateValueType(scaleOptions.startValue, scaleOptions.endValue);

        if(dataSource || (chartOptions && chartOptions.series)) {
            chartOptions = $.extend({}, chartOptions, {
                theme: that.option("theme")
            });
            seriesDataSource = new seriesDataSourceModule.SeriesDataSource({
                renderer: that._renderer,
                dataSource: dataSource,
                valueType: _normalizeEnum(valueType),
                axisType: scaleOptions.type,
                chart: chartOptions,
                dataSourceField: that.option("dataSourceField"),
                incidentOccurred: that._incidentOccurred,
                categories: scaleOptions.categories
            });
        }
        return seriesDataSource;
    },

    _prepareSliderMarkersOptions: function(scaleOptions, screenDelta, tickIntervalsInfo) {
        var that = this,
            minorTickInterval = tickIntervalsInfo.minorTickInterval,
            tickInterval = tickIntervalsInfo.tickInterval,
            endValue = scaleOptions.endValue,
            startValue = scaleOptions.startValue,
            sliderMarkerOptions = that._getOption(SLIDER_MARKER),
            businessInterval,
            sliderMarkerUserOption = that.option(SLIDER_MARKER) || {},
            isTypeDiscrete = scaleOptions.type === DISCRETE,
            isValueTypeDatetime = scaleOptions.valueType === DATETIME;

        sliderMarkerOptions.borderColor = that._getOption(CONTAINER_BACKGROUND_COLOR, true);

        if(!sliderMarkerOptions.format) {
            if(!that._getOption("behavior").snapToTicks && _isNumber(scaleOptions.startValue)) {
                businessInterval = Math.abs(endValue - startValue);
                sliderMarkerOptions.format = {
                    type: "fixedPoint", precision: vizUtils.getSignificantDigitPosition(businessInterval / screenDelta)
                };
            }
            if(isValueTypeDatetime && !isTypeDiscrete) {
                if(!scaleOptions.marker.visible) {
                    if(_isDefined(startValue) && _isDefined(endValue)) {
                        sliderMarkerOptions.format = formatHelper.getDateFormatByTickInterval(startValue, endValue, _isDefined(minorTickInterval) && minorTickInterval !== 0 ? minorTickInterval : tickInterval);
                    }
                } else {
                    sliderMarkerOptions.format = dateUtils.getDateFormatByTickInterval(_isDefined(minorTickInterval) && minorTickInterval !== 0 ? minorTickInterval : tickInterval);
                }
            }
            // T347293
            if(isValueTypeDatetime && isTypeDiscrete && tickIntervalsInfo.ticks.length) {
                sliderMarkerOptions.format = formatHelper.getDateFormatByTicks(tickIntervalsInfo.ticks);
            }
        }
        if(sliderMarkerUserOption.padding !== undefined && sliderMarkerUserOption.paddingLeftRight === undefined && sliderMarkerUserOption.paddingTopBottom === undefined) { //    for deprecated padding option
            sliderMarkerOptions.paddingLeftRight = sliderMarkerOptions.paddingTopBottom = sliderMarkerUserOption.padding;
        }
        return sliderMarkerOptions;
    },

    getSelectedRange: function() {
        log("W0002", this.NAME, "getSelectedRange", "16.2", "Use the 'getValue' method instead");
        return parseValue(this.getValue());
    },

    getValue: function() {
        return parseSelectedRange(this._slidersController.getSelectedRange());
    },

    setSelectedRange: function(range) {
        log("W0002", this.NAME, "setSelectedRange", "16.2", "Use the 'setValue' method instead");
        this.setValue(parseSelectedRange(range));
    },

    setValue: function(value) {
        var current;
        if(!this._isUpdating && value) {
            // TODO: Move the check inside the SlidersController
            current = this._slidersController.getSelectedRange();
            if(!current || current.startValue !== value[0] || current.endValue !== value[1]) {
                this._slidersController.setSelectedRange(parseValue(value));
            }
        }
    },

    // The following method is not documented (and should not be) and used only in Dashboard (without the argument)
    resetSelectedRange: function() {
        this.setValue([]);
    },

    _setContentSize: function() {
        this.__isResizing = this._changes.count() === 2;
        this.callBase.apply(this, arguments);
    }
});

$.each(["selectedRangeColor", "containerBackgroundColor", "sliderMarker", "sliderHandle",
    "shutter", OPTION_BACKGROUND, "behavior", "chart", "indent"
], function(_, name) {
    dxRangeSelector.prototype._optionChangesMap[name] = "MOSTLY_TOTAL";
});

// AxisWrapper

function prepareAxisOptions(scaleOptions, isCompactMode, height, axisPosition) {
    scaleOptions.label.overlappingBehavior = {
        mode: scaleOptions.useTicksAutoArrangement ? "enlargeTickInterval" : "ignore"
    };

    scaleOptions.marker.label.font = scaleOptions.label.font;

    scaleOptions.color = scaleOptions.marker.color = scaleOptions.tick.color;
    scaleOptions.opacity = scaleOptions.marker.opacity = scaleOptions.tick.opacity;
    scaleOptions.width = scaleOptions.marker.width = scaleOptions.tick.width;

    scaleOptions.placeholderSize = (scaleOptions.placeholderHeight || 0) + axisPosition;

    scaleOptions.argumentType = scaleOptions.valueType;
    scaleOptions.visible = isCompactMode;
    scaleOptions.minorTick.showCalculatedTicks = scaleOptions.isHorizontal = scaleOptions.withoutOverlappingBehavior = scaleOptions.stick = true;

    if(!isCompactMode) {
        scaleOptions.minorTick.length = scaleOptions.tick.length = height;
    }
    scaleOptions.label.indentFromAxis = scaleOptions.label.topIndent + axisPosition;

    return scaleOptions;
}

function createDateMarkersEvent(scaleOptions, markerTrackers, setSelectedRange) {
    $.each(markerTrackers, function(_, value) {
        value.on("dxpointerdown", onPointerDown);
    });
    function onPointerDown(e) {
        var range = e.target.range,
            minRange = scaleOptions.minRange ? addInterval(range.startValue, scaleOptions.minRange) : undefined,
            maxRange = scaleOptions.maxRange ? addInterval(range.startValue, scaleOptions.maxRange) : undefined;
        if(!(minRange && minRange > range.endValue || maxRange && maxRange < range.endValue)) {
            setSelectedRange(range);
        }
    }
}

function AxisWrapper(params) {
    this._axis = new axisModule.Axis({
        renderer: params.renderer,
        axesContainerGroup: params.root,
        // TODO: These dependencies should be statically resolved (not for every new instance)
        axisType: "xyAxes",
        drawingType: "linear",
        widgetClass: "dxrs",
        axisClass: "range-selector"
    });
    this._updateSelectedRangeCallback = params.updateSelectedRange;
    this._translator = params.translator;
}

AxisWrapper.prototype = {
    constructor: AxisWrapper,

    dispose: function() {
        this._axis.dispose();
    },

    update: function(options, isCompactMode, canvas) {
        var axis = this._axis;
        axis.updateOptions(prepareAxisOptions(options, isCompactMode, canvas.height, canvas.height / 2 - Math.ceil(options.width / 2)));
        axis.delta = { bottom: -canvas.height / 2 };    // TODO: Really? Just a public field?
        // Translators could be passed to axis once (in constructor) but axis crashes when provided with not updated translator
        axis.setTranslator(this._translator, {
            // That is all what is actually required from the translator
            translateSpecialCase: function() {
                return canvas.top + canvas.height;
            }
        });
        axis.draw();
        if(axis.getMarkerTrackers()) {
            // TODO: Check who is responsible for destroying events
            createDateMarkersEvent(options, axis.getMarkerTrackers(), this._updateSelectedRangeCallback);
        }
    },

    getFullTicks: function() {
        return this._axis.getFullTicks();
    }
};

registerComponent("dxRangeSelector", dxRangeSelector);

module.exports = dxRangeSelector;

// PLUGINS_SECTION
dxRangeSelector.addPlugin(require("../core/export").plugin);
dxRangeSelector.addPlugin(require("../core/title").plugin);
dxRangeSelector.addPlugin(require("../core/loading_indicator").plugin);
dxRangeSelector.addPlugin(require("../core/data_source").plugin);
