"use strict";

var extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    numericTranslator = require("./numeric_translator"),
    categoryTranslator = require("./category_translator"),
    intervalTranslator = require("./interval_translator"),
    datetimeTranslator = require("./datetime_translator"),
    logarithmicTranslator = require("./logarithmic_translator"),
    vizUtils = require("../core/utils"),
    typeUtils = require("../../core/utils/type"),
    rangeModule = require("./range"),
    getLog = vizUtils.getLog,
    getPower = vizUtils.getPower,
    isDefined = typeUtils.isDefined,
    _abs = Math.abs,
    CANVAS_PROP = ["width", "height", "left", "top", "bottom", "right"],
    NUMBER_EQUALITY_CORRECTION = 1,
    DATETIME_EQUALITY_CORRECTION = 60000,
    _noop = require("../../core/utils/common").noop,
    _Translator2d,

    addInterval = require("../../core/utils/date").addInterval;

var validateCanvas = function(canvas) {
    each(CANVAS_PROP, function(_, prop) {
        canvas[prop] = parseInt(canvas[prop]) || 0;
    });
    return canvas;
};

var makeCategoriesToPoints = function(categories) {
    var categoriesToPoints = {};

    categories.forEach(function(item, i) { categoriesToPoints[item.valueOf()] = i; });
    return categoriesToPoints;
};

var validateBusinessRange = function(businessRange) {
    function validate(valueSelector, baseValueSelector) {
        if(!isDefined(businessRange[valueSelector]) && isDefined(businessRange[baseValueSelector])) {
            businessRange[valueSelector] = businessRange[baseValueSelector];
        }
    }
    validate("minVisible", "min");
    validate("maxVisible", "max");
    return businessRange;
};

function valuesAreDefinedAndEqual(val1, val2) {
    return isDefined(val1) && isDefined(val2) && val1.valueOf() === val2.valueOf();
}

function prepareBreaks(breaks, range) {
    var transform = range.axisType === 'logarithmic' ? function(value) {
            return getLog(value, range.base);
        } : function(value) {
            return value;
        },
        array = [],
        br,
        transformFrom,
        transformTo,
        i,
        length = breaks.length,
        sum = 0;

    for(i = 0; i < length; i++) {
        br = breaks[i];
        transformFrom = transform(br.from);
        transformTo = transform(br.to);
        sum += transformTo - transformFrom;
        array.push({
            trFrom: transformFrom,
            trTo: transformTo,
            from: br.from,
            to: br.to,
            length: sum,
            cumulativeWidth: br.cumulativeWidth
        });
    }

    return array;
}

function getCanvasBounds(range) {
    var min = range.min,
        max = range.max,
        minVisible = range.minVisible,
        maxVisible = range.maxVisible,
        newMin,
        newMax,
        base = range.base,
        isDateTime = typeUtils.isDate(max) || typeUtils.isDate(min),
        correction = isDateTime ? DATETIME_EQUALITY_CORRECTION : NUMBER_EQUALITY_CORRECTION,
        isLogarithmic = range.axisType === 'logarithmic';

    if(isLogarithmic) {
        maxVisible = getLog(maxVisible, base);
        minVisible = getLog(minVisible, base);
        min = getLog(min, base);
        max = getLog(max, base);
    }

    if(valuesAreDefinedAndEqual(min, max)) {
        newMin = min.valueOf() - correction;
        newMax = max.valueOf() + correction;

        if(isDateTime) {
            min = new Date(newMin);
            max = new Date(newMax);
        } else {
            min = (min !== 0 || isLogarithmic) ? newMin : 0;
            max = newMax;
        }
    }

    if(valuesAreDefinedAndEqual(minVisible, maxVisible)) {
        newMin = minVisible.valueOf() - correction;
        newMax = maxVisible.valueOf() + correction;

        if(isDateTime) {
            minVisible = (newMin < min.valueOf()) ? min : new Date(newMin);
            maxVisible = (newMax > max.valueOf()) ? max : new Date(newMax);
        } else {
            if(minVisible !== 0 || isLogarithmic) {
                minVisible = newMin < min ? min : newMin;
            }
            maxVisible = newMax > max ? max : newMax;
        }
    }

    return { base: base, rangeMin: min, rangeMax: max, rangeMinVisible: minVisible, rangeMaxVisible: maxVisible };
}

function getEqualityCorrection(range) {
    var isDateTime = typeUtils.isDate(range.min) || typeUtils.isDate(range.max);

    return isDateTime ? DATETIME_EQUALITY_CORRECTION : NUMBER_EQUALITY_CORRECTION;
}

function zoomArgsIsEqualCanvas(zoomArgs) {
    const businessRange = this.getBusinessRange();

    return valuesAreDefinedAndEqual(businessRange.min, businessRange.max) && this.isEqualRange(zoomArgs);
}

function isEqualRange(range) {
    const that = this;
    const businessRange = that.getBusinessRange();
    const canvasOptions = getCanvasBounds(businessRange);
    const correctionPrecision = getEqualityCorrection(businessRange) / 100;
    const comparingRange = new rangeModule.Range(range);

    if(businessRange.axisType === "discrete") {
        return false;
    }

    if(range && businessRange.axisType === "logarithmic") {
        comparingRange.min = comparingRange.min && getLog(comparingRange.min, businessRange.base);
        comparingRange.max = comparingRange.max && getLog(comparingRange.max, businessRange.base);
    }

    return range && (!isDefined(comparingRange.min) || _abs(comparingRange.min - canvasOptions.rangeMin) <= correctionPrecision) &&
        (!isDefined(comparingRange.max) || _abs(comparingRange.max - canvasOptions.rangeMax) <= correctionPrecision);
}

function checkGestureEventsForScaleEdges(scrollThreshold, scale, scroll, touches, zoomArgs) {
    var that = this,
        businessRange = that.getBusinessRange(),
        isDiscreteAxis = businessRange.axisType === "discrete",
        scrollBarNearMin = that.scrollHasExtremePosition(scrollThreshold, false),
        scrollBarNearMax = that.scrollHasExtremePosition(scrollThreshold, true),
        isOriginalScale = that.checkScrollForOriginalScale(scrollThreshold),
        scalingEventAtMin = scrollBarNearMin && ((businessRange.rotated ? scroll > 0 : scroll < 0) || scale !== 1),
        scalingEventAtMax = scrollBarNearMax && ((businessRange.rotated ? scroll < 0 : scroll > 0) || scale !== 1);

    return (touches === 2 && scale === 1) || ((zoomArgs || isDiscreteAxis || !this.isEqualRange({ min: businessRange.minVisible, max: businessRange.maxVisible })) && (!scrollBarNearMin && !scrollBarNearMax)) ||
        (!isOriginalScale && (scalingEventAtMin || scalingEventAtMax)) || (isOriginalScale && scale > 1);
}

function checkScrollForOriginalScale(scrollThreshold) {
    return this.scrollHasExtremePosition(scrollThreshold, false) && this.scrollHasExtremePosition(scrollThreshold, true);
}

function scrollHasExtremePosition(scrollThreshold, isMax) {
    var that = this,
        businessRange = that.getBusinessRange(),
        isDiscreteAxis = businessRange.axisType === "discrete",
        min = isDiscreteAxis ? businessRange.categories[0] : businessRange.min,
        max = isDiscreteAxis ? businessRange.categories[businessRange.categories.length - 1] : businessRange.max,
        isSinglePoint = min === max,
        isMaxExtremum = (!businessRange.invert && isMax) || (businessRange.invert && !isMax),
        axisExtremum = isMaxExtremum ? max : min,
        scrollExtremum = isMaxExtremum ? businessRange.maxVisible : businessRange.minVisible,
        equalityCorrection,
        distanceToExtremum;

    if(isDiscreteAxis) {
        return !isDefined(scrollExtremum) || axisExtremum.valueOf() === scrollExtremum.valueOf();
    } else {
        if(businessRange.axisType === "logarithmic") {
            axisExtremum = vizUtils.getLog(axisExtremum, businessRange.base);
            scrollExtremum = vizUtils.getLog(scrollExtremum, businessRange.base);
        }

        equalityCorrection = axisExtremum.valueOf() === scrollExtremum.valueOf() ? 0 : getEqualityCorrection(businessRange);
        distanceToExtremum = isSinglePoint ?
            Math.abs((axisExtremum + ((isMaxExtremum ? 1 : -1) * equalityCorrection)) - scrollExtremum) :
            Math.abs(axisExtremum - scrollExtremum);
        return distanceToExtremum * that._canvasOptions.ratioOfCanvasRange < scrollThreshold;
    }
}

function getCheckingMethodsAboutBreaks(inverted) {
    return {
        isStartSide: !inverted ? function(pos, breaks, start, end) {
            return pos < breaks[0][start];
        } : function(pos, breaks, start, end) {
            return pos <= breaks[breaks.length - 1][end];
        },
        isEndSide: !inverted ? function(pos, breaks, start, end) {
            return pos >= breaks[breaks.length - 1][end];
        } : function(pos, breaks, start, end) {
            return pos > breaks[0][start];
        },
        isInBreak: !inverted ? function(pos, br, start, end) {
            return pos >= br[start] && pos < br[end];
        } : function(pos, br, start, end) {
            return pos > br[end] && pos <= br[start];
        },
        isBetweenBreaks: !inverted ? function(pos, br, prevBreak, start, end) {
            return pos < br[start] && pos >= prevBreak[end];
        } : function(pos, br, prevBreak, start, end) {
            return pos >= br[end] && pos < prevBreak[start];
        },
        getLength: !inverted ? function(br) {
            return br.length;
        } : function(br, lastBreak) {
            return lastBreak.length - br.length;
        },
        getBreaksSize: !inverted ? function(br) {
            return br.cumulativeWidth;
        } : function(br, lastBreak) {
            return lastBreak.cumulativeWidth - br.cumulativeWidth;
        }
    };
}

exports.Translator2D = _Translator2d = function(businessRange, canvas, options) {
    this.update(businessRange, canvas, options);
};

_Translator2d.prototype = {
    constructor: _Translator2d,
    reinit: function() {
        // TODO: parseInt canvas
        var that = this,
            options = that._options,
            range = that._businessRange,
            categories = range.categories || [],
            script = {},
            canvasOptions = that._prepareCanvasOptions(),
            visibleCategories = vizUtils.getCategoriesInfo(categories, range.minVisible, range.maxVisible).categories,
            categoriesLength = visibleCategories.length;

        switch(range.axisType) {
            case "logarithmic":
                script = logarithmicTranslator;
                break;
            case "semidiscrete":
                script = intervalTranslator;
                canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (addInterval(canvasOptions.rangeMaxVisible, options.interval) - canvasOptions.rangeMinVisible);
                break;
            case "discrete":
                script = categoryTranslator;
                that._categories = categories;
                canvasOptions.interval = that._getDiscreteInterval(options.addSpiderCategory ? categoriesLength + 1 : categoriesLength, canvasOptions);
                that._categoriesToPoints = makeCategoriesToPoints(categories, canvasOptions.invert);
                if(categoriesLength) {
                    canvasOptions.startPointIndex = that._categoriesToPoints[visibleCategories[0].valueOf()];
                    that.visibleCategories = visibleCategories;
                }
                break;
            default:
                if(range.dataType === "datetime") {
                    script = datetimeTranslator;
                } else {
                    script = numericTranslator;
                }
        }

        extend(that, script);
        that._conversionValue = options.conversionValue ? function(value) { return value; } : function(value) { return Math.round(value); };

        that._calculateSpecialValues();
        that._checkingMethodsAboutBreaks = [
            getCheckingMethodsAboutBreaks(false),
            getCheckingMethodsAboutBreaks(that.isInverted())
        ];
        that._translateBreaks();
    },

    _translateBreaks: function() {
        var breaks = this._breaks,
            size = this._options.breaksSize,
            i,
            b,
            end,
            length;
        if(breaks === undefined) {
            return;
        }
        for(i = 0, length = breaks.length; i < length; i++) {
            b = breaks[i];
            end = this.translate(b.to);
            b.end = end;
            b.start = !b.gapSize ? (!this.isInverted() ? end - size : end + size) : end;
        }
    },

    _checkValueAboutBreaks: function(breaks, pos, start, end, methods) {
        var i,
            length,
            prop = { length: 0, breaksSize: undefined, inBreak: false },
            br,
            prevBreak,
            lastBreak = breaks[breaks.length - 1];

        if(methods.isStartSide(pos, breaks, start, end)) {
            return prop;
        } else if(methods.isEndSide(pos, breaks, start, end)) {
            return { length: lastBreak.length, breaksSize: lastBreak.cumulativeWidth, inBreak: false };
        }

        for(i = 0, length = breaks.length; i < length; i++) {
            br = breaks[i];
            prevBreak = breaks[i - 1];
            if(methods.isInBreak(pos, br, start, end)) {
                prop.inBreak = true;
                prop.break = br;
                break;
            }
            if(prevBreak && methods.isBetweenBreaks(pos, br, prevBreak, start, end)) {
                prop = { length: methods.getLength(prevBreak, lastBreak), breaksSize: methods.getBreaksSize(prevBreak, lastBreak), inBreak: false };
                break;
            }
        }
        return prop;
    },

    isInverted: function() {
        return !(this._options.isHorizontal ^ this._businessRange.invert);
    },

    _getDiscreteInterval: function(categoriesLength, canvasOptions) {
        var correctedCategoriesCount = categoriesLength - (this._options.stick ? 1 : 0);
        return correctedCategoriesCount > 0 ? canvasOptions.canvasLength / correctedCategoriesCount : canvasOptions.canvasLength;
    },

    _prepareCanvasOptions: function() {
        var that = this,
            businessRange = that._businessRange,
            canvasOptions = that._canvasOptions = getCanvasBounds(businessRange),
            length,
            canvas = that._canvas,
            breaks = that._breaks;

        if(that._options.isHorizontal) {
            canvasOptions.startPoint = canvas.left;
            length = canvas.width;
            canvasOptions.endPoint = canvas.width - canvas.right;
            canvasOptions.invert = businessRange.invert;
        } else {
            canvasOptions.startPoint = canvas.top;
            length = canvas.height;
            canvasOptions.endPoint = canvas.height - canvas.bottom;
            canvasOptions.invert = !businessRange.invert;// axis inverted because display drawn to bottom
        }

        that.canvasLength = canvasOptions.canvasLength = canvasOptions.endPoint - canvasOptions.startPoint;
        canvasOptions.rangeDoubleError = Math.pow(10, getPower(canvasOptions.rangeMax - canvasOptions.rangeMin) - getPower(length) - 2); // B253861
        canvasOptions.ratioOfCanvasRange = canvasOptions.canvasLength / (canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible);

        if(breaks !== undefined) {
            canvasOptions.ratioOfCanvasRange = (canvasOptions.canvasLength - breaks[breaks.length - 1].cumulativeWidth) /
                (canvasOptions.rangeMaxVisible - canvasOptions.rangeMinVisible - breaks[breaks.length - 1].length);
        }

        return canvasOptions;
    },

    updateCanvas: function(canvas) {
        this._canvas = validateCanvas(canvas);
        this.reinit();
    },

    updateBusinessRange: function(businessRange) {
        var that = this,
            breaks = businessRange.breaks || [];

        that._businessRange = validateBusinessRange(businessRange);

        that._breaks = breaks.length ? prepareBreaks(breaks, that._businessRange) : undefined;

        that.reinit();
    },

    update: function(businessRange, canvas, options) {
        var that = this;
        that._options = extend(that._options || {}, options);
        that._canvas = validateCanvas(canvas);

        that.updateBusinessRange(businessRange);
    },

    getBusinessRange: function() {
        return this._businessRange;
    },

    getCanvasVisibleArea: function() {
        return {
            min: this._canvasOptions.startPoint,
            max: this._canvasOptions.endPoint
        };
    },

    _calculateSpecialValues: function() {
        var that = this,
            canvasOptions = that._canvasOptions,
            startPoint = canvasOptions.startPoint,
            endPoint = canvasOptions.endPoint,
            range = that._businessRange,
            minVisible = range.minVisible,
            maxVisible = range.maxVisible,
            invert,
            canvas_position_default,
            canvas_position_center_middle;

        if(minVisible <= 0 && maxVisible >= 0) {
            that.sc = {};// we can not call translate method without sc object
            canvas_position_default = that.translate(0);
        } else {
            invert = range.invert ^ (minVisible <= 0 && maxVisible <= 0);
            if(that._options.isHorizontal) {
                canvas_position_default = invert ? endPoint : startPoint;
            } else {
                canvas_position_default = invert ? startPoint : endPoint;
            }
        }

        canvas_position_center_middle = startPoint + canvasOptions.canvasLength / 2;

        that.sc = {
            "canvas_position_default": canvas_position_default,
            "canvas_position_left": startPoint,
            "canvas_position_top": startPoint,
            "canvas_position_center": canvas_position_center_middle,
            "canvas_position_middle": canvas_position_center_middle,
            "canvas_position_right": endPoint,
            "canvas_position_bottom": endPoint,
            "canvas_position_start": canvasOptions.invert ? endPoint : startPoint,
            "canvas_position_end": canvasOptions.invert ? startPoint : endPoint
        };
    },

    translateSpecialCase: function(value) {
        return this.sc[value];
    },

    _calculateProjection: function(distance) {
        var canvasOptions = this._canvasOptions;
        return canvasOptions.invert ? canvasOptions.endPoint - distance : canvasOptions.startPoint + distance;
    },

    _calculateUnProjection: function(distance) {
        var canvasOptions = this._canvasOptions;
        return canvasOptions.invert ? canvasOptions.rangeMaxVisible.valueOf() - distance : canvasOptions.rangeMinVisible.valueOf() + distance;
    },

    getMinBarSize: function(minBarSize) {
        var visibleArea = this.getCanvasVisibleArea(),
            minValue = this.untranslate(visibleArea.min + minBarSize);

        return _abs(this.untranslate(visibleArea.min) - (!isDefined(minValue) ? this.untranslate(visibleArea.max) : minValue));
    },
    checkMinBarSize: function(value, minShownValue, stackValue) {
        return _abs(value) < minShownValue ? value >= 0 ? minShownValue : -minShownValue : value;
    },
    translate: _noop,
    untranslate: _noop,
    getInterval: _noop,
    zoom: _noop,
    getMinScale: _noop,
    zoomArgsIsEqualCanvas: zoomArgsIsEqualCanvas,
    isEqualRange: isEqualRange,
    checkScrollForOriginalScale: checkScrollForOriginalScale,
    scrollHasExtremePosition: scrollHasExtremePosition,
    checkGestureEventsForScaleEdges: checkGestureEventsForScaleEdges,

    // dxRangeSelector specific

    // TODO: Rename to getValueRange
    getRange: function() {
        return [this.untranslate(this._canvasOptions.startPoint, -1), this.untranslate(this._canvasOptions.endPoint, 1)];
    },

    isEmptyValueRange: function() {
        // "_businessRange.isDefined()" could be used but cannot be because of stub data
        return this._businessRange.stubData;
    },

    getScreenRange: function() {
        return [this._canvasOptions.startPoint, this._canvasOptions.endPoint];
    },

    add: function(value, diff, dir) {
        return this._add(value, diff, (this._businessRange.invert ? -1 : +1) * dir);
    }
};
