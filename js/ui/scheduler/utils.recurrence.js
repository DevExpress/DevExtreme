const errors = require('../../core/errors');
const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const inArray = require('../../core/utils/array').inArray;
const dateUtils = require('../../core/utils/date');

const toMs = dateUtils.dateToMilliseconds;

import { RRule, RRuleSet } from 'rrule';

const ruleNames = ['freq', 'interval', 'byday', 'byweekno', 'byyearday', 'bymonth', 'bymonthday', 'count', 'until', 'byhour', 'byminute', 'bysecond', 'bysetpos', 'wkst'];
const freqNames = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SECONDLY', 'MINUTELY', 'HOURLY'];
const days = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

const resultUtils = {};

function getTimeZoneOffset() {
    return new Date().getTimezoneOffset();
}

const dateInRecurrenceRange = function(options) {
    let result = [];

    if(options.rule) {
        result = getDatesByRecurrence(options);
    }

    return !!result.length;
};

// const normalizeInterval = function(rule) {
//     const interval = rule.interval;
//     const freq = rule.freq;
//     const intervalObject = {};
//     let intervalField = intervalMap[freq.toLowerCase()];

//     if(freq === 'MONTHLY' && rule['byday']) {
//         intervalField = intervalMap['daily'];
//     }
//     intervalObject[intervalField] = interval;

//     return intervalObject;
// };

const getDatesByRecurrenceException = function(ruleValues, date) {
    const result = [];

    for(let i = 0, len = ruleValues.length; i < len; i++) {
        result[i] = getDateByAsciiString(ruleValues[i], date);
    }

    return result;
};

function getRRuleUtcDate(date) {
    const newDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ));

    return newDate;
}

function getDatesByRecurrence(options) {
    const result = [];
    const recurrenceRule = getRecurrenceRule(options.rule);
    const rule = recurrenceRule.rule;

    if(!recurrenceRule.isValid || !rule.freq) {
        return result;
    }

    const rRuleSet = new RRuleSet();
    const ruleOptions = RRule.parseString(options.rule);
    const recurrenceStartDate = getRRuleUtcDate(options.start);

    ruleOptions.dtstart = recurrenceStartDate;

    const rRule = new RRule(ruleOptions);
    rRuleSet.rrule(rRule);

    if(options.exception && options.exception.length) {
        const splitDates = options.exception.split(',');
        const exceptDates = getDatesByRecurrenceException(splitDates, recurrenceStartDate);
        for(let i = 0; i < exceptDates.length; i++) {
            const exceptDate = getRRuleUtcDate(new Date(exceptDates[i]));
            rRuleSet.exdate(exceptDate);
        }
    }

    const min = getRRuleUtcDate(options.min);
    const max = getRRuleUtcDate(options.max);
    const dates = rRuleSet.between(min, max, true);
    dates.forEach(date => {
        // TZ correction - Some specific in RRule. Perhaps it related to using of luxon.
        const timezoneOffset = date.getTimezoneOffset() * toMs('minute');
        date.setTime(date.getTime() + timezoneOffset);

        if(!dateIsRecurrenceException(date, options.exception)) {
            result.push(date);
        }
    });

    return result;
}

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

function getDatePartDiffs(date1, date2) {
    return {
        years: date1.getFullYear() - date2.getFullYear(),
        months: date1.getMonth() - date2.getMonth(),
        days: date1.getDate() - date2.getDate(),
        hours: date1.getHours() - date2.getHours(),
        minutes: date1.getMinutes() - date2.getMinutes(),
        seconds: date1.getSeconds() - date2.getSeconds()
    };
}

function getRecurrenceRule(recurrence) {
    const result = {
        rule: {},
        isValid: false
    };

    if(recurrence) {
        result.rule = parseRecurrenceRule(recurrence);
        result.isValid = validateRRule(result.rule, recurrence);
    }

    return result;
}

const loggedWarnings = [];

function validateRRule(rule, recurrence) {
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
}

function wrongUntilRule(rule) {
    let wrongUntil = false;
    const until = rule.until;

    if(until !== undefined && !(until instanceof Date)) {
        wrongUntil = true;
    }

    return wrongUntil;
}

function wrongCountRule(rule) {
    let wrongCount = false;
    const count = rule.count;

    if(count && typeof count === 'string') {
        wrongCount = true;
    }

    return wrongCount;
}

function wrongByMonthDayRule(rule) {
    let wrongByMonthDay = false;
    const byMonthDay = rule['bymonthday'];

    if(byMonthDay && isNaN(parseInt(byMonthDay))) {
        wrongByMonthDay = true;
    }

    return wrongByMonthDay;
}

function wrongByMonth(rule) {
    let wrongByMonth = false;
    const byMonth = rule['bymonth'];

    if(byMonth && isNaN(parseInt(byMonth))) {
        wrongByMonth = true;
    }

    return wrongByMonth;
}

function wrongIntervalRule(rule) {
    let wrongInterval = false;
    const interval = rule.interval;

    if(interval && typeof interval === 'string') {
        wrongInterval = true;
    }

    return wrongInterval;
}

function wrongDayOfWeek(rule) {
    const daysByRule = daysFromByDayRule(rule);
    let brokenDaysExist = false;

    each(daysByRule, function(_, day) {
        if(!Object.prototype.hasOwnProperty.call(days, day)) {
            brokenDaysExist = true;
            return false;
        }
    });

    return brokenDaysExist;
}

function brokenRuleNameExists(rule) {
    let brokenRuleExists = false;

    each(rule, function(ruleName) {
        if(inArray(ruleName, ruleNames) === -1) {
            brokenRuleExists = true;
            return false;
        }
    });

    return brokenRuleExists;
}

function logBrokenRule(recurrence) {
    if(inArray(recurrence, loggedWarnings) === -1) {
        errors.log('W0006', recurrence);
        loggedWarnings.push(recurrence);
    }
}

function parseRecurrenceRule(recurrence) {
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
}

function getDateByAsciiString(string, initialDate) {
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
}

function prepareDateArrayToParse(arrayDate) {
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
}

function daysFromByDayRule(rule) {
    let result = [];

    if(rule['byday']) {
        if(Array.isArray(rule['byday'])) {
            result = rule['byday'];
        } else {
            result = rule['byday'].split(',');
        }
    }

    return result;
}

function getAsciiStringByDate(date) {
    const currentOffset = resultUtils.getTimeZoneOffset() * 60000;

    date = new Date(date.getTime() + currentOffset);
    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) +
        'T' + ('0' + (date.getHours())).slice(-2) + ('0' + (date.getMinutes())).slice(-2) + ('0' + (date.getSeconds())).slice(-2) + 'Z';
}

// function splitDateRules(rule, firstDayOfWeek = null) {
//     let result = [];

//     if(isDefined(firstDayOfWeek)) {
//         rule['fdow'] = firstDayOfWeek;
//     }

//     if(!rule['wkst']) {
//         rule['wkst'] = isDefined(firstDayOfWeek) ? daysNames[firstDayOfWeek] : 'MO';
//     }

//     if(rule['byweekno'] && !rule['byday']) {
//         const dayNames = Object.keys(days);

//         for(let i = 0; i < days[rule['wkst']]; i++) {
//             dayNames.push(dayNames.shift());
//         }

//         rule['byday'] = dayNames.join(',');
//     }

//     for(const field in dateSetterMap) {
//         if(!rule[field]) {
//             continue;
//         }

//         const ruleFieldValues = rule[field].split(',');
//         const ruleArray = getDateRuleArray(field, ruleFieldValues);

//         result = result.length ? extendObjectArray(ruleArray, result) : ruleArray;
//     }

//     return result;
// }

// function getDateRuleArray(field, values) {
//     const result = [];
//     for(let i = 0, length = values.length; i < length; i++) {
//         const dateRule = {};
//         dateRule[field] = handleRuleFieldValue(field, values[i]);
//         result.push(dateRule);
//     }
//     return result;
// }

// function handleRuleFieldValue(field, value) {
//     let result = parseInt(value);

//     if(field === 'bymonth') {
//         result -= 1;
//     }

//     if(field === 'byday') {
//         result = days[value];
//     }

//     return result;
// }

// function extendObjectArray(firstArray, secondArray) {
//     const result = [];

//     for(let i = 0, firstArrayLength = firstArray.length; i < firstArrayLength; i++) {
//         for(let j = 0, secondArrayLength = secondArray.length; j < secondArrayLength; j++) {
//             result.push(extend({}, firstArray[i], secondArray[j]));
//         }
//     }
//     return result;
// }

// function getDatesByRules(dateRules, startDate, rule) {
//     let result = [];

//     for(let i = 0, len = dateRules.length; i < len; i++) {
//         const current = dateRules[i];
//         const updatedDate = prepareDate(startDate, dateRules, rule['wkst']);

//         for(const field in current) {
//             dateSetterMap[field] && dateSetterMap[field](updatedDate, current[field], rule['wkst'], rule.freq, rule['fdow']);
//         }

//         if(Array.isArray(updatedDate)) {
//             result = result.concat(updatedDate);
//         } else {
//             const date = !isWrongDate(updatedDate) ? new Date(updatedDate) : updatedDate;
//             result.push(date);
//         }
//     }

//     if(!result.length) {
//         result.push(startDate);
//     }

//     return result;
// }

// function getDatesByCount(dateRules, startDate, recurrenceStartDate, rule) {
//     const result = [];
//     const count = rule.count;
//     let counter = 0;
//     let date = prepareDate(startDate, dateRules, rule['wkst']);

//     while(counter < count) {
//         const dates = getDatesByRules(dateRules, date, rule);

//         const checkedDates = [];
//         dates.forEach(checkedDate => {
//             if(!isWrongDate(checkedDate)) {
//                 if(checkedDate.getTime() >= recurrenceStartDate.getTime()) {
//                     checkedDates.push(checkedDate);
//                 }
//             }
//         });

//         const length = checkedDates.length;

//         counter = counter + length;

//         const delCount = counter - count;
//         if(counter > count) {
//             checkedDates.splice(length - delCount, delCount);
//         }

//         checkedDates.forEach(checkedDate => result.push(checkedDate));

//         let interval = rule.interval;

//         if(Object.keys(interval)[0] === 'days') {
//             interval = { weeks: 1 };
//         }

//         date = dateUtils.addInterval(date, interval);
//     }

//     return result;
// }

// function prepareDate(startDate, dateRules, weekStartRule) {
//     const date = new Date(startDate);
//     const day = date.getDay();

//     if(dateRules.length && isDefined(dateRules[0]['byday'])) {
//         date.setDate(date.getDate() - day + days[weekStartRule] - (day < days[weekStartRule] ? 7 : 0));
//     } else {
//         date.setDate(1);
//     }

//     return date;
// }

// function checkDateByRule(date, rules, weekStart) {
//     let result = false;

//     for(let i = 0; i < rules.length; i++) {
//         const current = rules[i];
//         let currentRuleResult = true;

//         for(const field in current) {
//             const processNegative = field === 'bymonthday' && current[field] < 0;

//             if(dateGetterMap[field] && (!processNegative && current[field] !== dateGetterMap[field](date, weekStart))) {
//                 currentRuleResult = false;
//             }
//         }
//         result = result || currentRuleResult;
//     }
//     return result || !rules.length;
// }

// function markWrongDate(date) {
//     date.isWrongDate = true;
// }

// function isWrongDate(date) {
//     return date.isWrongDate;
// }

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

extend(resultUtils, {
    getRecurrenceString: getRecurrenceString,
    getRecurrenceRule: getRecurrenceRule,
    getAsciiStringByDate: getAsciiStringByDate,
    getDatesByRecurrence: getDatesByRecurrence,
    dateInRecurrenceRange: dateInRecurrenceRange,
    getDateByAsciiString: getDateByAsciiString,
    daysFromByDayRule: daysFromByDayRule,
    getTimeZoneOffset: getTimeZoneOffset
});

module.exports = resultUtils;
