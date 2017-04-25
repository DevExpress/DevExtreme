"use strict";

var $ = require("jquery"),
    numericTickManager = require("./numeric_tick_manager"),
    commonUtils = require("../../core/utils/common"),
    _addInterval = require("../../core/utils/date").addInterval,
    _isDefined = commonUtils.isDefined,
    _isNumber = commonUtils.isNumber,

    _math = Math,
    _abs = _math.abs,
    _ceil = _math.ceil,
    _floor = _math.floor,
    _atan = _math.atan,
    _max = _math.max,

    _each = $.each,
    _noop = $.noop,
    _isFunction = $.isFunction,
    _extend = $.extend,

    SCREEN_DELTA_KOEF = 4,
    AXIS_STAGGER_OVERLAPPING_KOEF = 2,
    STAGGER = "stagger",
    ROTATE = "rotate",
    MIN_ARRANGEMENT_TICKS_COUNT = 2,
    outOfScreen = { x: -1000, y: -1000 };

function nextState(state) {
    switch(state) {
        case "overlap":
            return STAGGER;
        case STAGGER:
            return ROTATE;
        default:
            return "end";
    }
}

function defaultGetTextFunc(value) { return value.toString(); }

function convertDateIntervalToNumeric(interval) {
    if(!_isNumber(interval)) {
        var date = new Date();
        interval = _addInterval(date, interval) - date;
    }
    return interval;
}

exports.base = {

    _applyOverlappingBehavior: function() {
        var that = this,
            options = that._options,
            overlappingBehavior = options.overlappingBehavior;

        if(overlappingBehavior.mode !== "ignore") {
            that._useAutoArrangement = true;
            that._correctTicks();

            if(overlappingBehavior.mode === "_auto") {
                that._applyAutoOverlappingBehavior();
                that._useAutoArrangement = options.overlappingBehavior.isOverlapped;
            }

            if(that._useAutoArrangement) {
                if(overlappingBehavior.mode === STAGGER) {
                    that._screenDelta *= AXIS_STAGGER_OVERLAPPING_KOEF;
                }
                that._applyAutoArrangement();
            }
        }
    },

    checkBoundedTicksOverlapping: function() {
        return {
            overlappedDates: this._checkBoundedDatesOverlapping(),
            overlappedStartEnd: this._checkStartEndOverlapping()
        };
    },

    getMaxLabelParams: function(ticks) {
        var that = this,
            getText = that._options.getText || defaultGetTextFunc,
            tickWithMaxLength,
            tickTextWithMaxLength,
            maxLength = 0;

        ticks = ticks || that._calculateMajorTicks();

        _each(ticks, function(_, item) {
            var text = getText(item, that._options.labelOptions),
                length = _isDefined(text) ? text.length : -1; //for categories in polar

            if(maxLength < length) {
                maxLength = length;
                tickWithMaxLength = item;
                tickTextWithMaxLength = text;
            }
        });

        return (maxLength > 0) ? that._getTextElementBBox(tickWithMaxLength, tickTextWithMaxLength) : { width: 0, height: 0, length: 0, y: 0 };
    },

    _applyAutoArrangement: function() {
        var that = this,
            options = that._options,
            arrangementStep,
            maxDisplayValueSize;

        if(that._useAutoArrangement) {
            maxDisplayValueSize = that._getTicksSize();
            arrangementStep = that._getAutoArrangementStep(maxDisplayValueSize);

            if(arrangementStep > 1) {
                if(_isDefined(that._tickInterval) || _isDefined(that._customTicks)) {
                    that._ticks = that._getAutoArrangementTicks(arrangementStep);
                } else {
                    options.gridSpacingFactor = maxDisplayValueSize;
                    that._ticks = that._createTicks([], that._findTickInterval(), that._min, that._max);
                }
            }
        }
    },

    _getAutoArrangementTicks: function(step) {
        var that = this,
            ticks = that._ticks,
            ticksLength = ticks.length,
            resultTicks = ticks,
            decimatedTicks = that._decimatedTicks || [],
            i;

        if(step > 1) {
            resultTicks = [];
            for(i = 0; i < ticksLength; i++) {
                if(i % step === 0) {
                    resultTicks.push(ticks[i]);
                } else {
                    decimatedTicks.push(ticks[i]);
                }
            }
            that._correctInterval(step);
        }

        return resultTicks;
    },

    _isOverlappedTicks: function(screenDelta) {
        return this._getAutoArrangementStep(this._getTicksSize(), screenDelta, -1) > 1;
    },

    _areDisplayValuesValid: function(value1, value2) {
        var that = this,
            options = that._options,
            getText = options.getText || defaultGetTextFunc,
            rotationAngle = options.overlappingBehavior && _isNumber(options.overlappingBehavior.rotationAngle) ? options.overlappingBehavior.rotationAngle : 0,
            bBox1 = that._getTextElementBBox(value1, getText(value1, options.labelOptions)),
            bBox2 = that._getTextElementBBox(value2, getText(value2, options.labelOptions)),
            horizontalInverted = bBox1.x > bBox2.x,
            verticalInverted = bBox1.y > bBox2.y,
            hasHorizontalOverlapping,
            hasVerticalOverlapping,
            result;


        if(rotationAngle !== 0) {
            result = that._getDistanceByAngle(bBox1, rotationAngle) <= _abs(bBox2.x - bBox1.x);
        } else {
            hasHorizontalOverlapping = !horizontalInverted ? (bBox1.x + bBox1.width) > bBox2.x : (bBox2.x + bBox2.width) > bBox1.x;
            hasVerticalOverlapping = !verticalInverted ? (bBox1.y + bBox1.height) > bBox2.y : (bBox2.y + bBox2.height) > bBox1.y;
            result = !(hasHorizontalOverlapping && hasVerticalOverlapping);
        }

        return result;
    },

    checkUserTickInterval: function(userTickInterval, calculatedTickInterval) {
        var behavior = this._options.overlappingBehavior,
            tickInterval1,
            tickInterval2;

        if(!behavior || behavior.mode !== "enlargeTickInterval") {
            return userTickInterval || calculatedTickInterval;
        }

        if(!userTickInterval) {
            return calculatedTickInterval;
        }

        tickInterval1 = convertDateIntervalToNumeric(userTickInterval);
        tickInterval2 = convertDateIntervalToNumeric(calculatedTickInterval);

        if(_isNumber(tickInterval1) && _isNumber(tickInterval2)) {
            if(tickInterval1 > tickInterval2) {
                return userTickInterval;
            }
        }

        return calculatedTickInterval;
    }
};

exports.circular = _extend({}, exports.base, {
    checkUserTickInterval: function(userTickInterval, calculatedTickInterval) {
        return userTickInterval || calculatedTickInterval;
    },

    _correctTicks: _noop,

    _applyAutoOverlappingBehavior: function() {
        this._options.overlappingBehavior.isOverlapped = true;
    },

    _getTextElementBBox: function(value, text) {
        var textOptions = _extend({}, this._options.textOptions, { rotate: 0 }),
            delta = _isFunction(this._options.translate) ? this._options.translate(value) : { x: 0, y: 0 },
            bBox;

        text = this._options.renderText(text, delta.x, delta.y).css(this._options.textFontStyles).attr(textOptions);
        bBox = text.getBBox();

        text.remove();

        return bBox;
    },

    _getTicksSize: function() {
        return this.getMaxLabelParams(this._ticks);
    },

    _checkStartEndOverlapping: function() {
        var ticks = this._ticks,
            lastTick = ticks[ticks.length - 1];

        return (ticks.length > 1 && !this._areDisplayValuesValid(ticks[0], lastTick));
    },

    _getAutoArrangementStep: function(maxDisplayValueSize) {
        var that = this,
            options = that._options,
            radius = options.circularRadius,
            startAngle = options.circularStartAngle,
            endAngle = options.circularEndAngle,
            circleDelta = startAngle === endAngle ? 360 : _abs(startAngle - endAngle),
            businessDelta = that._businessDelta || that._ticks.length,
            degreesPerTick = that._tickInterval * circleDelta / businessDelta,
            width = maxDisplayValueSize.width,
            height = maxDisplayValueSize.height,
            angle1 = _abs(2 * (_atan(height / (2 * radius - width))) * 180 / _math.PI),
            angle2 = _abs(2 * (_atan(width / (2 * radius - height))) * 180 / _math.PI),
            minAngleForTick = _max(angle1, angle2),
            step = 1;

        if(degreesPerTick < minAngleForTick) {
            step = _ceil(minAngleForTick / degreesPerTick);
        }

        return _max(1, step);
    }

});

exports.linear = _extend({}, exports.base, {

    _correctTicks: function() {
        var getIntervalFunc = numericTickManager.continuous._getInterval,
            arrangementStep;

        ///#DEBUG
        if(this._testingGetIntervalFunc) {
            getIntervalFunc = this._testingGetIntervalFunc;
        }
        ///#ENDDEBUG

        arrangementStep = _ceil(getIntervalFunc.call(this, this._getDeltaCoef(this._screenDelta * SCREEN_DELTA_KOEF, this._ticks.length))) || this._ticks.length;
        ///#DEBUG
        this._appliedArrangementStep = arrangementStep;
        ///#ENDDEBUG

        this._ticks = this._getAutoArrangementTicks(arrangementStep);
    },

    _getTextElementBBox: function(value, text) {
        var textOptions = _extend({}, this._options.textOptions, { rotate: 0 }),
            x = 0,
            y = 0,
            delta = _isFunction(this._options.translate) ? this._options.translate(value) : 0,
            bBox;

        if(this._options.isHorizontal) {
            x += delta;
        } else {
            y += delta;
        }

        text = this._options.renderText(text, x, y).css(this._options.textFontStyles).attr(textOptions);
        bBox = text.getBBox();
        text.remove();

        return bBox;
    },

    _checkStartEndOverlapping: _noop,

    _getAutoArrangementStep: function(maxDisplayValueSize, screenDelta, minArrangementTicksStep) {
        var that = this,
            options = that._options,
            requiredValuesCount,
            textSpacing = options.textSpacing || 0,
            addedSpacing = options.isHorizontal ? textSpacing : 0;

        screenDelta = screenDelta || that._screenDelta;
        minArrangementTicksStep = _isDefined(minArrangementTicksStep) ? minArrangementTicksStep : 1;

        if(options.getCustomAutoArrangementStep) {
            return options.getCustomAutoArrangementStep(that._ticks, options);
        }

        if(maxDisplayValueSize > 0) {
            requiredValuesCount = _floor((screenDelta + textSpacing) / (maxDisplayValueSize + addedSpacing));
            requiredValuesCount = requiredValuesCount <= minArrangementTicksStep ? MIN_ARRANGEMENT_TICKS_COUNT : requiredValuesCount;
            return _ceil((options.ticksCount || that._ticks.length) / requiredValuesCount);
        }

        return 1;
    },

    _getOptimalRotationAngle: function() {
        var that = this,
            options = that._options,
            tick1 = that._ticks[0],
            tick2 = that._ticks[1],
            textOptions = that._textOptions,
            getText = options.getText || defaultGetTextFunc,
            textFontStyles = options.textFontStyles,
            svgElement1 = options.renderText(getText(tick1, options.labelOptions), outOfScreen.x + options.translate(tick1, !options.isHorizontal), outOfScreen.y).css(textFontStyles).attr(textOptions),
            svgElement2 = options.renderText(getText(tick2, options.labelOptions), outOfScreen.x + options.translate(tick2, !options.isHorizontal), outOfScreen.y).css(textFontStyles).attr(textOptions),
            bBox1 = svgElement1.getBBox(),
            bBox2 = svgElement2.getBBox(),
            angle = _math.asin((bBox1.height + options.textSpacing) / (bBox2.x - bBox1.x)) * 180 / Math.PI;

        svgElement1.remove();
        svgElement2.remove();

        return isNaN(angle) ? 90 : _ceil(angle);
    },

    _applyAutoOverlappingBehavior: function() {
        var that = this,
            overlappingBehavior = that._options.overlappingBehavior,
            screenDelta = that._screenDelta,
            isOverlapped = false,
            rotationAngle = null,
            mode = null,
            state = "overlap";

        while(state !== "end") {
            isOverlapped = rotationAngle && rotationAngle !== 90 ? false : that._isOverlappedTicks(screenDelta);
            state = nextState(isOverlapped ? state : null);

            switch(state) {
                case STAGGER:
                    screenDelta *= AXIS_STAGGER_OVERLAPPING_KOEF;
                    mode = state;
                    break;
                case ROTATE:
                    rotationAngle = that._getOptimalRotationAngle();
                    screenDelta = that._screenDelta;
                    mode = state;
                    break;
            }
        }

        overlappingBehavior.isOverlapped = isOverlapped;
        overlappingBehavior.mode = mode;
        overlappingBehavior.rotationAngle = rotationAngle;
    },

    _getDistanceByAngle: function(bBox, rotationAngle) {
        rotationAngle = _abs(rotationAngle);
        rotationAngle = (rotationAngle % 180) >= 90 ? (90 - (rotationAngle % 90)) : (rotationAngle % 90);
        var a = rotationAngle * (_math.PI / 180);

        if(a >= _atan(bBox.height / bBox.width)) {
            return bBox.height / _abs(_math.sin(a));
        } else {
            return bBox.width;
        }
    },

    _getTicksSize: function() {
        var bBox = this.getMaxLabelParams(this._ticks),
            options = this._options,
            rotationAngle = options.overlappingBehavior ? options.overlappingBehavior.rotationAngle : 0,
            isRotate = _isNumber(rotationAngle) && rotationAngle !== 0;
        return _ceil(isRotate ? this._getDistanceByAngle(bBox, rotationAngle) : (options.isHorizontal ? bBox.width : bBox.height));
    }
});
