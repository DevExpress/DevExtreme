"use strict";

var utils = require("../core/utils"),
    dateUtils = require("../../core/utils/date"),
    typeUtils = require("../../core/utils/type"),
    adjust = require("../../core/utils/math").adjust,
    vizUtils = require("../core/utils"),
    extend = require("../../core/utils/extend").extend,
    convertDateUnitToMilliseconds = dateUtils.convertDateUnitToMilliseconds,
    dateToMilliseconds = dateUtils.dateToMilliseconds,
    getLog = utils.getLog,
    math = Math,
    mathAbs = math.abs,
    mathFloor = math.floor,
    mathCeil = math.ceil,
    mathPow = math.pow;

var NUMBER_MULTIPLIERS = [1, 2, 2.5, 5],
    LOGARITHMIC_MULTIPLIERS = [1, 2, 3, 5],
    DATETIME_MULTIPLIERS = {
        millisecond: [1, 2, 5, 10, 25, 50, 100, 250, 500],
        second: [1, 2, 3, 5, 10, 15, 20, 30],
        minute: [1, 2, 3, 5, 10, 15, 20, 30],
        hour: [1, 2, 3, 4, 6, 8, 12],
        day: [1, 2],
        week: [1, 2],
        month: [1, 2, 3, 6]
    },
    DATETIME_MULTIPLIERS_WITH_BIG_WEEKEND = extend({}, DATETIME_MULTIPLIERS, {
        day: [1]
    }),
    DATETIME_MINOR_MULTIPLIERS = {
        millisecond: [1, 2, 5, 10, 25, 50, 100, 250, 500],
        second: [1, 2, 3, 5, 10, 15, 20, 30],
        minute: [1, 2, 3, 5, 10, 15, 20, 30],
        hour: [1, 2, 3, 4, 6, 8, 12],
        day: [1, 2, 3, 7, 14],
        month: [1, 2, 3, 6]
    },
    MINOR_DELIMITERS = [2, 4, 5, 8, 10];

function discreteGenerator(options) {
    return function(data, screenDelta, tickInterval, forceTickInterval) {
        var categories = vizUtils.getCategoriesInfo(data.categories, data.min, data.max).categories,
            interval = categories.length * options.axisDivisionFactor / screenDelta;

        return {
            ticks: categories,
            tickInterval: interval > 4 ? mathCeil(interval) : 1
        };
    };
}

function getValue(value) {
    return value;
}

function getLogValue(base) {
    return function(value) {
        return getLog(value, base);
    };
}

function raiseTo(base) {
    return function(value) {
        return mathPow(base, value);
    };
}

function correctValueByInterval(post, round, getValue) {
    return function(value, interval, min) {
        return post(adjust(round(adjust(getValue(value) / interval)) * interval));
    };
}

function getBusinessDelta(data, breaks) {
    var spacing = 0;
    if(breaks) {
        spacing = breaks.reduce(function(prev, item) {
            return prev + (item.to - item.from);
        }, 0);
    }
    return mathAbs(data.max - data.min - spacing);
}

function getBusinessDeltaLog(base) {
    var getLog = getLogValue(base);
    return function(data, breaks) {
        var spacing = 0;
        if(breaks) {
            spacing = breaks.reduce(function(prev, item) {
                return prev + mathAbs(getLog(item.to / item.from));
            }, 0);
        }
        return mathCeil(mathAbs(getLog(data.max / data.min)) - spacing);
    };
}

function getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor, addTickCount) {
    var count = (screenDelta / axisDivisionFactor) - (addTickCount || 0);
    count = count < 1 ? 1 : count;

    return businessDelta / count;
}

function getMultiplierFactor(interval, factorDelta) {
    return mathPow(10, mathFloor(getLog(interval, 10)) + (factorDelta || 0));
}

function calculateTickInterval(businessDelta, screenDelta, tickInterval, forceTickInterval, axisDivisionFactor, multipliers, allowDecimals, addTickCount) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor, addTickCount),
        factor = getMultiplierFactor(interval, -1),
        result = 1,
        onlyIntegers = allowDecimals === false;

    multipliers = multipliers || NUMBER_MULTIPLIERS;

    if(!forceTickInterval || !tickInterval) {
        if(interval >= 1 || (!onlyIntegers && interval > 0)) {
            interval /= factor;
            result = multipliers.concat(multipliers[0] * 10).map(function(m) { return 10 * m; }).reduce(function(r, m) {
                if(factor === 0.1 && onlyIntegers && m === 25) {
                    return r;
                }
                return r < interval ? m : r;
            }, 0);
            result = adjust(result * factor, factor);
        }

        if(!tickInterval || (!forceTickInterval && tickInterval < result)) {
            tickInterval = result;
        }
    }

    return tickInterval;
}

function calculateMinorTickInterval(businessDelta, screenDelta, tickInterval, axisDivisionFactor) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor);

    return tickInterval || MINOR_DELIMITERS.reduce(function(r, d) {
        var cur = businessDelta / d;
        if(cur >= interval) {
            r = cur;
        }
        return r;
    }, 0);
}

function calculateTickIntervalLog(businessDelta, screenDelta, tickInterval, forceTickInterval, axisDivisionFactor, multipliers, allowDecimals) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor),
        factor = getMultiplierFactor(interval),
        result = 0;

    multipliers = multipliers || LOGARITHMIC_MULTIPLIERS;

    if(factor < 1) {
        factor = 1;
    }
    if(!forceTickInterval || !tickInterval) {
        if(interval > 0) {
            result = multipliers.concat(multipliers[0] * 10).reduce(function(r, m) {
                return r < interval ? m * factor : r;
            }, 0);
        }

        if(!tickInterval || (!forceTickInterval && tickInterval < result)) {
            tickInterval = result;
        }
    }

    return tickInterval;
}

function getDataTimeMultipliers(gapSize) {
    if(gapSize && gapSize > 2) {
        return DATETIME_MULTIPLIERS_WITH_BIG_WEEKEND;
    } else {
        return DATETIME_MULTIPLIERS;
    }
}

function calculateTickIntervalDateTime(businessDelta, screenDelta, tickInterval, forceTickInterval, axisDivisionFactor, multipliers, allowDecimals, addTickCount, gapSize) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor),
        result,
        factor,
        key;

    multipliers = multipliers || getDataTimeMultipliers(gapSize);

    function numbersReducer(interval, key) {
        return function(r, m) {
            if(!r && interval <= convertDateUnitToMilliseconds(key, m)) {
                r = {};
                r[key + 's'] = m;
            }
            return r;
        };
    }

    function yearsReducer(interval, factor) {
        return function(r, m) {
            var years = factor * m;
            if(!r && interval <= convertDateUnitToMilliseconds('year', years) && years !== 2.5) {
                r = { years: years };
            }
            return r;
        };
    }

    if(!forceTickInterval || !tickInterval) {
        for(key in multipliers) {
            result = multipliers[key].reduce(numbersReducer(interval, key), result);
            if(result) {
                break;
            }
        }
        if(!result) {
            for(factor = 1; ; factor *= 10) {
                result = NUMBER_MULTIPLIERS.reduce(yearsReducer(interval, factor), result);
                if(result) {
                    break;
                }
            }
        }

        if(!tickInterval || (!forceTickInterval && dateToMilliseconds(tickInterval) <= dateToMilliseconds(result))) {
            tickInterval = result;
        }
    }

    return tickInterval;
}

function calculateMinorTickIntervalDateTime(businessDelta, screenDelta, tickInterval, axisDivisionFactor) {
    return calculateTickIntervalDateTime(businessDelta, screenDelta, tickInterval, true, axisDivisionFactor, DATETIME_MINOR_MULTIPLIERS);
}

function getTickIntervalByCustomTicks(getValue, postProcess) {
    return function(ticks) {
        if(!ticks) {
            return undefined;
        }
        return postProcess(mathAbs(adjust(getValue(ticks[1]) - getValue(ticks[0])))) || undefined;
    };
}

function addInterval(value, interval) {
    return dateUtils.addInterval(value, interval);
}

function addIntervalLog(base) {
    var riseToBase = raiseTo(base);
    return function(value, interval, min) {
        return riseToBase(addInterval(getLog(value, base), interval));
    };
}

function addIntervalDate(value, interval) {
    return addInterval(value, interval);
}

function addIntervalWithBreaks(addInterval, breaks, correctValue) {
    breaks = breaks.filter(function(b) { return !b.gapSize; });

    return function(value, interval) {
        var breakSize;

        value = addInterval(value, interval);

        if(!breaks.every(function(item) {
            if(value >= addInterval(item.from, interval) && addInterval(value, interval) < item.to) {
                breakSize = item.to - item.from - 2 * (addInterval(item.from, interval) - item.from);
            }
            return !breakSize;
        })) {
            value = correctValue(addInterval(value, breakSize), interval);
        }
        return value;
    };
}

function calculateTicks(addInterval, correctMinValue) {
    return function(min, max, tickInterval, endOnTick, gaps, breaks) {
        var correctTickValue = correctTickValueOnGapSize(addInterval, gaps),
            cur = correctMinValue(min, tickInterval, min),
            ticks = [];

        if(breaks && breaks.length) {
            addInterval = addIntervalWithBreaks(addInterval, breaks, correctMinValue);
        }

        if(cur > max) {
            cur = min;
        }
        cur = correctTickValue(cur);

        while(cur < max) {
            ticks.push(cur);
            cur = correctTickValue(addInterval(cur, tickInterval));
        }
        if(endOnTick || (cur - max === 0)) {
            ticks.push(cur);
        }
        return ticks;
    };
}

function calculateMinorTicks(updateTickInterval, addInterval, correctMinValue, correctTickValue, ceil) {
    return function(min, max, majorTicks, minorTickInterval, tickInterval, breaks, maxCount) {
        var factor = tickInterval / minorTickInterval,
            lastMajor = majorTicks[majorTicks.length - 1],
            firstMajor = majorTicks[0],
            tickBalance = maxCount - 1;

        if(breaks && breaks.length) {
            addInterval = addIntervalWithBreaks(addInterval, breaks, correctMinValue);
        }

        minorTickInterval = updateTickInterval(minorTickInterval, firstMajor, factor);

        if(minorTickInterval === 0) {
            return [];
        }

        //min to first tick
        var cur = correctTickValue(correctMinValue(min, tickInterval, min), minorTickInterval, min),
            ticks = [];

        while(cur < firstMajor && (!tickBalance || tickBalance > 0)) {
            cur >= min && ticks.push(cur);
            tickBalance--;
            cur = addInterval(cur, minorTickInterval);
        }

        //between ticks
        var middleTicks = majorTicks.reduce(function(r, tick) {
            tickBalance = maxCount - 1;
            if(r.prevTick === null) {
                r.prevTick = tick;
                return r;
            }

            minorTickInterval = updateTickInterval(minorTickInterval, tick, factor);
            var cur = correctTickValue(r.prevTick, minorTickInterval, min);
            while(cur < tick && (!tickBalance || tickBalance > 0)) {
                cur !== r.prevTick && r.minors.push(cur);
                tickBalance--;
                cur = addInterval(cur, minorTickInterval);
            }

            r.prevTick = tick;
            return r;
        }, { prevTick: null, minors: [] });

        ticks = ticks.concat(middleTicks.minors);

        //last tick to max
        minorTickInterval = updateTickInterval(minorTickInterval, ceil(max, tickInterval, min), factor);
        cur = correctTickValue(lastMajor, minorTickInterval, min);
        while(cur < max) {
            ticks.push(cur);
            cur = addInterval(cur, minorTickInterval);
        }

        if((lastMajor - max) !== 0 && (cur - max === 0)) {
            ticks.push(cur);
        }

        return ticks;
    };
}

function filterTicks(ticks, breaks) {
    if(breaks.length) {
        var result = breaks.reduce(function(result, b) {
            var tmpTicks = [];
            for(var i = result[1]; i < ticks.length; i++) {
                var tickValue = ticks[i];

                if(tickValue < b.from) {
                    tmpTicks.push(tickValue);
                }
                if(tickValue >= b.to) {
                    break;
                }
            }
            return [result[0].concat(tmpTicks), i];
        }, [[], 0]);

        return result[0].concat(ticks.slice(result[1]));
    }
    return ticks;
}

function correctTickValueOnGapSize(addInterval, breaks) {
    return function(value) {
        var gapSize;

        if(!breaks.every(function(item) {
            var tickInBreak = value >= item.from && value < item.to;
            if(tickInBreak) {
                gapSize = item.gapSize;
            }
            return !gapSize;
        })) {
            value = addInterval(value, gapSize);
        }

        return value;
    };
}

function generator(options, getBusinessDelta, calculateTickInterval, calculateMinorTickInterval, getMajorTickIntervalByCustomTicks, getMinorTickIntervalByCustomTicks, convertTickInterval, calculateTicks, calculateMinorTicks, processScaleBreaks) {
    function processCustomTicks(customTicks) {
        return {
            tickInterval: getMajorTickIntervalByCustomTicks(customTicks.majors),
            ticks: customTicks.majors || [],
            minorTickInterval: getMinorTickIntervalByCustomTicks(customTicks.minors),
            minorTicks: customTicks.minors || []
        };
    }

    function correctUserTickInterval(tickInterval, businessDelta, limit) {
        if(tickInterval && (businessDelta / convertTickInterval(tickInterval)) >= limit + 1) {
            options.incidentOccurred("W2003");
            tickInterval = undefined;
        }
        return tickInterval;
    }

    function generateMajorTicks(ticks, data, businessDelta, screenDelta, tickInterval, forceTickInterval, customTicks, breaks) {
        if(customTicks.majors && !options.showCalculatedTicks) { //DEPRECATED IN 15_2
            ticks.breaks = breaks;
            return ticks;
        }

        var gaps = breaks.filter(function(b) { return b.gapSize; }),
            majorTicks;

        tickInterval = correctUserTickInterval(tickInterval, businessDelta, screenDelta);
        tickInterval = calculateTickInterval(
            businessDelta,
            screenDelta,
            tickInterval,
            forceTickInterval,
            options.axisDivisionFactor,
            options.numberMultipliers,
            options.allowDecimals,
            breaks.length,
            gaps[0] && gaps[0].gapSize.days
        );

        majorTicks = calculateTicks(data.min, data.max, tickInterval, options.endOnTick, gaps, breaks);

        breaks = processScaleBreaks(breaks, tickInterval, screenDelta, options.axisDivisionFactor);

        majorTicks = filterTicks(majorTicks, breaks);
        ticks.breaks = breaks;

        ticks.ticks = ticks.ticks.concat(majorTicks);
        ticks.tickInterval = tickInterval;
        return ticks;
    }

    function generateMinorTicks(ticks, data, businessDelta, screenDelta, minorTickInterval, minorTickCount, customTicks) {
        if(!options.calculateMinors) {
            return ticks;
        }
        if(customTicks.minors && !options.showMinorCalculatedTicks) { //DEPRECATED IN 15_2
            return ticks;
        }

        var minorBusinessDelta = convertTickInterval(ticks.tickInterval),
            minorScreenDelta = screenDelta * minorBusinessDelta / businessDelta,
            majorTicks = ticks.ticks,
            breaks = ticks.breaks;

        if(!minorTickInterval && minorTickCount) {
            minorTickInterval = getMinorTickIntervalByCustomTicks([minorBusinessDelta / (minorTickCount + 1), minorBusinessDelta / (minorTickCount + 1) * 2]);
        } else {
            minorTickCount = undefined;
        }

        minorTickInterval = correctUserTickInterval(minorTickInterval, minorBusinessDelta, minorScreenDelta);

        minorTickInterval = calculateMinorTickInterval(minorBusinessDelta, minorScreenDelta, minorTickInterval, options.minorAxisDivisionFactor);
        ticks.minorTicks = filterTicks(ticks.minorTicks.concat(calculateMinorTicks(data.min, data.max, majorTicks, minorTickInterval, ticks.tickInterval, breaks, minorTickCount)), breaks);
        ticks.minorTickInterval = minorTickInterval;

        return ticks;
    }

    return function(data, screenDelta, tickInterval, forceTickInterval, customTicks, minorTickInterval, minorTickCount, breaks) {
        customTicks = customTicks || {};

        var businessDelta = getBusinessDelta(data, breaks),
            result = processCustomTicks(customTicks);

        if(!isNaN(businessDelta)) {
            result = generateMajorTicks(result, data, businessDelta, screenDelta, tickInterval, forceTickInterval, customTicks, breaks || []);
            result = generateMinorTicks(result, data, businessDelta, screenDelta, minorTickInterval, minorTickCount, customTicks);
        }

        return result;
    };
}

function getScaleBreaksProcessor(convertTickInterval, getValue, addCorrection) {
    return function(breaks, tickInterval, screenDelta, axisDivisionFactor) {
        var interval = convertTickInterval(tickInterval),
            maxTickCount = Math.floor(screenDelta / axisDivisionFactor),
            correction = maxTickCount > breaks.length ? interval / 2 : interval / 100;

        return breaks.reduce(function(result, b) {
            var from = addCorrection(b.from, correction),
                to = addCorrection(b.to, -correction);
            if(getValue(to) - getValue(from) < interval && !b.gapSize) {
                return result;
            }
            if(b.gapSize) {
                return result.concat([b]);
            }
            return result.concat([{
                from: from,
                to: to,
                cumulativeWidth: b.cumulativeWidth
            }]);
        }, []);
    };
}

function numericGenerator(options) {
    var floor = correctValueByInterval(getValue, mathFloor, getValue),
        ceil = correctValueByInterval(getValue, mathCeil, getValue),
        calculateTickIntervalByCustomTicks = getTickIntervalByCustomTicks(getValue, getValue);

    return generator(
        options,
        getBusinessDelta,
        calculateTickInterval,
        calculateMinorTickInterval,
        calculateTickIntervalByCustomTicks,
        calculateTickIntervalByCustomTicks,
        getValue,
        calculateTicks(addInterval, options.endOnTick ? floor : ceil),
        calculateMinorTicks(getValue, addInterval, floor, addInterval, getValue),
        getScaleBreaksProcessor(getValue, getValue, function(value, correction) {
            return value + correction;
        })
    );
}

function logarithmicGenerator(options) {
    function updateTickInterval(tickInterval, tick, factor) {
        return tick / factor;
    }

    var base = options.logBase,
        raise = raiseTo(base),
        log = getLogValue(base),
        floor = correctValueByInterval(raise, mathFloor, log),
        ceil = correctValueByInterval(raise, mathCeil, log),
        ceilNumber = correctValueByInterval(getValue, mathCeil, getValue);

    return generator(
        options,
        getBusinessDeltaLog(base),
        calculateTickIntervalLog,
        calculateMinorTickInterval,
        getTickIntervalByCustomTicks(log, getValue),
        getTickIntervalByCustomTicks(getValue, getValue),
        getValue,
        calculateTicks(addIntervalLog(base), options.endOnTick ? floor : ceil),
        calculateMinorTicks(updateTickInterval, addInterval, floor, ceilNumber, ceil),
        getScaleBreaksProcessor(getValue, log, function(value, correction) {
            return raise(log(value) + correction);
        })
    );
}

function dateGenerator(options) {
    function floor(value, interval) {
        var floorNumber = correctValueByInterval(getValue, mathFloor, getValue),
            intervalObject = typeUtils.isString(interval) ? dateUtils.getDateIntervalByString(interval.toLowerCase()) : interval,
            divider = dateToMilliseconds(interval);

        value = dateUtils.correctDateWithUnitBeginning(value, intervalObject, null, options.firstDayOfWeek);

        if("years" in intervalObject) {
            value.setFullYear(floorNumber(value.getFullYear(), intervalObject.years, 0));
        } else if("quarters" in intervalObject) {
            //correctDateWithUnitBeginning is enough here
        } else if("months" in intervalObject) {
            value.setMonth(floorNumber(value.getMonth(), intervalObject.months, 0));
        } else if("weeks" in intervalObject) {
            //correctDateWithUnitBeginning is enough here
        } else if("days" in intervalObject) {
            //correctDateWithUnitBeginning is enough here
        } else if("hours" in intervalObject) {
            value.setHours(floorNumber(value.getHours(), intervalObject.hours, 0));
        } else if("minutes" in intervalObject) {
            value.setMinutes(floorNumber(value.getMinutes(), intervalObject.minutes, 0));
        } else if("seconds" in intervalObject) {
            value.setSeconds(floorNumber(value.getSeconds(), intervalObject.seconds, 0));
        } else if("milliseconds" in intervalObject) {
            value = new Date(mathFloor(value.getTime() / divider) * divider);
        }

        return value;
    }

    function ceil(value, interval) {
        var newValue = floor(value, interval);
        if(value - newValue > 0) {
            newValue = addIntervalDate(newValue, interval);
        }
        return newValue;
    }

    var calculateTickIntervalByCustomTicks = getTickIntervalByCustomTicks(getValue, dateUtils.convertMillisecondsToDateUnits);

    return generator(
        options,
        getBusinessDelta,
        calculateTickIntervalDateTime,
        calculateMinorTickIntervalDateTime,
        calculateTickIntervalByCustomTicks,
        calculateTickIntervalByCustomTicks,
        dateToMilliseconds,
        calculateTicks(addIntervalDate, options.endOnTick ? floor : ceil),
        calculateMinorTicks(getValue, addIntervalDate, floor, addIntervalDate, getValue),
        getScaleBreaksProcessor(dateToMilliseconds, getValue, function(value, correction) {
            return new Date(value.getTime() + correction);
        })
    );
}

exports.tickGenerator = function(options) {
    var result;

    if(options.axisType === "discrete") {
        result = discreteGenerator(options);
    } else if(options.axisType === "logarithmic") {
        result = logarithmicGenerator(options);
    } else if(options.dataType === "datetime") {
        result = dateGenerator(options);
    } else {
        result = numericGenerator(options);
    }

    return result;
};
