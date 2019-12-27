const errors = require('../../core/errors');
const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const inArray = require('../../core/utils/array').inArray;
const isDefined = require('../../core/utils/type').isDefined;
const dateUtils = require('../../core/utils/date');

const toMs = dateUtils.dateToMilliseconds;

const leastDaysInWeek = 4;

const intervalMap = {
    secondly: 'seconds',
    minutely: 'minutes',
    hourly: 'hours',
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    yearly: 'years'
};

const dateSetterMap = {
    'bysecond': function(date, value) {
        date.setSeconds(value);
    },
    'byminute': function(date, value) {
        date.setMinutes(value);
    },
    'byhour': function(date, value) {
        date.setHours(value);
    },
    'bymonth': function(date, value) {
        date.setMonth(value);
    },
    'bymonthday': function(date, value) {
        if(value < 0) {
            const initialDate = new Date(date);

            setDateByNegativeValue(initialDate, 1, -1);

            const daysInMonth = initialDate.getDate();

            if(daysInMonth >= Math.abs(value)) {
                setDateByNegativeValue(date, 1, value);
            } else {
                setDateByNegativeValue(date, 2, value);
            }

        } else {
            date.setDate(value);
            correctDate(date, value);
        }
    },
    'byday': function(date, byDay, appointmentWeekStart, frequency, firstDayOfWeek) {
        const appointmentDayOfWeek = date.getDay();
        const weekStart = days[appointmentWeekStart];

        byDay += ((byDay >= weekStart) === weekStart > appointmentDayOfWeek) ? 7 : 0;

        date.setDate(date.getDate() - appointmentDayOfWeek + byDay);
    },
    'byweekno': function(date, weekNumber, weekStart) {
        const initialDate = new Date(date);
        const firstYearDate = new Date(initialDate.setMonth(0, 1));
        const dayShift = firstYearDate.getDay() - days[weekStart];
        const firstDayOfYear = firstYearDate.getTime() - dayShift * toMs('day');
        const newFirstYearDate = dayShift + 1;

        if(newFirstYearDate > leastDaysInWeek) {
            date.setTime(firstDayOfYear + weekNumber * 7 * toMs('day'));
        } else {
            date.setTime(firstDayOfYear + (weekNumber - 1) * 7 * toMs('day'));
        }

        const timezoneDiff = (date.getTimezoneOffset() - firstYearDate.getTimezoneOffset()) * toMs('minute');
        timezoneDiff && date.setTime(date.getTime() + timezoneDiff);
    },
    'byyearday': function(date, dayOfYear) {
        date.setMonth(0, 1);
        date.setDate(dayOfYear);
    }
};

var setDateByNegativeValue = function(date, month, value) {
    const initialDate = new Date(date);

    date.setMonth(date.getMonth() + month);

    if((date.getMonth() - initialDate.getMonth()) > month) {
        date.setDate(value + 1);
    }

    date.setDate(value + 1);
};

const dateGetterMap = {
    'bysecond': function(date) {
        return date.getSeconds();
    },
    'byminute': function(date) {
        return date.getMinutes();
    },
    'byhour': function(date) {
        return date.getHours();
    },
    'bymonth': function(date) {
        return date.getMonth();
    },
    'bymonthday': function(date) {
        return date.getDate();
    },
    'byday': function(date) {
        return date.getDay();
    },
    'byweekno': function(date, weekStart) {
        let daysFromYearStart;
        const current = new Date(date);
        let diff = leastDaysInWeek - current.getDay() + days[weekStart] - 1;
        const dayInMilliseconds = toMs('day');

        if(date.getDay() < days[weekStart]) {
            diff -= 7;
        }

        current.setHours(0, 0, 0);
        current.setDate(current.getDate() + diff);

        const yearStart = new Date(current.getFullYear(), 0, 1);
        const timezoneDiff = (yearStart.getTimezoneOffset() - current.getTimezoneOffset()) * toMs('minute');

        daysFromYearStart = 1 + (current - yearStart + timezoneDiff) / dayInMilliseconds;

        return Math.ceil(daysFromYearStart / 7);
    },
    'byyearday': function(date) {
        const yearStart = new Date(date.getFullYear(), 0, 0);
        const timezoneDiff = date.getTimezoneOffset() - yearStart.getTimezoneOffset();
        const diff = date - yearStart - timezoneDiff * toMs('minute');
        const dayLength = toMs('day');

        return Math.floor(diff / dayLength);
    }
};

const ruleNames = ['freq', 'interval', 'byday', 'byweekno', 'byyearday', 'bymonth', 'bymonthday', 'count', 'until', 'byhour', 'byminute', 'bysecond', 'bysetpos', 'wkst'];
const freqNames = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SECONDLY', 'MINUTELY', 'HOURLY'];
var days = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const daysNames = { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' };

const getTimeZoneOffset = function() {
    return new Date().getTimezoneOffset();
};

const dateInRecurrenceRange = function(options) {
    let result = [];

    if(options.rule) {
        result = getDatesByRecurrence(options);
    }

    return !!result.length;
};

const normalizeInterval = function(rule) {
    const interval = rule.interval;
    const freq = rule.freq;
    const intervalObject = {};
    let intervalField = intervalMap[freq.toLowerCase()];

    if(freq === 'MONTHLY' && rule['byday']) {
        intervalField = intervalMap['daily'];
    }
    intervalObject[intervalField] = interval;

    return intervalObject;
};

const getDatesByRecurrenceException = function(ruleValues, date) {
    const result = [];

    for(let i = 0, len = ruleValues.length; i < len; i++) {
        result[i] = getDateByAsciiString(ruleValues[i], date);
    }

    return result;
};

const dateIsRecurrenceException = function(date, recurrenceException) {
    let result = false;

    if(!recurrenceException) {
        return result;
    }

    const splitDates = recurrenceException.split(',');
    const exceptDates = getDatesByRecurrenceException(splitDates, date);
    const shortFormat = /\d{8}$/;

    for(let i = 0, len = exceptDates.length; i < len; i++) {
        if(splitDates[i].match(shortFormat)) {
            const diffs = getDatePartDiffs(date, exceptDates[i]);

            if(diffs.years === 0 && diffs.months === 0 && diffs.days === 0) {
                result = true;
            }
        } else {
            if(date.getTime() === exceptDates[i].getTime()) {
                result = true;
            }
        }
    }

    return result;
};

const doNextIteration = function(date, startIntervalDate, endIntervalDate, recurrenceRule, iterationCount) {
    let matchCountIsCorrect = true;
    let dateInInterval;

    endIntervalDate = endIntervalDate.getTime();

    if(recurrenceRule.until) {
        if(recurrenceRule.until.getTime() < endIntervalDate) {
            endIntervalDate = recurrenceRule.until.getTime();
        }
    }

    if(recurrenceRule.count) {
        if(iterationCount === recurrenceRule.count) {
            matchCountIsCorrect = false;
        }
    }

    dateInInterval = date.getTime() <= endIntervalDate;

    return dateInInterval && matchCountIsCorrect;
};

var getDatesByRecurrence = function(options) {
    let result = [];
    const recurrenceRule = getRecurrenceRule(options.rule);
    let iterationResult = {};
    const rule = recurrenceRule.rule;
    const recurrenceStartDate = options.start;
    let dateRules;

    if(!recurrenceRule.isValid || !rule.freq) {
        return result;
    }

    rule.interval = normalizeInterval(rule);
    dateRules = splitDateRules(rule, options.firstDayOfWeek);

    const duration = options.end ? options.end.getTime() - options.start.getTime() : toMs('day');

    const config = {
        exception: options.exception,
        min: options.min,
        dateRules: dateRules,
        rule: rule,
        recurrenceStartDate: recurrenceStartDate,
        recurrenceEndDate: options.end,
        duration: duration
    };

    if(dateRules.length && rule.count) {
        let iteration = 0;

        getDatesByCount(dateRules, new Date(recurrenceStartDate), new Date(recurrenceStartDate), rule)
            .forEach(function(currentDate, i) {
                if(currentDate < options.max) {
                    iteration++;
                    iterationResult = pushToResult(iteration, iterationResult, currentDate, i, config, true);
                }
            });
    } else {
        getDatesByRules(dateRules, new Date(recurrenceStartDate), rule)
            .forEach(function(currentDate, i) {
                let iteration = 0;

                while(doNextIteration(currentDate, recurrenceStartDate, options.max, rule, iteration)) {
                    iteration++;
                    iterationResult = pushToResult(iteration, iterationResult, currentDate, i, config);

                    currentDate = incrementDate(currentDate, recurrenceStartDate, rule, i);
                }
            });
    }

    if(rule['bysetpos']) {
        each(iterationResult, function(iterationIndex, iterationDates) {
            iterationResult[iterationIndex] = filterDatesBySetPos(iterationDates, rule['bysetpos']);
        });
    }

    each(iterationResult, function(_, iterationDates) {
        result = result.concat(iterationDates);
    });


    result.sort(function(a, b) {
        return a - b;
    });

    return result;
};

var pushToResult = function(iteration, iterationResult, currentDate, i, config, verifiedField) {
    if(!iterationResult[iteration]) {
        iterationResult[iteration] = [];
    }

    if(checkDate(currentDate, i, config, verifiedField)) {
        iterationResult[iteration].push(currentDate);
    }

    return iterationResult;
};

var checkDate = function(currentDate, i, config, verifiedField) {
    if(!dateIsRecurrenceException(currentDate, config.exception)) {
        const duration = dateUtils.sameDate(currentDate, config.recurrenceEndDate) && config.recurrenceEndDate.getTime() > currentDate.getTime() ? config.recurrenceEndDate.getTime() - currentDate.getTime() : config.duration;

        if(currentDate.getTime() >= config.recurrenceStartDate.getTime() && (currentDate.getTime() + duration) > config.min.getTime()) {
            return verifiedField || checkDateByRule(currentDate, [config.dateRules[i]], config.rule['wkst']);
        }
    }

    return false;
};

var filterDatesBySetPos = function(dates, bySetPos) {
    const resultArray = [];

    bySetPos.split(',').forEach(function(index) {
        index = Number(index);

        const dateIndex = (index > 0) ? index - 1 : dates.length + index;

        if(dates[dateIndex]) {
            resultArray.push(dates[dateIndex]);
        }
    });

    return resultArray;
};

var correctDate = function(originalDate, date) {
    if(originalDate.getDate() !== date) {
        originalDate.setDate(date);
    }
};

var incrementDate = function(date, originalStartDate, rule, iterationStep) {
    const initialDate = new Date(date);
    let needCorrect = true;

    date = dateUtils.addInterval(date, rule.interval);

    if(rule.freq === 'DAILY' && !isDefined(rule['byhour']) && originalStartDate.getHours() !== date.getHours()) {
        date = new Date(date.getTime() - (initialDate.getHours() - originalStartDate.getHours()) * toMs('hour'));
    }

    if(rule.freq === 'MONTHLY' && !rule['byday']) {
        let expectedDate = originalStartDate.getDate();

        if(rule['bymonthday']) {
            expectedDate = Number(rule['bymonthday'].split(',')[iterationStep]);

            if(expectedDate < 0) {
                initialDate.setMonth(initialDate.getMonth() + 1, 1);
                dateSetterMap['bymonthday'](initialDate, expectedDate);
                date = initialDate;
                needCorrect = false;
            }
        }
        needCorrect && correctDate(date, expectedDate);
    }

    if(rule.freq === 'YEARLY') {
        if(rule['byyearday']) {
            const dayNumber = Number(rule['byyearday'].split(',')[iterationStep]);
            dateSetterMap['byyearday'](date, dayNumber);
        }

        const dateRules = splitDateRules(rule);

        for(const field in dateRules[iterationStep]) {
            dateSetterMap[field] && dateSetterMap[field](date, dateRules[iterationStep][field], rule['wkst']);
        }
    }

    return date;
};

var getDatePartDiffs = function(date1, date2) {
    return {
        years: date1.getFullYear() - date2.getFullYear(),
        months: date1.getMonth() - date2.getMonth(),
        days: date1.getDate() - date2.getDate(),
        hours: date1.getHours() - date2.getHours(),
        minutes: date1.getMinutes() - date2.getMinutes(),
        seconds: date1.getSeconds() - date2.getSeconds()
    };
};

var getRecurrenceRule = function(recurrence) {
    const result = {
        rule: {},
        isValid: false
    };

    if(recurrence) {
        result.rule = parseRecurrenceRule(recurrence);
        result.isValid = validateRRule(result.rule, recurrence);
    }

    return result;
};

const loggedWarnings = [];

var validateRRule = function(rule, recurrence) {
    if(brokenRuleNameExists(rule) ||
        inArray(rule.freq, freqNames) === -1 ||
        wrongCountRule(rule) || wrongIntervalRule(rule) ||
        wrongDayOfWeek(rule) ||
        wrongByMonthDayRule(rule) || wrongByMonth(rule) ||
        wrongUntilRule(rule)) {

        logBrokenRule(recurrence);
        return false;
    }

    return true;
};

var wrongUntilRule = function(rule) {
    let wrongUntil = false;
    const until = rule.until;

    if(until !== undefined && !(until instanceof Date)) {
        wrongUntil = true;
    }

    return wrongUntil;
};

var wrongCountRule = function(rule) {
    let wrongCount = false;
    const count = rule.count;

    if(count && typeof count === 'string') {
        wrongCount = true;
    }

    return wrongCount;
};

var wrongByMonthDayRule = function(rule) {
    let wrongByMonthDay = false;
    const byMonthDay = rule['bymonthday'];

    if(byMonthDay && isNaN(parseInt(byMonthDay))) {
        wrongByMonthDay = true;
    }

    return wrongByMonthDay;
};

var wrongByMonth = function(rule) {
    let wrongByMonth = false;
    const byMonth = rule['bymonth'];

    if(byMonth && isNaN(parseInt(byMonth))) {
        wrongByMonth = true;
    }

    return wrongByMonth;
};

var wrongIntervalRule = function(rule) {
    let wrongInterval = false;
    const interval = rule.interval;

    if(interval && typeof interval === 'string') {
        wrongInterval = true;
    }

    return wrongInterval;
};

var wrongDayOfWeek = function(rule) {
    const daysByRule = daysFromByDayRule(rule);
    let brokenDaysExist = false;

    each(daysByRule, function(_, day) {
        if(!Object.prototype.hasOwnProperty.call(days, day)) {
            brokenDaysExist = true;
            return false;
        }
    });

    return brokenDaysExist;
};

var brokenRuleNameExists = function(rule) {
    let brokenRuleExists = false;

    each(rule, function(ruleName) {
        if(inArray(ruleName, ruleNames) === -1) {
            brokenRuleExists = true;
            return false;
        }
    });

    return brokenRuleExists;
};

var logBrokenRule = function(recurrence) {
    if(inArray(recurrence, loggedWarnings) === -1) {
        errors.log('W0006', recurrence);
        loggedWarnings.push(recurrence);
    }
};

var parseRecurrenceRule = function(recurrence) {
    const ruleObject = {};
    const ruleParts = recurrence.split(';');

    for(let i = 0, len = ruleParts.length; i < len; i++) {

        const rule = ruleParts[i].split('=');
        const ruleName = rule[0].toLowerCase();
        const ruleValue = rule[1];

        ruleObject[ruleName] = ruleValue;
    }

    const count = parseInt(ruleObject.count);

    if(!isNaN(count)) {
        ruleObject.count = count;
    }

    if(ruleObject.interval) {
        const interval = parseInt(ruleObject.interval);
        if(!isNaN(interval)) {
            ruleObject.interval = interval;
        }
    } else {
        ruleObject.interval = 1;
    }

    if(ruleObject.freq && ruleObject.until) {
        ruleObject.until = getDateByAsciiString(ruleObject.until);
    }

    return ruleObject;
};

var getDateByAsciiString = function(string, initialDate) {
    if(typeof string !== 'string') {
        return string;
    }

    const arrayDate = string.match(/(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2}))?(Z)?/);

    if(!arrayDate) {
        return null;
    }

    const isUTC = arrayDate[8] !== undefined;
    let currentOffset = initialDate ? initialDate.getTimezoneOffset() : resultUtils.getTimeZoneOffset();
    let date = new (Function.prototype.bind.apply(Date, prepareDateArrayToParse(arrayDate)))();

    currentOffset = currentOffset * 60000;

    if(isUTC) {
        date = new Date(date.getTime() - currentOffset);
    }

    return date;
};

var prepareDateArrayToParse = function(arrayDate) {
    arrayDate.shift();

    if(arrayDate[3] === undefined) {
        arrayDate.splice(3);
    } else {
        arrayDate.splice(3, 1);
        arrayDate.splice(6);
    }

    arrayDate[1]--;

    arrayDate.unshift(null);

    return arrayDate;
};

var daysFromByDayRule = function(rule) {
    let result = [];

    if(rule['byday']) {
        if(Array.isArray(rule['byday'])) {
            result = rule['byday'];
        } else {
            result = rule['byday'].split(',');
        }
    }

    return result;
};

const getAsciiStringByDate = function(date) {
    const currentOffset = resultUtils.getTimeZoneOffset() * 60000;

    date = new Date(date.getTime() + currentOffset);
    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) +
        'T' + ('0' + (date.getHours())).slice(-2) + ('0' + (date.getMinutes())).slice(-2) + ('0' + (date.getSeconds())).slice(-2) + 'Z';
};

var splitDateRules = function(rule, firstDayOfWeek = null) {
    let result = [];

    if(isDefined(firstDayOfWeek)) {
        rule['fdow'] = firstDayOfWeek;
    }

    if(!rule['wkst']) {
        rule['wkst'] = isDefined(firstDayOfWeek) ? daysNames[firstDayOfWeek] : 'MO';
    }

    if(rule['byweekno'] && !rule['byday']) {
        const dayNames = Object.keys(days);

        for(let i = 0; i < days[rule['wkst']]; i++) {
            dayNames.push(dayNames.shift());
        }

        rule['byday'] = dayNames.join(',');
    }

    for(const field in dateSetterMap) {
        if(!rule[field]) {
            continue;
        }

        const ruleFieldValues = rule[field].split(',');
        const ruleArray = getDateRuleArray(field, ruleFieldValues);

        result = result.length ? extendObjectArray(ruleArray, result) : ruleArray;
    }

    return result;
};

var getDateRuleArray = function(field, values) {
    const result = [];
    for(let i = 0, length = values.length; i < length; i++) {
        const dateRule = {};
        dateRule[field] = handleRuleFieldValue(field, values[i]);
        result.push(dateRule);
    }
    return result;
};

var handleRuleFieldValue = function(field, value) {
    let result = parseInt(value);

    if(field === 'bymonth') {
        result -= 1;
    }

    if(field === 'byday') {
        result = days[value];
    }

    return result;
};

var extendObjectArray = function(firstArray, secondArray) {
    const result = [];

    for(let i = 0, firstArrayLength = firstArray.length; i < firstArrayLength; i++) {
        for(let j = 0, secondArrayLength = secondArray.length; j < secondArrayLength; j++) {
            result.push(extend({}, firstArray[i], secondArray[j]));
        }
    }
    return result;
};

var getDatesByRules = function(dateRules, startDate, rule) {
    let result = [];

    for(let i = 0, len = dateRules.length; i < len; i++) {
        const current = dateRules[i];
        const updatedDate = prepareDate(startDate, dateRules, rule['wkst']);

        for(const field in current) {
            dateSetterMap[field] && dateSetterMap[field](updatedDate, current[field], rule['wkst'], rule.freq, rule['fdow']);
        }

        if(Array.isArray(updatedDate)) {
            result = result.concat(updatedDate);
        } else {
            result.push(new Date(updatedDate));
        }
    }

    if(!result.length) {
        result.push(startDate);
    }

    return result;
};

var getDatesByCount = function(dateRules, startDate, recurrenceStartDate, rule) {
    const result = [];
    const count = rule.count;
    let counter = 0;
    let date = prepareDate(startDate, dateRules, rule['wkst']);

    while(counter < count) {
        const dates = getDatesByRules(dateRules, date, rule);

        const checkedDates = [];
        for(var i = 0; i < dates.length; i++) {
            if(dates[i].getTime() >= recurrenceStartDate.getTime()) {
                checkedDates.push(dates[i]);
            }
        }
        const length = checkedDates.length;

        counter = counter + length;

        const delCount = counter - count;
        if(counter > count) {
            checkedDates.splice(length - delCount, delCount);
        }

        for(i = 0; i < checkedDates.length; i++) {
            result.push(checkedDates[i]);
        }

        let interval = rule.interval;

        if(Object.keys(interval)[0] === 'days') {
            interval = { weeks: 1 };
        }

        date = dateUtils.addInterval(date, interval);
    }

    return result;
};

var prepareDate = function(startDate, dateRules, weekStartRule) {
    const date = new Date(startDate);
    const day = date.getDay();

    if(dateRules.length && isDefined(dateRules[0]['byday'])) {
        date.setDate(date.getDate() - day + days[weekStartRule] - (day < days[weekStartRule] ? 7 : 0));
    } else {
        date.setDate(1);
    }

    return date;
};

var checkDateByRule = function(date, rules, weekStart) {
    let result = false;

    for(let i = 0; i < rules.length; i++) {
        const current = rules[i];
        let currentRuleResult = true;

        for(const field in current) {
            const processNegative = field === 'bymonthday' && current[field] < 0;

            if(dateGetterMap[field] && (!processNegative && current[field] !== dateGetterMap[field](date, weekStart))) {
                currentRuleResult = false;
            }
        }
        result = result || currentRuleResult;
    }
    return result || !rules.length;
};

const getRecurrenceString = function(object) {
    if(!object || !object.freq) {
        return;
    }

    let result = '';
    for(const field in object) {
        let value = object[field];

        if(field === 'interval' && value < 2) {
            continue;
        }

        if(field === 'until') {
            value = getAsciiStringByDate(value);
        }

        result += field + '=' + value + ';';
    }

    result = result.substring(0, result.length - 1);

    return result.toUpperCase();
};

var resultUtils = {
    getRecurrenceString: getRecurrenceString,
    getRecurrenceRule: getRecurrenceRule,
    getAsciiStringByDate: getAsciiStringByDate,
    getDatesByRecurrence: getDatesByRecurrence,
    dateInRecurrenceRange: dateInRecurrenceRange,
    getDateByAsciiString: getDateByAsciiString,
    daysFromByDayRule: daysFromByDayRule,
    getTimeZoneOffset: getTimeZoneOffset
};

module.exports = resultUtils;
