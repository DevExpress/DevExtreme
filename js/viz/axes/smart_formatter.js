import formatHelper from '../../format_helper';
import { isDefined, isFunction, isExponential, isObject } from '../../core/utils/type';
import dateUtils from '../../core/utils/date';
import { adjust, getPrecision, getExponent } from '../../core/utils/math';
import { getAdjustedLog10 as log10 } from '../core/utils';
const _format = formatHelper.format;
const { abs, floor } = Math;

const EXPONENTIAL = 'exponential';
const formats = ['fixedPoint', 'thousands', 'millions', 'billions', 'trillions', EXPONENTIAL];
const dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];

function getDatesDifferences(prevDate, curDate, nextDate, tickFormat) {
    let prevDifferences;
    let nextDifferences;
    let dateUnitInterval;
    const dateUnitsLength = dateUnitIntervals.length;
    let i;
    let j;

    if(tickFormat === 'week') {
        tickFormat = 'day';
    } else if(tickFormat === 'quarter') {
        tickFormat = 'month';
    } else if(tickFormat === 'shorttime') {
        tickFormat = 'hour';
    } else if(tickFormat === 'longtime') {
        tickFormat = 'second';
    }

    const tickFormatIndex = dateUnitIntervals.indexOf(tickFormat);

    if(nextDate) {
        nextDifferences = dateUtils.getDatesDifferences(curDate, nextDate);
        prevDifferences = dateUtils.getDatesDifferences(curDate, prevDate);
        if(nextDifferences[tickFormat]) {
            for(i = dateUnitsLength - 1; i >= tickFormatIndex; i--) {
                dateUnitInterval = dateUnitIntervals[i];
                if(i === tickFormatIndex) {
                    setDateUnitInterval(nextDifferences, tickFormatIndex + (nextDifferences['millisecond'] ? 2 : 1));
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
    const unitNumbers = [date.getMilliseconds(), date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth()];
    const unitIndex = dateUnitIntervals.indexOf(dateUnitInterval);
    let i;
    for(i = 0; i < unitIndex; i++) {
        if((i === 4 && unitNumbers[i] !== 1) || (i !== 4 && unitNumbers[i] !== 0)) {
            return false;
        }
    }
    return true;
}

function resetDateUnitInterval(differences, intervalIndex) {
    const dateUnitInterval = dateUnitIntervals[intervalIndex];

    if(differences[dateUnitInterval]) {
        differences[dateUnitInterval] = false;
        differences.count--;
    }
}

function setDateUnitInterval(differences, intervalIndex) {
    const dateUnitInterval = dateUnitIntervals[intervalIndex];

    if(differences[dateUnitInterval] === false) {
        differences[dateUnitInterval] = true;
        differences.count++;
    }
}

function getNoZeroIndex(str) {
    return str.length - parseInt(str).toString().length;
}

function getTransitionTickIndex(ticks, value) {
    let i;
    let curDiff;
    let minDiff;
    let nearestTickIndex = 0;

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

function splitDecimalNumber(value) {
    return value.toString().split('.');
}

function createFormat(type) {
    let formatter;

    if(isFunction(type)) {
        formatter = type;
        type = null;
    }
    return { type, formatter };
}

function formatLogarithmicNumber(tick) {
    const log10Tick = log10(abs(tick));
    let type;

    if(log10Tick > 0) {
        type = formats[floor(log10Tick / 3)] || EXPONENTIAL;
    } else {
        if(log10Tick < -4) {
            type = EXPONENTIAL;
        } else {
            return _format(adjust(tick));
        }
    }

    return _format(tick, { type, precision: 0 });
}

function getDateTimeFormat(tick, { showTransition, ticks, tickInterval }) {
    let typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
    let prevDateIndex;
    let nextDateIndex;

    if(showTransition && ticks.length) {
        const indexOfTick = ticks.map(Number).indexOf(+tick);
        if(ticks.length === 1 && indexOfTick === 0) {
            typeFormat = formatHelper.getDateFormatByTicks(ticks);
        } else {
            if(indexOfTick === -1) {
                prevDateIndex = getTransitionTickIndex(ticks, tick);
            } else {
                prevDateIndex = indexOfTick === 0 ? ticks.length - 1 : indexOfTick - 1;
                nextDateIndex = indexOfTick === 0 ? 1 : -1;
            }
            const datesDifferences = getDatesDifferences(ticks[prevDateIndex], tick, ticks[nextDateIndex], typeFormat);
            typeFormat = formatHelper.getDateFormatByDifferences(datesDifferences, typeFormat);
        }
    }
    return createFormat(typeFormat);
}

function getFormatExponential(tick, tickInterval) {
    const stringTick = abs(tick).toString();
    if(!isExponential(tick)) {
        return abs(getNoZeroIndex(stringTick.split('.')[1]) - getExponent(tickInterval) + 1);
    } else {
        return Math.max(abs(getExponent(tick) - getExponent(tickInterval)), abs(getPrecision(tick) - getPrecision(tickInterval)));
    }
}

function getFormatWithModifier(tick, tickInterval) {
    const tickIntervalIndex = floor(log10(tickInterval));
    let tickIndex;
    let typeFormat;
    let precision = 0;
    let actualIndex = tickIndex = floor(log10(abs(tick)));

    if(tickIndex - tickIntervalIndex >= 2) {
        actualIndex = tickIntervalIndex;
    }

    let indexOfFormat = floor(actualIndex / 3);
    let offset = indexOfFormat * 3;
    if(indexOfFormat < 5) {
        if(tickIntervalIndex - offset === 2 && tickIndex >= 3) {
            indexOfFormat++;
            offset = indexOfFormat * 3;
        }
        typeFormat = formats[indexOfFormat];
    } else {
        typeFormat = formats[formats.length - 1];
    }

    if(offset > 0) {
        const separatedTickInterval = splitDecimalNumber(tickInterval / Math.pow(10, offset));
        if(separatedTickInterval[1]) {
            precision = separatedTickInterval[1].length;
        }
    }

    return { precision, type: typeFormat };
}

function getHighDiffFormat(diff) {
    let stop = false;
    for(const i in diff) {
        if(diff[i] === true || i === 'hour' || stop) {
            diff[i] = false;
            stop = true;
        } else if(diff[i] === false) {
            diff[i] = true;
        }
    }

    return createFormat(formatHelper.getDateFormatByDifferences(diff));
}

function getHighAndSelfDiffFormat(diff, interval) {
    let stop = false;
    for(const i in diff) {
        if(stop) {
            diff[i] = false;
        } else if(i === interval) {
            stop = true;
        } else {
            diff[i] = true;
        }
    }

    return createFormat(formatHelper.getDateFormatByDifferences(diff));
}

function formatDateRange(startValue, endValue, tickInterval) {
    const diff = getDatesDifferences(startValue, endValue);
    const typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
    const diffFormatType = formatHelper.getDateFormatByDifferences(diff, typeFormat);
    const diffFormat = createFormat(diffFormatType);
    const values = [];

    if(tickInterval in diff) {
        const rangeFormat = getHighAndSelfDiffFormat(getDatesDifferences(startValue, endValue), tickInterval);
        const value = _format(startValue, rangeFormat);

        if(value) {
            values.push(value);
        }
    } else {
        const rangeFormat = getHighDiffFormat(getDatesDifferences(startValue, endValue));
        const highValue = _format(startValue, rangeFormat);

        if(highValue) {
            values.push(highValue);
        }

        values.push(`${_format(startValue, diffFormat)} - ${_format(endValue, diffFormat)}`);
    }

    return values.join(', ');
}

function processDateInterval(interval) {
    if(isObject(interval)) {
        const dateUnits = Object.keys(interval);
        const sum = dateUnits.reduce((sum, k) => interval[k] + sum, 0);
        if(sum === 1) {
            const dateUnit = dateUnits.filter(k => interval[k] === 1)[0];
            return dateUnit.slice(0, dateUnit.length - 1);
        }
    }
    return interval;
}

export function smartFormatter(tick, options) {
    let tickInterval = options.tickInterval;
    const stringTick = abs(tick).toString();
    let format = options.labelOptions.format;
    const ticks = options.ticks;
    const isLogarithmic = options.type === 'logarithmic';

    if(ticks.length === 1 && ticks.indexOf(tick) === 0 && !isDefined(tickInterval)) {
        tickInterval = abs(tick) >= 1 ? 1 : adjust(1 - abs(tick), tick);
    }

    if(Object.is(tick, -0)) {
        tick = 0;
    }

    if(!isDefined(format) && options.type !== 'discrete' && tick && (options.logarithmBase === 10 || !isLogarithmic)) {
        if(options.dataType !== 'datetime' && isDefined(tickInterval)) {
            if(ticks.length && ticks.indexOf(tick) === -1) {
                const indexOfTick = getTransitionTickIndex(ticks, tick);
                tickInterval = adjust(abs(tick - ticks[indexOfTick]), tick);
            }

            if(isLogarithmic) {
                return formatLogarithmicNumber(tick);
            } else {
                let separatedTickInterval = splitDecimalNumber(tickInterval);
                if(separatedTickInterval < 2) {
                    separatedTickInterval = splitDecimalNumber(tick);
                }
                if(separatedTickInterval.length > 1 && !isExponential(tickInterval)) {
                    format = {
                        type: formats[0],
                        precision: separatedTickInterval[1].length
                    };
                } else {
                    if(isExponential(tickInterval) && (stringTick.indexOf('.') !== -1 || isExponential(tick))) {
                        format = {
                            type: EXPONENTIAL,
                            precision: getFormatExponential(tick, tickInterval)
                        };
                    } else {
                        format = getFormatWithModifier(tick, tickInterval);
                    }
                }
            }
        } else if(options.dataType === 'datetime') {
            format = getDateTimeFormat(tick, options);
        }
    }

    return _format(tick, format);
}

export function formatRange({ startValue, endValue, tickInterval, argumentFormat, axisOptions: { dataType, type, logarithmBase } }) {
    if(type === 'discrete') {
        return '';
    }

    if(dataType === 'datetime') {
        return formatDateRange(startValue, endValue, processDateInterval(tickInterval));
    }

    const formatOptions = {
        ticks: [],
        type,
        dataType,
        tickInterval,
        logarithmBase,
        labelOptions: { format: argumentFormat }
    };
    return `${smartFormatter(startValue, formatOptions)} - ${smartFormatter(endValue, formatOptions)}`;
}
