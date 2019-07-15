import { noop } from "../../core/utils/common";
import { isDefined, isNumeric, isExponential, isFunction } from "../../core/utils/type";
import { extend } from "../../core/utils/extend";
import { dateToMilliseconds } from "../../core/utils/date";
import { adjust, sign } from "../../core/utils/math";
import { each } from "../../core/utils/iterator";

const _math = Math;
const _round = _math.round;
const _sqrt = Math.sqrt;

var PI = Math.PI,
    MAX_PIXEL_COUNT = 1E10,
    PI_DIV_180 = PI / 180,
    LN10 = Math.LN10;

var cosFunc = Math.cos,
    sinFunc = Math.sin,
    abs = Math.abs,
    log = Math.log,
    floor = Math.floor,
    ceil = Math.ceil,
    max = Math.max,
    _isNaN = isNaN,
    _Number = Number,
    _NaN = NaN;

export function getLog(value, base) {
    if(!value) {
        return _NaN;
    }
    return Math.log(value) / Math.log(base);
}

export function getAdjustedLog10(value) {
    return adjust(getLog(value, 10));
}

export function raiseTo(power, base) {
    return Math.pow(base, power);
}

//  Translates angle to [0, 360)
//  Expects number, no validation
export function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

//  Maps angle in trigonometric space to angle in 'renderer' space
//  Expects numbers, no validation
export function convertAngleToRendererSpace(angle) {
    return 90 - angle;
}

//  Maps angle in degrees to angle in radians
//  Expects number, no validation
export function degreesToRadians(value) {
    return PI * value / 180;
}

//  Calculates sin and cos for <angle> in degrees
//  Expects number, no validation
export function getCosAndSin(angle) {
    var angleInRadians = degreesToRadians(angle);
    return { cos: cosFunc(angleInRadians), sin: sinFunc(angleInRadians) };
}

//  Because Math.log(1000) / Math.LN10 < 3 though it is exactly 3
//  Same happens for 1E6, 1E9, 1E12, 1E13, 1E15, ...
const DECIMAL_ORDER_THRESHOLD = 1E-14;
//    ____________________
//   /       2          2
// \/ (y2-y1)  + (x2-x1)
export function getDistance(x1, y1, x2, y2) {
    var diffX = x2 - x1,
        diffY = y2 - y1;
    return Math.sqrt(diffY * diffY + diffX * diffX);
}

export function getDecimalOrder(number) {
    var n = abs(number), cn;
    if(!_isNaN(n)) {
        if(n > 0) {
            n = log(n) / LN10;
            cn = ceil(n);
            return cn - n < DECIMAL_ORDER_THRESHOLD ? cn : floor(n);
        }
        return 0;
    }
    return _NaN;
}

export function getAppropriateFormat(start, end, count) {
    var order = max(getDecimalOrder(start), getDecimalOrder(end)),
        precision = -getDecimalOrder(abs(end - start) / count),
        format;

    if(!_isNaN(order) && !_isNaN(precision)) {
        if(abs(order) <= 4) {
            format = 'fixedPoint';
            precision < 0 && (precision = 0);
            precision > 4 && (precision = 4);
        } else {
            format = 'exponential';
            precision += order - 1;
            precision > 3 && (precision = 3);
        }
        return { type: format, precision: precision };
    }
    return null;
}

export function roundValue(value, precision) {
    if(precision > 20) {
        precision = 20;
    }
    if(isNumeric(value)) {
        if(isExponential(value)) {
            return _Number(value.toExponential(precision));
        } else {
            return _Number(value.toFixed(precision));
        }
    }
}

export function getPower(value) {
    return value.toExponential().split("e")[1];
}

export function map(array, callback) {
    var i = 0,
        len = array.length,
        result = [],
        value;

    while(i < len) {
        value = callback(array[i], i);
        if(value !== null) {
            result.push(value);
        }
        i++;
    }
    return result;
}

function selectByKeys(object, keys) {
    return map(keys, function(key) {
        return object[key] ? object[key] : null;
    });
}

function decreaseFields(object, keys, eachDecrease, decrease) {
    var dec = decrease;
    each(keys, function(_, key) {
        if(object[key]) {
            object[key] -= eachDecrease;
            dec -= eachDecrease;
        }
    });
    return dec;
}

export function normalizeEnum(value) {
    return String(value).toLowerCase();
}

export function setCanvasValues(canvas) {
    if(canvas) {
        canvas.originalTop = canvas.top;
        canvas.originalBottom = canvas.bottom;
        canvas.originalLeft = canvas.left;
        canvas.originalRight = canvas.right;
    }
    return canvas;
}

function normalizeBBoxField(value) {
    return -MAX_PIXEL_COUNT < value && value < +MAX_PIXEL_COUNT ? value : 0;
}

export function normalizeBBox(bBox) {
    var xl = normalizeBBoxField(floor(bBox.x)),
        yt = normalizeBBoxField(floor(bBox.y)),
        xr = normalizeBBoxField(ceil(bBox.width + bBox.x)),
        yb = normalizeBBoxField(ceil(bBox.height + bBox.y)),
        result = {
            x: xl,
            y: yt,
            width: xr - xl,
            height: yb - yt
        };
    result.isEmpty = !result.x && !result.y && !result.width && !result.height;
    return result;
}

// Angle is expected to be from right-handed cartesian (not svg) space - positive is counterclockwise
export function rotateBBox(bBox, center, angle) {
    var cos = _Number(cosFunc(angle * PI_DIV_180).toFixed(3)),
        sin = _Number(sinFunc(angle * PI_DIV_180).toFixed(3)),
        w2 = bBox.width / 2,
        h2 = bBox.height / 2,
        centerX = bBox.x + w2,
        centerY = bBox.y + h2,
        w2_ = abs(w2 * cos) + abs(h2 * sin),
        h2_ = abs(w2 * sin) + abs(h2 * cos),
        // Note that the following slightly differs from theoretical formula:
        // x' = x * cos - y * sin, y' = x * sin + y * cos
        // That is because in svg y goes down (not up) - so sign of sin is reverted
        // x' = x * cos + y * sin, y' = -x * sin + y * cos
        centerX_ = center[0] + (centerX - center[0]) * cos + (centerY - center[1]) * sin,
        centerY_ = center[1] - (centerX - center[0]) * sin + (centerY - center[1]) * cos;
    return normalizeBBox({
        x: centerX_ - w2_,
        y: centerY_ - h2_,
        width: 2 * w2_,
        height: 2 * h2_
    });
}


export function decreaseGaps(object, keys, decrease) {
    var arrayGaps;
    do {
        arrayGaps = selectByKeys(object, keys);
        arrayGaps.push(_math.ceil(decrease / arrayGaps.length));
        decrease = decreaseFields(object, keys, _math.min.apply(null, arrayGaps), decrease);
    } while(decrease > 0 && arrayGaps.length > 1);
    return decrease;
}


export function parseScalar(value, defaultValue) {
    return value !== undefined ? value : defaultValue;
}

export function enumParser(values) {
    var stored = {}, i, ii;
    for(i = 0, ii = values.length; i < ii; ++i) {
        stored[normalizeEnum(values[i])] = 1;
    }
    return function(value, defaultValue) {
        var _value = normalizeEnum(value);
        return stored[_value] ? _value : defaultValue;
    };
}

export function patchFontOptions(options) {
    var fontOptions = {};
    each(options || {}, function(key, value) {
        if(/^(cursor|opacity)$/i.test(key)) {
            // TODO check other properties, add tests
        } else if(key === "color") {
            key = "fill";
        } else {
            key = "font-" + key;
        }
        fontOptions[key] = value;
    });
    return fontOptions;
}

export function convertPolarToXY(centerCoords, startAngle, angle, radius) {
    var shiftAngle = 90,
        cosSin;

    angle = isDefined(angle) ? angle + startAngle - shiftAngle : 0;
    cosSin = getCosAndSin(angle);

    return { x: _round(centerCoords.x + radius * cosSin.cos), y: _round(centerCoords.y + radius * cosSin.sin) };
}

export function convertXYToPolar(centerCoords, x, y) {
    var radius = getDistance(centerCoords.x, centerCoords.y, x, y),
        angle = _math.atan2(y - centerCoords.y, x - centerCoords.x);

    return { phi: _round(normalizeAngle(angle * 180 / _math.PI)), r: _round(radius) };
}

export function processSeriesTemplate(seriesTemplate, items) {
    var customizeSeries = isFunction(seriesTemplate.customizeSeries) ? seriesTemplate.customizeSeries : noop,
        nameField = seriesTemplate.nameField,
        generatedSeries = {},
        seriesOrder = [],
        series,
        i = 0,
        length,
        data;

    items = items || [];
    for(length = items.length; i < length; i++) {
        data = items[i];
        if(nameField in data) {
            series = generatedSeries[data[nameField]];
            if(!series) {
                series = generatedSeries[data[nameField]] = { name: data[nameField], nameFieldValue: data[nameField] };
                seriesOrder.push(series.name);
            }
        }
    }
    return map(seriesOrder, function(orderedName) {
        var group = generatedSeries[orderedName];
        return extend(group, customizeSeries.call(null, group.name));
    });
}

export function getCategoriesInfo(categories, startValue, endValue) {
    if(categories.length === 0) {
        return { categories: [] };
    }
    startValue = isDefined(startValue) ? startValue : categories[0];
    endValue = isDefined(endValue) ? endValue : categories[categories.length - 1];

    var categoriesValue = map(categories, function(category) {
            return isDefined(category) ? category.valueOf() : null;
        }),
        visibleCategories,
        indexStartValue = categoriesValue.indexOf(startValue.valueOf()),
        indexEndValue = categoriesValue.indexOf(endValue.valueOf()),
        swapBuf,
        inverted = false,
        lastIdx;

    indexStartValue < 0 && (indexStartValue = 0);
    indexEndValue < 0 && (indexEndValue = categories.length - 1);
    if(indexEndValue < indexStartValue) {
        swapBuf = indexEndValue;
        indexEndValue = indexStartValue;
        indexStartValue = swapBuf;
        inverted = true;
    }

    visibleCategories = categories.slice(indexStartValue, indexEndValue + 1);
    lastIdx = visibleCategories.length - 1;
    return {
        categories: visibleCategories,
        start: visibleCategories[inverted ? lastIdx : 0],
        end: visibleCategories[inverted ? 0 : lastIdx],
        inverted: inverted
    };
}

export function updatePanesCanvases(panes, canvas, rotated) {
    var weightSum = 0;
    each(panes, function(_, pane) {
        pane.weight = pane.weight || 1;
        weightSum += pane.weight;
    });
    var distributedSpace = 0,
        padding = panes.padding || 10,
        paneSpace = rotated ? canvas.width - canvas.left - canvas.right : canvas.height - canvas.top - canvas.bottom,
        oneWeight = (paneSpace - padding * (panes.length - 1)) / weightSum,
        startName = rotated ? "left" : "top",
        endName = rotated ? "right" : "bottom";
    each(panes, function(_, pane) {
        var calcLength = _round(pane.weight * oneWeight);
        pane.canvas = pane.canvas || {};
        extend(pane.canvas, canvas);
        pane.canvas[startName] = canvas[startName] + distributedSpace;
        pane.canvas[endName] = canvas[endName] + (paneSpace - calcLength - distributedSpace);

        distributedSpace = distributedSpace + calcLength + padding;
        setCanvasValues(pane.canvas);
    });
}

export function unique(array) {
    var values = {};
    return map(array, function(item) {
        var result = !values[item] ? item : null;
        values[item] = true;
        return result;
    });
}

export function getVerticallyShiftedAngularCoords(bBox, dy, center) {
    // TODO: Use center instead of left top corner - that is more correct and allows to get rid of "isPositive"
    //   horizontalOffset1 = bBox.x + bBox.width / 2 - center.x
    //   horizontalOffset2 = bBox.y + bBox.height / 2 - center.y
    //   verticalOffset2 = newCoord.y + bBox.height / 2 - center.y
    var isPositive = bBox.x + bBox.width / 2 >= center.x,
        horizontalOffset1 = (isPositive ? bBox.x : bBox.x + bBox.width) - center.x,
        verticalOffset1 = bBox.y - center.y,
        verticalOffset2 = verticalOffset1 + dy,
        horizontalOffset2 = _round(_sqrt(horizontalOffset1 * horizontalOffset1 + verticalOffset1 * verticalOffset1 - verticalOffset2 * verticalOffset2)),
        dx = (isPositive ? +horizontalOffset2 : -horizontalOffset2) || horizontalOffset1;
    return { x: center.x + (isPositive ? dx : dx - bBox.width), y: bBox.y + dy };
}

export function mergeMarginOptions(opt1, opt2) {
    return {
        checkInterval: opt1.checkInterval || opt2.checkInterval,
        size: Math.max(opt1.size || 0, opt2.size || 0),
        percentStick: opt1.percentStick || opt2.percentStick,
        sizePointNormalState: Math.max(opt1.sizePointNormalState || 0, opt2.sizePointNormalState || 0)
    };
}


export function getVizRangeObject(value) {
    if(Array.isArray(value)) {
        return { startValue: value[0], endValue: value[1] };
    } else {
        return value || {};
    }
}

export function convertVisualRangeObject(visualRange, convertToVisualRange) {
    if(convertToVisualRange) {
        return visualRange;
    }
    return [visualRange.startValue, visualRange.endValue];
}

export function getAddFunction(range, correctZeroLevel) {
    // T170398
    if(range.dataType === "datetime") {
        return function(rangeValue, marginValue, sign = 1) {
            return new Date(rangeValue.getTime() + sign * marginValue);
        };
    }

    if(range.axisType === "logarithmic") {
        return function(rangeValue, marginValue, sign = 1) {
            var log = getLogExt(rangeValue, range.base) + sign * marginValue;
            return raiseToExt(log, range.base);
        };
    }

    return function(rangeValue, marginValue, sign = 1) {
        var newValue = rangeValue + sign * marginValue;
        return correctZeroLevel && newValue * rangeValue <= 0 ? 0 : newValue;
    };
}

export function adjustVisualRange(options, visualRange, wholeRange, dataRange) {
    const minDefined = isDefined(visualRange.startValue);
    const maxDefined = isDefined(visualRange.endValue);
    const nonDiscrete = options.axisType !== "discrete";

    dataRange = dataRange || wholeRange;

    const add = getAddFunction(options, false);

    let min = minDefined ? visualRange.startValue : dataRange.min;
    let max = maxDefined ? visualRange.endValue : dataRange.max;
    let rangeLength = visualRange.length;
    const categories = dataRange.categories;

    if(nonDiscrete && !isDefined(min) && !isDefined(max)) {
        return {
            startValue: min,
            endValue: max
        };
    }

    if(isDefined(rangeLength)) {
        if(nonDiscrete) {
            if(options.dataType === "datetime" && !isNumeric(rangeLength)) {
                rangeLength = dateToMilliseconds(rangeLength);
            }

            if(maxDefined && !minDefined || !maxDefined && !minDefined) {
                isDefined(wholeRange.max) && (max = max > wholeRange.max ? wholeRange.max : max);
                min = add(max, rangeLength, -1);
            } else if(minDefined && !maxDefined) {
                isDefined(wholeRange.min) && (min = min < wholeRange.min ? wholeRange.min : min);
                max = add(min, rangeLength);
            }
        } else {
            rangeLength = parseInt(rangeLength);
            if(!isNaN(rangeLength) && isFinite(rangeLength)) {
                rangeLength--;
                if(!maxDefined && !minDefined) {
                    max = categories[categories.length - 1];
                    min = categories[categories.length - 1 - rangeLength];
                } else if(minDefined && !maxDefined) {
                    const categoriesInfo = exports.getCategoriesInfo(categories, min, undefined);
                    max = categoriesInfo.categories[rangeLength];
                } else if(!minDefined && maxDefined) {
                    const categoriesInfo = exports.getCategoriesInfo(categories, undefined, max);
                    min = categoriesInfo.categories[categoriesInfo.categories.length - 1 - rangeLength];
                }
            }
        }
    }

    if(nonDiscrete) {
        if(isDefined(wholeRange.max) && max > wholeRange.max) {
            max = wholeRange.max;
        }
        if(isDefined(wholeRange.min) && min < wholeRange.min) {
            min = wholeRange.min;
        }
    }

    return {
        startValue: min,
        endValue: max
    };
}

export function getLogExt(value, base, allowNegatives = false, linearThreshold) {
    if(!allowNegatives) {
        return getLog(value, base);
    }
    if(value === 0) {
        return 0;
    }
    const transformValue = getLog(Math.abs(value), base) - (linearThreshold - 1);
    if(transformValue < 0) {
        return 0;
    }
    return adjust(sign(value) * transformValue, Number(Math.pow(base, linearThreshold - 1).toFixed(Math.abs(linearThreshold))));
}

export function raiseToExt(value, base, allowNegatives = false, linearThreshold) {
    if(!allowNegatives) {
        return raiseTo(value, base);
    }

    if(value === 0) {
        return 0;
    }

    const transformValue = raiseTo(Math.abs(value) + (linearThreshold - 1), base);

    if(transformValue < 0) {
        return 0;
    }

    return adjust(sign(value) * transformValue, Number(Math.pow(base, linearThreshold).toFixed(Math.abs(linearThreshold))));
}
