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
    MINOR_DELIMITERS = [2, 4, 5, 8, 10],
    VISIBILITY_DELIMITER = 3;

const MINUTE = 60 * 1000;

function discreteGenerator(options) {
    return function(data, screenDelta, tickInterval, forceTickInterval) {
        var categories = vizUtils.getCategoriesInfo(data.categories, data.min, data.max).categories,
            interval = categories.length * options.axisDivisionFactor / screenDelta;

        return {
            ticks: categories,
            tickInterval: mathCeil(interval)
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
    return function(value, interval) {
        return adjust(post(round(adjust(getValue(value) / interval)) * interval));
    };
}

function correctMinValueByEndOnTick(floorFunc, ceilFunc, resolveEndOnTick, endOnTick) {
    if(typeUtils.isDefined(endOnTick)) {
        return endOnTick ? floorFunc : ceilFunc;
    }
    return function(value, interval, businessViewInfo, forceEndOnTick) {
        var ceilTickValue = ceilFunc(value, interval),
            floorTickValue = floorFunc(value, interval);

        if(value - floorTickValue === 0 || !typeUtils.isDefined(businessViewInfo) || resolveEndOnTick(value, floorTickValue, interval, businessViewInfo) || forceEndOnTick) {
            return floorTickValue;
        }
        return ceilTickValue;
    };
}

function resolveEndOnTick(curValue, tickValue, interval, businessViewInfo) {
    var prevTickDataDiff = interval - mathAbs(tickValue - curValue),
        intervalCount = math.max(mathCeil(businessViewInfo.businessDelta / interval), 2),
        businessRatio = businessViewInfo.screenDelta / (intervalCount * interval),
        potentialTickScreenDiff = math.round(businessRatio * prevTickDataDiff),
        delimiterFactor = getLog(businessRatio * interval / businessViewInfo.axisDivisionFactor, 2) + 1,
        delimiterMultiplier = (businessViewInfo.isSpacedMargin ? 2 : 1) * delimiterFactor,
        screenDelimiter = math.round(VISIBILITY_DELIMITER * delimiterMultiplier);
    return businessViewInfo.businessDelta > businessViewInfo.interval && potentialTickScreenDiff >= screenDelimiter;
}

function resolveEndOnTickLog(base) {
    return function(curValue, tickValue, interval, businessViewInfo) {
        return resolveEndOnTick(getLog(curValue, base), getLog(tickValue, base), interval, businessViewInfo);
    };
}

function resolveEndOnTickDate(curValue, tickValue, interval, businessViewInfo) {
    return resolveEndOnTick(curValue.valueOf(), tickValue.valueOf(), dateToMilliseconds(interval), businessViewInfo);
}

function resolveExtraTickForHiddenDataPoint(checkDataVisibility, extremum, tick, businessViewInfo, isMin) {
    var screenRatio = businessViewInfo.screenDelta / businessViewInfo.businessDelta,
        extDir = isMin ? 1 : -1,
        tickDir = isMin ? -1 : 1;
    return checkDataVisibility && screenRatio * (extremum * extDir + tick * tickDir) < VISIBILITY_DELIMITER;
}

function resolveExtraTickForHiddenDataPointLog(base) {
    return function(checkDataVisibility, extremum, tick, businessViewInfo, isMin) {
        return resolveExtraTickForHiddenDataPoint(checkDataVisibility, getLog(extremum, base), getLog(tick, base), businessViewInfo, isMin);
    };
}

function resolveExtraTickForHiddenDataPointDate(checkDataVisibility, extremum, tick, businessViewInfo, isMin) {
    return resolveExtraTickForHiddenDataPoint(checkDataVisibility, extremum.valueOf(), tick.valueOf(), businessViewInfo, isMin);
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

function calculateTickInterval(
    businessDelta,
    screenDelta,
    tickInterval,
    forceTickInterval,
    axisDivisionFactor,
    multipliers,
    allowDecimals,
    addTickCount,
    _,
    minTickInterval) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor, addTickCount),
        result = 1,
        onlyIntegers = allowDecimals === false;

    if(!forceTickInterval || !tickInterval) {
        if(interval >= 1 || (!onlyIntegers && interval > 0)) {
            result = adjustInterval(interval, multipliers, onlyIntegers);
        }

        if(!tickInterval || (!forceTickInterval && tickInterval < result)) {
            tickInterval = result;
        }
    }

    if(!forceTickInterval && minTickInterval) {
        minTickInterval = adjustInterval(minTickInterval, multipliers, onlyIntegers);
        if(minTickInterval > tickInterval) {
            tickInterval = minTickInterval;
        }
    }

    return tickInterval;
}

function adjustInterval(interval, multipliers, onlyIntegers) {
    var factor = getMultiplierFactor(interval, -1),
        result = 1;

    multipliers = multipliers || NUMBER_MULTIPLIERS;

    if(interval > 0) {
        interval /= factor;
        result = multipliers.concat(multipliers[0] * 10).map(function(m) { return 10 * m; }).reduce(function(r, m) {
            if(factor === 0.1 && onlyIntegers && m === 25) {
                return r;
            }
            return r < interval ? m : r;
        }, 0);
        result = adjust(result * factor, factor);
    }
    return result;
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

function getCalculateTickIntervalLog(skipCalculationLimits) {
    return function(
        businessDelta,
        screenDelta,
        tickInterval,
        forceTickInterval,
        axisDivisionFactor,
        multipliers,
        allowDecimals,
        _,
        __,
        minTickInterval
    ) {
        let interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor);
        let result = 0;
        const adjustInterval = getAdjustIntervalLog(skipCalculationLimits);

        if(!forceTickInterval || !tickInterval) {
            if(interval > 0) {
                result = adjustInterval(interval, multipliers);
            }

            if(!tickInterval || (!forceTickInterval && tickInterval < result)) {
                tickInterval = result;
            }
        }

        if(!forceTickInterval && minTickInterval) {
            minTickInterval = adjustInterval(minTickInterval, multipliers);
            if(minTickInterval > tickInterval) {
                tickInterval = minTickInterval;
            }
        }

        return tickInterval;
    };
}

function getAdjustIntervalLog(skipCalculationLimits) {
    return function(interval, multipliers) {
        var factor = getMultiplierFactor(interval);

        multipliers = multipliers || LOGARITHMIC_MULTIPLIERS;

        if(!skipCalculationLimits && factor < 1) {
            factor = 1;
        }
        return multipliers.concat(multipliers[0] * 10).reduce(function(r, m) {
            return r < interval ? m * factor : r;
        }, 0);
    };
}

function getDataTimeMultipliers(gapSize) {
    if(gapSize && gapSize > 2) {
        return DATETIME_MULTIPLIERS_WITH_BIG_WEEKEND;
    } else {
        return DATETIME_MULTIPLIERS;
    }
}

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

function calculateTickIntervalDateTime(
    businessDelta,
    screenDelta,
    tickInterval,
    forceTickInterval,
    axisDivisionFactor,
    multipliers,
    allowDecimals,
    addTickCount,
    gapSize,
    minTickInterval
) {
    var interval = getIntervalByFactor(businessDelta, screenDelta, axisDivisionFactor),
        result;

    if(!forceTickInterval || !tickInterval) {
        result = adjustIntervalDateTime(interval, multipliers, null, gapSize);

        if(!tickInterval || (!forceTickInterval && dateToMilliseconds(tickInterval) <= dateToMilliseconds(result))) {
            tickInterval = result;
        }
    }

    if(!forceTickInterval && minTickInterval) {
        minTickInterval = adjustIntervalDateTime(minTickInterval, multipliers, null, gapSize);
        if(dateToMilliseconds(minTickInterval) > dateToMilliseconds(tickInterval)) {
            tickInterval = minTickInterval;
        }
    }


    return tickInterval;
}

function adjustIntervalDateTime(interval, multipliers, _, gapSize) {
    var result,
        factor,
        key;

    multipliers = multipliers || getDataTimeMultipliers(gapSize);

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
    return result;
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

function addInterval(value, interval, isNegative) {
    return dateUtils.addInterval(value, interval, isNegative);
}

function addIntervalLog(base) {
    var riseToBase = raiseTo(base);
    return function(value, interval, isNegative) {
        return riseToBase(addInterval(getLog(value, base), interval, isNegative));
    };
}

function addIntervalDate(value, interval, isNegative) {
    return addInterval(value, interval, isNegative);
}

function addIntervalWithBreaks(addInterval, breaks, correctValue) {
    breaks = breaks.filter(function(b) { return !b.gapSize; });

    return function(value, interval, isNegative) {
        var breakSize;

        value = addInterval(value, interval, isNegative);

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

function calculateTicks(addInterval, correctMinValue, adjustInterval, resolveEndOnTick, resolveExtraTickForHiddenDataPoint) {
    return function(data, tickInterval, endOnTick, gaps, breaks, businessDelta, screenDelta, axisDivisionFactor, generateExtraTick) {
        var correctTickValue = correctTickValueOnGapSize(addInterval, gaps),
            min = data.min,
            max = data.max,
            businessViewInfo = {
                screenDelta: screenDelta,
                businessDelta: businessDelta,
                axisDivisionFactor: axisDivisionFactor,
                isSpacedMargin: data.isSpacedMargin,
                interval: tickInterval
            },
            cur = correctMinValue(min, tickInterval, businessViewInfo),
            ticks = [];

        if(breaks && breaks.length) {
            addInterval = addIntervalWithBreaks(addInterval, breaks, correctMinValue);
        }

        if(cur > max) {
            cur = correctMinValue(min, adjustInterval(businessDelta / 2), businessViewInfo);
            if(cur > max) {
                endOnTick = true;
                cur = correctMinValue(min, tickInterval, businessViewInfo, endOnTick);
            }
        }
        cur = correctTickValue(cur);

        let prev;
        while(cur < max && cur !== prev || generateExtraTick && cur <= max) {
            ticks.push(cur);
            prev = cur;
            cur = correctTickValue(addInterval(cur, tickInterval));
        }
        if(endOnTick || (cur - max === 0) || (!typeUtils.isDefined(endOnTick) && resolveEndOnTick(max, cur, tickInterval, businessViewInfo))) {
            ticks.push(cur);
        }
        if(ticks.length > 0) {
            if(ticks[0].valueOf() > 0 && resolveExtraTickForHiddenDataPoint(data.checkMinDataVisibility, min, ticks[0], businessViewInfo, true)) {
                cur = addInterval(ticks[0], tickInterval, true);
                ticks.unshift(cur);
            } else if(ticks[ticks.length - 1].valueOf() < 0 && resolveExtraTickForHiddenDataPoint(data.checkMaxDataVisibility, max, ticks[ticks.length - 1], businessViewInfo, false)) {
                cur = addInterval(ticks[ticks.length - 1], tickInterval);
                ticks.push(cur);
            }
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

        // min to first tick
        var cur = correctTickValue(correctMinValue(min, tickInterval, min), minorTickInterval),
            ticks = [];

        while(cur < firstMajor && (!tickBalance || tickBalance > 0)) {
            cur >= min && ticks.push(cur);
            tickBalance--;
            cur = addInterval(cur, minorTickInterval);
        }

        // between ticks
        var middleTicks = majorTicks.reduce(function(r, tick) {
            tickBalance = maxCount - 1;
            if(r.prevTick === null) {
                r.prevTick = tick;
                return r;
            }

            minorTickInterval = updateTickInterval(minorTickInterval, tick, factor);
            var cur = correctTickValue(r.prevTick, minorTickInterval);
            while(cur < tick && (!tickBalance || tickBalance > 0)) {
                cur !== r.prevTick && r.minors.push(cur);
                tickBalance--;
                cur = addInterval(cur, minorTickInterval);
            }

            r.prevTick = tick;
            return r;
        }, { prevTick: null, minors: [] });

        ticks = ticks.concat(middleTicks.minors);

        // last tick to max
        minorTickInterval = updateTickInterval(minorTickInterval, ceil(max, tickInterval, min), factor);
        cur = correctTickValue(lastMajor, minorTickInterval);
        let prev;
        while(cur < max && cur !== prev) {
            ticks.push(cur);
            prev = cur;
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
        if(customTicks.majors && !options.showCalculatedTicks) { // DEPRECATED IN 15_2
            ticks.breaks = breaks;
            return ticks;
        }

        var gaps = breaks.filter(function(b) { return b.gapSize; }),
            majorTicks;

        tickInterval = options.skipCalculationLimits ? tickInterval : correctUserTickInterval(tickInterval, businessDelta, screenDelta);
        tickInterval = calculateTickInterval(
            businessDelta,
            screenDelta,
            tickInterval,
            forceTickInterval,
            options.axisDivisionFactor,
            options.numberMultipliers,
            options.allowDecimals,
            breaks.length,
            gaps[0] && gaps[0].gapSize.days,
            options.minTickInterval
        );

        if(!options.skipTickGeneration) {
            majorTicks = calculateTicks(data, tickInterval, options.endOnTick, gaps, breaks, businessDelta, screenDelta, options.axisDivisionFactor, options.generateExtraTick);

            breaks = processScaleBreaks(breaks, tickInterval, screenDelta, options.axisDivisionFactor);

            majorTicks = filterTicks(majorTicks, breaks);
            ticks.breaks = breaks;

            ticks.ticks = ticks.ticks.concat(majorTicks);
        }
        ticks.tickInterval = tickInterval;
        return ticks;
    }

    function generateMinorTicks(ticks, data, businessDelta, screenDelta, minorTickInterval, minorTickCount, customTicks) {
        if(!options.calculateMinors) {
            return ticks;
        }
        if(customTicks.minors && !options.showMinorCalculatedTicks) { // DEPRECATED IN 15_2
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
            if(!options.skipTickGeneration && businessDelta > 0) {
                result = generateMinorTicks(result, data, businessDelta, screenDelta, minorTickInterval, minorTickCount, customTicks);
            }
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
        calculateTicks(addInterval, correctMinValueByEndOnTick(floor, ceil, resolveEndOnTick, options.endOnTick), adjustInterval, resolveEndOnTick, resolveExtraTickForHiddenDataPoint),
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
        getCalculateTickIntervalLog(options.skipCalculationLimits),
        calculateMinorTickInterval,
        getTickIntervalByCustomTicks(log, getValue),
        getTickIntervalByCustomTicks(getValue, getValue),
        getValue,
        calculateTicks(addIntervalLog(base), correctMinValueByEndOnTick(floor, ceil, resolveEndOnTickLog(base), options.endOnTick), getAdjustIntervalLog(options.skipCalculationLimits), resolveEndOnTickLog(base), resolveExtraTickForHiddenDataPointLog(base)),
        calculateMinorTicks(updateTickInterval, addInterval, floor, ceilNumber, ceil),
        getScaleBreaksProcessor(getValue, log, function(value, correction) {
            return raise(log(value) + correction);
        })
    );
}

function dateGenerator(options) {
    function floor(value, interval) {
        const floorNumber = correctValueByInterval(getValue, mathFloor, getValue);
        let intervalObject = typeUtils.isString(interval) ? dateUtils.getDateIntervalByString(interval.toLowerCase()) : interval;
        const divider = dateToMilliseconds(interval);

        if(intervalObject.days % 7 === 0 || interval.quarters) {
            intervalObject = adjustIntervalDateTime(divider);
        }

        const correctDateWithUnitBeginning = v => dateUtils.correctDateWithUnitBeginning(v, intervalObject, null, options.firstDayOfWeek);
        const floorAtStartDate = v => new Date(mathFloor((v.getTime() - v.getTimezoneOffset() * MINUTE) / divider) * divider + v.getTimezoneOffset() * MINUTE);

        value = correctDateWithUnitBeginning(value);

        if("years" in intervalObject) {
            value.setFullYear(floorNumber(value.getFullYear(), intervalObject.years, 0));
        } else if("quarters" in intervalObject) {
            value = correctDateWithUnitBeginning(floorAtStartDate(value));
        } else if("months" in intervalObject) {
            value.setMonth(floorNumber(value.getMonth(), intervalObject.months, 0));
        } else if("weeks" in intervalObject || "days" in intervalObject) {
            value = correctDateWithUnitBeginning(floorAtStartDate(value));
        } else if("hours" in intervalObject) {
            value.setHours(floorNumber(value.getHours(), intervalObject.hours, 0));
        } else if("minutes" in intervalObject) {
            value.setMinutes(floorNumber(value.getMinutes(), intervalObject.minutes, 0));
        } else if("seconds" in intervalObject) {
            value.setSeconds(floorNumber(value.getSeconds(), intervalObject.seconds, 0));
        } else if("milliseconds" in intervalObject) {
            value = floorAtStartDate(value);
        }

        return value;
    }

    function ceil(value, interval) {
        var newValue = floor(value, interval);

        while(value - newValue > 0) {
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
        calculateTicks(addIntervalDate, correctMinValueByEndOnTick(floor, ceil, resolveEndOnTickDate, options.endOnTick), adjustIntervalDateTime, resolveEndOnTickDate, resolveExtraTickForHiddenDataPointDate),
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
