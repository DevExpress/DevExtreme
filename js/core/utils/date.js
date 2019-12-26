var typeUtils = require('./type'),
    adjust = require('./math').adjust,
    each = require('./iterator').each,
    camelize = require('./inflector').camelize,

    isObject = typeUtils.isObject,
    isString = typeUtils.isString,
    isDate = typeUtils.isDate,
    isDefined = typeUtils.isDefined;

var dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];

var toMilliseconds = function(value) {
    switch(value) {
        case 'millisecond':
            return 1;
        case 'second':
            return toMilliseconds('millisecond') * 1000;
        case 'minute':
            return toMilliseconds('second') * 60;
        case 'hour':
            return toMilliseconds('minute') * 60;
        case 'day':
            return toMilliseconds('hour') * 24;
        case 'week':
            return toMilliseconds('day') * 7;
        case 'month':
            return toMilliseconds('day') * 30;
        case 'quarter':
            return toMilliseconds('month') * 3;
        case 'year':
            return toMilliseconds('day') * 365;
        default:
            return 0;
    }
};

var getDatesInterval = function(startDate, endDate, intervalUnit) {
    var delta = endDate.getTime() - startDate.getTime(),
        millisecondCount = toMilliseconds(intervalUnit) || 1;

    return Math.floor(delta / millisecondCount);
};

var getNextDateUnit = function(unit, withWeeks) {
    var interval = getDateUnitInterval(unit);

    switch(interval) {
        case 'millisecond':
            return 'second';
        case 'second':
            return 'minute';
        case 'minute':
            return 'hour';
        case 'hour':
            return 'day';
        case 'day':
            return withWeeks ? 'week' : 'month';
        case 'week':
            return 'month';
        case 'month':
            return 'quarter';
        case 'quarter':
            return 'year';
        case 'year':
            return 'year';
        default:
            return 0;
    }
};

var convertMillisecondsToDateUnits = function(value) {
    var i,
        dateUnitCount,
        dateUnitInterval,
        dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'],
        result = {};

    for(i = dateUnitIntervals.length - 1; i >= 0; i--) {
        dateUnitInterval = dateUnitIntervals[i];
        dateUnitCount = Math.floor(value / toMilliseconds(dateUnitInterval));
        if(dateUnitCount > 0) {
            result[dateUnitInterval + 's'] = dateUnitCount;
            value -= convertDateUnitToMilliseconds(dateUnitInterval, dateUnitCount);
        }
    }
    return result;
};

var dateToMilliseconds = function(tickInterval) {
    var milliseconds = 0;
    if(isObject(tickInterval)) {
        each(tickInterval, function(key, value) {
            milliseconds += convertDateUnitToMilliseconds(key.substr(0, key.length - 1), value);
        });
    }
    if(isString(tickInterval)) {
        milliseconds = convertDateUnitToMilliseconds(tickInterval, 1);
    }
    return milliseconds;
};

var convertDateUnitToMilliseconds = function(dateUnit, count) {
    return toMilliseconds(dateUnit) * count;
};

// refactor for performance
var getDateUnitInterval = function(tickInterval) {
    var maxInterval = -1,
        i;

    if(isString(tickInterval)) {
        return tickInterval;
    }

    if(isObject(tickInterval)) {
        each(tickInterval, function(key, value) {
            for(i = 0; i < dateUnitIntervals.length; i++) {
                if(value && (key === dateUnitIntervals[i] + 's' || key === dateUnitIntervals[i]) && maxInterval < i) {
                    maxInterval = i;
                }
            }
        });

        return dateUnitIntervals[maxInterval];
    }
    return '';
};

// T375972
var tickIntervalToFormatMap = {
    millisecond: 'millisecond',
    second: 'longtime',
    minute: 'shorttime',
    hour: 'shorttime',
    day: 'day',
    week: 'day',
    month: 'month',
    quarter: 'quarter',
    year: 'year'
};

// Because of changes in formatting (Globalize has been updated) common date formatting has been changed.
// The purpose of the following method is to preserve original dates formatting in axes and range selector slider markers.
function getDateFormatByTickInterval(tickInterval) {
    return tickIntervalToFormatMap[getDateUnitInterval(tickInterval)] || '';
}

var getQuarter = function(month) {
    return Math.floor(month / 3);
};

var getFirstQuarterMonth = function(month) {
    return getQuarter(month) * 3;
};

var correctDateWithUnitBeginning = function(date, dateInterval, withCorrection, firstDayOfWeek) {
    date = new Date(date.getTime());
    var oldDate = new Date(date.getTime()),
        firstQuarterMonth,
        month,
        dateUnitInterval = getDateUnitInterval(dateInterval);

    switch(dateUnitInterval) {
        case 'second':
            date = new Date(Math.floor(oldDate.getTime() / 1000) * 1000);
            break;
        case 'minute':
            date = new Date(Math.floor(oldDate.getTime() / 60000) * 60000);
            break;
        case 'hour':
            date = new Date(Math.floor(oldDate.getTime() / 3600000) * 3600000);
            break;
        case 'year':
            date.setMonth(0);
            /* falls through */
        case 'month':
            date.setDate(1);
            /* falls through */
        case 'day':
            date.setHours(0, 0, 0, 0);
            break;
        case 'week':
            date = getFirstWeekDate(date, firstDayOfWeek || 0);
            date.setHours(0, 0, 0, 0);
            break;
        case 'quarter':
            firstQuarterMonth = getFirstQuarterMonth(date.getMonth());
            month = date.getMonth();

            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            if(month !== firstQuarterMonth) {
                date.setMonth(firstQuarterMonth);
            }
            break;
    }

    if(withCorrection && dateUnitInterval !== 'hour' && dateUnitInterval !== 'minute' && dateUnitInterval !== 'second') {
        fixTimezoneGap(oldDate, date);
    }
    return date;
};

var trimTime = function(date) {
    return dateUtils.correctDateWithUnitBeginning(date, 'day');
};

var setToDayEnd = function(date) {
    let result = dateUtils.trimTime(date);

    result.setDate(result.getDate() + 1);
    return new Date(result.getTime() - 1);
};


var getDatesDifferences = function(date1, date2) {
    var differences,
        counter = 0;

    differences = {
        year: date1.getFullYear() !== date2.getFullYear(),
        month: date1.getMonth() !== date2.getMonth(),
        day: date1.getDate() !== date2.getDate(),
        hour: date1.getHours() !== date2.getHours(),
        minute: date1.getMinutes() !== date2.getMinutes(),
        second: date1.getSeconds() !== date2.getSeconds(),
        millisecond: date1.getMilliseconds() !== date2.getMilliseconds()
    };

    each(differences, function(key, value) {
        if(value) {
            counter++;
        }
    });
    if(counter === 0 && getTimezonesDifference(date1, date2) !== 0) {
        differences.hour = true;
        counter++;
    }

    differences.count = counter;
    return differences;
};

function addDateInterval(value, interval, dir) {
    var result = new Date(value.getTime()),
        intervalObject = isString(interval) ? getDateIntervalByString(interval.toLowerCase())
            : typeUtils.isNumeric(interval) ? convertMillisecondsToDateUnits(interval)
                : interval;
    if(intervalObject.years) {
        result.setFullYear(result.getFullYear() + intervalObject.years * dir);
    }
    if(intervalObject.quarters) {
        result.setMonth(result.getMonth() + 3 * intervalObject.quarters * dir);
    }
    if(intervalObject.months) {
        result.setMonth(result.getMonth() + intervalObject.months * dir);
    }
    if(intervalObject.weeks) {
        result.setDate(result.getDate() + 7 * intervalObject.weeks * dir);
    }
    if(intervalObject.days) {
        result.setDate(result.getDate() + intervalObject.days * dir);
    }
    if(intervalObject.hours) {
        result.setTime(result.getTime() + intervalObject.hours * 3600000 * dir);
    }
    if(intervalObject.minutes) {
        result.setTime(result.getTime() + intervalObject.minutes * 60000 * dir);
    }
    if(intervalObject.seconds) {
        result.setTime(result.getTime() + intervalObject.seconds * 1000 * dir);
    }
    if(intervalObject.milliseconds) {
        result.setTime(result.getTime() + intervalObject.milliseconds * dir);
    }
    return result;
}

var addInterval = function(value, interval, isNegative) {
    var dir = isNegative ? -1 : +1;
    return isDate(value) ? addDateInterval(value, interval, dir) : adjust(value + interval * dir, interval);
};

var getSequenceByInterval = function(min, max, interval) {
    var intervals = [],
        cur;

    intervals.push(isDate(min) ? new Date(min.getTime()) : min);
    cur = min;
    while(cur < max) {
        cur = addInterval(cur, interval);
        intervals.push(cur);
    }
    return intervals;
};

var getViewFirstCellDate = function(viewType, date) {
    if(viewType === 'month') { return new Date(date.getFullYear(), date.getMonth(), 1); }
    if(viewType === 'year') { return new Date(date.getFullYear(), 0, date.getDate()); }
    if(viewType === 'decade') { return new Date(getFirstYearInDecade(date), date.getMonth(), date.getDate()); }
    if(viewType === 'century') { return new Date(getFirstDecadeInCentury(date), date.getMonth(), date.getDate()); }
};

var getViewLastCellDate = function(viewType, date) {
    if(viewType === 'month') { return new Date(date.getFullYear(), date.getMonth(), getLastMonthDay(date)); }
    if(viewType === 'year') { return new Date(date.getFullYear(), 11, date.getDate()); }
    if(viewType === 'decade') { return new Date(getFirstYearInDecade(date) + 9, date.getMonth(), date.getDate()); }
    if(viewType === 'century') { return new Date(getFirstDecadeInCentury(date) + 90, date.getMonth(), date.getDate()); }
};

var getViewMinBoundaryDate = function(viewType, date) {
    var resultDate = new Date(date.getFullYear(), date.getMonth(), 1);

    if(viewType === 'month') {
        return resultDate;
    }

    resultDate.setMonth(0);

    if(viewType === 'year') {
        return resultDate;
    }

    if(viewType === 'decade') {
        resultDate.setFullYear(getFirstYearInDecade(date));
    }

    if(viewType === 'century') {
        resultDate.setFullYear(getFirstDecadeInCentury(date));
    }

    return resultDate;
};

var getViewMaxBoundaryDate = function(viewType, date) {
    var resultDate = new Date(date);
    resultDate.setDate(getLastMonthDay(date));

    if(viewType === 'month') {
        return resultDate;
    }

    resultDate.setMonth(11);
    resultDate.setDate(getLastMonthDay(resultDate));

    if(viewType === 'year') {
        return resultDate;
    }

    if(viewType === 'decade') {
        resultDate.setFullYear(getFirstYearInDecade(date) + 9);
    }

    if(viewType === 'century') {
        resultDate.setFullYear(getFirstDecadeInCentury(date) + 99);
    }

    return resultDate;
};

var getLastMonthDay = function(date) {
    var resultDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return resultDate.getDate();
};

var sameView = function(view, date1, date2) {
    return dateUtils[camelize('same ' + view)](date1, date2);
};

var getViewUp = function(typeView) {
    switch(typeView) {
        case 'month':
            return 'year';
        case 'year':
            return 'decade';
        case 'decade':
            return 'century';
        default:
            break;
    }
};

var getViewDown = function(typeView) {
    switch(typeView) {
        case 'century':
            return 'decade';
        case 'decade':
            return 'year';
        case 'year':
            return 'month';
        default:
            break;
    }
};

var getDifferenceInMonth = function(typeView) {
    var difference = 1;

    if(typeView === 'year') { difference = 12; }
    if(typeView === 'decade') { difference = 12 * 10; }
    if(typeView === 'century') { difference = 12 * 100; }

    return difference;
};

var getDifferenceInMonthForCells = function(typeView) {
    var difference = 1;

    if(typeView === 'decade') { difference = 12; }
    if(typeView === 'century') { difference = 12 * 10; }

    return difference;
};

var getDateIntervalByString = function(intervalString) {
    var result = {};
    switch(intervalString) {
        case 'year':
            result.years = 1;
            break;
        case 'month':
            result.months = 1;
            break;
        case 'quarter':
            result.months = 3;
            break;
        case 'week':
            result.weeks = 1;
            break;
        case 'day':
            result.days = 1;
            break;
        case 'hour':
            result.hours = 1;
            break;
        case 'minute':
            result.minutes = 1;
            break;
        case 'second':
            result.seconds = 1;
            break;
        case 'millisecond':
            result.milliseconds = 1;
            break;
    }
    return result;
};

var sameDate = function(date1, date2) {
    return sameMonthAndYear(date1, date2) && date1.getDate() === date2.getDate();
};

var sameMonthAndYear = function(date1, date2) {
    return sameYear(date1, date2) && date1.getMonth() === date2.getMonth();
};

var sameYear = function(date1, date2) {
    return date1 && date2 && date1.getFullYear() === date2.getFullYear();
};

var sameDecade = function(date1, date2) {
    if(!isDefined(date1) || !isDefined(date2)) return;

    var startDecadeDate1 = date1.getFullYear() - date1.getFullYear() % 10,
        startDecadeDate2 = date2.getFullYear() - date2.getFullYear() % 10;

    return date1 && date2 && startDecadeDate1 === startDecadeDate2;
};

var sameCentury = function(date1, date2) {
    if(!isDefined(date1) || !isDefined(date2)) return;

    var startCenturyDate1 = date1.getFullYear() - date1.getFullYear() % 100,
        startCenturyDate2 = date2.getFullYear() - date2.getFullYear() % 100;

    return date1 && date2 && startCenturyDate1 === startCenturyDate2;
};

var getFirstDecadeInCentury = function(date) {
    return date && date.getFullYear() - date.getFullYear() % 100;
};

var getFirstYearInDecade = function(date) {
    return date && date.getFullYear() - date.getFullYear() % 10;
};

var getShortDateFormat = function() {
    return 'yyyy/MM/dd';
};

var getFirstMonthDate = function(date) {
    if(!isDefined(date)) return;
    var newDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return newDate;
};

var getLastMonthDate = function(date) {
    if(!isDefined(date)) return;
    var newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return newDate;
};

var getFirstWeekDate = function(date, firstDayOfWeek) {
    var delta = (date.getDay() - firstDayOfWeek + 7) % 7;

    var result = new Date(date);
    result.setDate(date.getDate() - delta);

    return result;
};

var normalizeDateByWeek = function(date, currentDate) {
    var differenceInDays = dateUtils.getDatesInterval(date, currentDate, 'day'),
        resultDate = new Date(date);

    if(differenceInDays >= 6) {
        resultDate = new Date(resultDate.setDate(resultDate.getDate() + 7));
    }

    return resultDate;
};

var dateInRange = function(date, min, max, format) {
    if(format === 'date') {
        min = min && dateUtils.correctDateWithUnitBeginning(min, 'day');
        max = max && dateUtils.correctDateWithUnitBeginning(max, 'day');
        date = date && dateUtils.correctDateWithUnitBeginning(date, 'day');
    }

    return normalizeDate(date, min, max) === date;
};

var dateTimeFromDecimal = function(number) {
    var hours = Math.floor(number),
        minutes = (number % 1) * 60;

    return {
        hours: hours,
        minutes: minutes
    };
};

var roundDateByStartDayHour = function(date, startDayHour) {
    var startTime = this.dateTimeFromDecimal(startDayHour),
        result = new Date(date);

    if(date.getHours() === startTime.hours && date.getMinutes() < startTime.minutes || date.getHours() < startTime.hours) {
        result.setHours(startTime.hours, startTime.minutes, 0, 0);
    }

    return result;
};

var normalizeDate = function(date, min, max) {
    var normalizedDate = date;

    if(!isDefined(date)) {
        return date;
    }

    if(isDefined(min) && date < min) {
        normalizedDate = min;
    }

    if(isDefined(max) && date > max) {
        normalizedDate = max;
    }

    return normalizedDate;
};

var fixTimezoneGap = function(oldDate, newDate) {
    // NOTE: T182866
    if(!isDefined(oldDate)) {
        return;
    }

    var diff = newDate.getHours() - oldDate.getHours(),
        sign,
        trial;

    if(diff === 0) {
        return;
    }

    sign = (diff === 1 || diff === -23) ? -1 : 1;
    trial = new Date(newDate.getTime() + sign * 3600000);

    if(sign > 0 || trial.getDate() === newDate.getDate()) {
        newDate.setTime(trial.getTime());
    }
};

var roundToHour = function(date) {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);

    return date;
};

var getTimezonesDifference = function(min, max) {
    return (max.getTimezoneOffset() - min.getTimezoneOffset()) * 60 * 1000;
};

var makeDate = function(date) {
    // TODO: will be useful later for work with different timezones
    return new Date(date);
};

var getDatesOfInterval = function(startDate, endDate, step) {
    let currentDate = new Date(startDate.getTime());
    let result = [];

    if(startDate.getTime() === endDate.getTime()) {
        result.push(new Date(startDate.getTime()));
    }

    while(currentDate < endDate) {
        result.push(new Date(currentDate.getTime()));

        currentDate = this.addInterval(currentDate, step);
    }

    return result;
};

var dateUtils = {
    dateUnitIntervals: dateUnitIntervals,

    convertMillisecondsToDateUnits: convertMillisecondsToDateUnits,
    dateToMilliseconds: dateToMilliseconds,
    getNextDateUnit: getNextDateUnit,
    convertDateUnitToMilliseconds: convertDateUnitToMilliseconds,
    getDateUnitInterval: getDateUnitInterval,
    getDateFormatByTickInterval: getDateFormatByTickInterval, // T375972
    getDatesDifferences: getDatesDifferences,
    correctDateWithUnitBeginning: correctDateWithUnitBeginning,
    trimTime: trimTime,
    setToDayEnd: setToDayEnd,
    roundDateByStartDayHour: roundDateByStartDayHour,
    dateTimeFromDecimal: dateTimeFromDecimal,

    addDateInterval: addDateInterval,
    addInterval: addInterval,
    getSequenceByInterval: getSequenceByInterval,
    getDateIntervalByString: getDateIntervalByString,
    sameDate: sameDate,
    sameMonthAndYear: sameMonthAndYear,
    sameMonth: sameMonthAndYear,
    sameYear: sameYear,
    sameDecade: sameDecade,
    sameCentury: sameCentury,
    sameView: sameView,
    getDifferenceInMonth: getDifferenceInMonth,
    getDifferenceInMonthForCells: getDifferenceInMonthForCells,
    getFirstYearInDecade: getFirstYearInDecade,
    getFirstDecadeInCentury: getFirstDecadeInCentury,
    getShortDateFormat: getShortDateFormat,
    getViewFirstCellDate: getViewFirstCellDate,
    getViewLastCellDate: getViewLastCellDate,
    getViewDown: getViewDown,
    getViewUp: getViewUp,
    getLastMonthDay: getLastMonthDay,
    getLastMonthDate: getLastMonthDate,
    getFirstMonthDate: getFirstMonthDate,
    getFirstWeekDate: getFirstWeekDate,
    normalizeDateByWeek: normalizeDateByWeek,
    getQuarter: getQuarter,
    getFirstQuarterMonth: getFirstQuarterMonth,
    dateInRange: dateInRange,
    roundToHour: roundToHour,
    normalizeDate: normalizeDate,
    getViewMinBoundaryDate: getViewMinBoundaryDate,
    getViewMaxBoundaryDate: getViewMaxBoundaryDate,

    fixTimezoneGap: fixTimezoneGap,
    getTimezonesDifference: getTimezonesDifference,

    makeDate: makeDate,

    getDatesInterval: getDatesInterval,

    getDatesOfInterval: getDatesOfInterval
};

module.exports = dateUtils;
