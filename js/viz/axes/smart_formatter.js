"use strict";

var _format = require("../core/format"),
    formatHelper = require("../../format_helper"),
    typeUtils = require("../../core/utils/type"),
    dateUtils = require("../../core/utils/date"),
    getLog = require("../core/utils").getLog,
    isDefined = typeUtils.isDefined,
    isFunction = typeUtils.isFunction,
    isExponential = typeUtils.isExponential,
    floor = Math.floor,
    adjust = require("../../core/utils/math").adjust,
    getPrecision = require("../../core/utils/math").getPrecision,
    abs = Math.abs,
    EXPONENTIAL = "exponential",
    formats = ["fixedPoint", "thousands", "millions", "billions", "trillions", EXPONENTIAL],
    dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];

function log10(value) {
    return adjust(getLog(value, 10));
}

function getDatesDifferences(prevDate, curDate, nextDate, tickFormat) {
    var prevDifferences,
        nextDifferences,
        dateUnitInterval,
        tickFormatIndex,
        dateUnitsLength = dateUnitIntervals.length,
        i,
        j;

    if(tickFormat === "week") {
        tickFormat = "day";
    } else if(tickFormat === "quarter") {
        tickFormat = "month";
    } else if(tickFormat === "shorttime") {
        tickFormat = "hour";
    } else if(tickFormat === "longtime") {
        tickFormat = "second";
    }

    tickFormatIndex = dateUnitIntervals.indexOf(tickFormat);

    if(nextDate) {
        nextDifferences = dateUtils.getDatesDifferences(curDate, nextDate);
        prevDifferences = dateUtils.getDatesDifferences(curDate, prevDate);
        if(nextDifferences[tickFormat]) {
            for(i = dateUnitsLength - 1; i >= tickFormatIndex; i--) {
                dateUnitInterval = dateUnitIntervals[i];
                if(i === tickFormatIndex) {
                    setDateUnitInterval(nextDifferences, tickFormatIndex + (nextDifferences["millisecond"] ? 2 : 1));
                } else if(nextDifferences[dateUnitInterval]) {
                    resetDateUnitInterval(nextDifferences, i);
                    break;
                }
            }
        }
    } else {
        prevDifferences = dateUtils.getDatesDifferences(prevDate, curDate);
        for(i = dateUnitsLength - 1; i >= tickFormatIndex; i--) {
            dateUnitInterval = dateUnitIntervals[i];
            if(prevDifferences[dateUnitInterval]) {
                if(i - tickFormatIndex > 1) {
                    for(j = tickFormatIndex + 1; j >= 0; j--) {
                        resetDateUnitInterval(prevDifferences, j);
                    }
                    break;
                } else if(isDateTimeStart(curDate, dateUnitInterval)) {
                    for(j = i - 1; j > 0; j--) {
                        resetDateUnitInterval(prevDifferences, j);
                    }
                    break;
                }
            }
        }
    }
    return nextDate ? nextDifferences : prevDifferences;
}

function isDateTimeStart(date, dateUnitInterval) {
    var unitNumbers = [date.getMilliseconds(), date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth()],
        unitIndex = dateUnitIntervals.indexOf(dateUnitInterval),
        i;
    for(i = 0; i < unitIndex; i++) {
        if((i === 4 && unitNumbers[i] !== 1) || (i !== 4 && unitNumbers[i] !== 0)) {
            return false;
        }
    }
    return true;
}

function resetDateUnitInterval(differences, intervalIndex) {
    var dateUnitInterval = dateUnitIntervals[intervalIndex];

    if(differences[dateUnitInterval]) {
        differences[dateUnitInterval] = false;
        differences.count--;
    }
}

function setDateUnitInterval(differences, intervalIndex) {
    var dateUnitInterval = dateUnitIntervals[intervalIndex];

    if(differences[dateUnitInterval] === false) {
        differences[dateUnitInterval] = true;
        differences.count++;
    }
}

function getNoZeroIndex(str) {
    return str.length - parseInt(str).toString().length;
}

function getCoefficient(value) {
    return abs(parseFloat(value.toString().split("e")[1]));
}

function getTransitionTickIndex(ticks, value) {
    var i,
        curDiff,
        minDiff,
        nearestTickIndex = 0;

    minDiff = abs(value - ticks[0]);
    for(i = 1; i < ticks.length; i++) {
        curDiff = abs(value - ticks[i]);
        if(curDiff < minDiff) {
            minDiff = curDiff;
            nearestTickIndex = i;
        }
    }

    return nearestTickIndex;
}

function smartFormatter(tick, options) {
    var tickInterval = options.tickInterval,
        tickIntervalIndex,
        tickIndex,
        actualIndex,
        stringTick = abs(tick).toString(),
        precision = 0,
        typeFormat,
        typeFormatter,
        offset = 0,
        separatedTickInterval,
        indexOfFormat = 0,
        indexOfTick = -1,
        datesDifferences,
        format = options.labelOptions.format,
        ticks = options.ticks,
        log10Tick,
        prevDateIndex,
        nextDateIndex;

    if(!isDefined(format) && isDefined(tickInterval) && options.type !== "discrete") {
        if(options.dataType !== "datetime") {
            if(ticks.length && ticks.indexOf(tick) === -1) {
                indexOfTick = getTransitionTickIndex(ticks, tick);
                tickInterval = adjust(abs(tick - ticks[indexOfTick]), tick);
            }

            separatedTickInterval = tickInterval.toString().split(".");

            if(options.type === "logarithmic") {
                log10Tick = tick !== 0 ? log10(abs(tick)) : 1;
                if(log10Tick > 0) {
                    typeFormat = formats[floor(log10Tick / 3)] || EXPONENTIAL;
                } else {
                    if(log10Tick < -4) {
                        typeFormat = EXPONENTIAL;
                    } else {
                        precision = undefined;
                    }
                }
            } else {
                if(separatedTickInterval.length > 1 && !isExponential(tickInterval)) {
                    precision = separatedTickInterval[1].length;
                    typeFormat = formats[indexOfFormat];
                } else {
                    if(isExponential(tickInterval) && (stringTick.indexOf(".") !== -1 || isExponential(tick))) {
                        typeFormat = EXPONENTIAL;
                        if(!isExponential(tick)) {
                            precision = abs(getNoZeroIndex(stringTick.split(".")[1]) - getCoefficient(tickInterval) + 1);
                        } else {
                            precision = Math.max(abs(getCoefficient(tick) - getCoefficient(tickInterval)), abs(getPrecision(tick) - getPrecision(tickInterval)));
                        }
                    } else {
                        tickIntervalIndex = floor(log10(tickInterval));
                        actualIndex = tickIndex = (tick !== 0) ? floor(log10(abs(tick))) : 1;

                        if(tickIndex - tickIntervalIndex >= 2) {
                            actualIndex = tickIntervalIndex;
                        }

                        indexOfFormat = floor(actualIndex / 3);
                        if(indexOfFormat < 5) {
                            offset = indexOfFormat * 3;
                            if(tickIntervalIndex - offset === 2 && tickIndex >= 3) {
                                indexOfFormat++;
                                offset = indexOfFormat * 3;
                            }
                            typeFormat = formats[indexOfFormat];
                        } else {
                            typeFormat = formats[formats.length - 1];
                        }

                        if(offset !== 0 && stringTick[stringTick.length - offset] !== "0" && typeFormat !== formats[0]) {
                            precision++;
                            if(abs(tickInterval / Math.pow(10, tickIntervalIndex) - 2.5) < 0.0001 && stringTick[stringTick.length - offset + 1] !== "0") {
                                precision++;
                            }
                        } else {
                            if(precision === 0 && tickIndex - tickIntervalIndex === 1 && floor(tickIndex / 3) !== floor(tickIntervalIndex / 3)) {
                                precision = 1;
                                if(abs(tickInterval / Math.pow(10, tickIntervalIndex) - 2.5) < 0.0001) {
                                    precision = 2;
                                }
                            }
                        }
                    }
                }
            }

            format = {
                type: typeFormat,
                precision: precision
            };
        } else {
            typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
            if(options.showTransition && ticks.length) {
                indexOfTick = ticks.map(Number).indexOf(+tick);
                if(indexOfTick === -1) {
                    prevDateIndex = getTransitionTickIndex(ticks, tick);
                } else {
                    prevDateIndex = indexOfTick === 0 ? ticks.length - 1 : indexOfTick - 1;
                    nextDateIndex = indexOfTick === 0 ? 1 : -1;
                }
                datesDifferences = getDatesDifferences(ticks[prevDateIndex], tick, ticks[nextDateIndex], typeFormat);
                typeFormat = formatHelper.getDateFormatByDifferences(datesDifferences, typeFormat);
                if(isFunction(typeFormat)) {
                    typeFormatter = typeFormat;
                    typeFormat = null;
                }
            }
            format = {
                type: typeFormat,
                formatter: typeFormatter
            };
        }
    }

    return _format(tick, { format: format, precision: options.labelOptions.precision });
}

exports.smartFormatter = smartFormatter;
