// NOTE: TODO
import 'es6-object-assign/auto';
import errors from '../../core/errors';
import { each } from '../../core/utils/iterator';
import { inArray } from '../../core/utils/array';
import { RRule, RRuleSet } from 'rrule';
import dateUtils from '../../core/utils/date';
import timeZoneUtils from './utils.timeZone.js';

const toMs = dateUtils.dateToMilliseconds;

const ruleNames = ['freq', 'interval', 'byday', 'byweekno', 'byyearday', 'bymonth', 'bymonthday', 'count', 'until', 'byhour', 'byminute', 'bysecond', 'bysetpos', 'wkst'];
const freqNames = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SECONDLY', 'MINUTELY', 'HOURLY'];
const days = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const loggedWarnings = [];

export const recurrenceUtils = {
    getTimeZoneOffset: function() {
        return new Date().getTimezoneOffset();
    },

    dateInRecurrenceRange: function(options) {
        let result = [];

        if(options.rule) {
            result = recurrenceUtils.getDatesByRecurrence(options);
        }

        return !!result.length;
    },

    getDatesByRecurrence: function(options) {
        const result = [];
        const recurrenceRule = recurrenceUtils.getRecurrenceRule(options.rule);
        const rule = recurrenceRule.rule;

        if(!recurrenceRule.isValid || !rule.freq) {
            return result;
        }

        const startDateUtc = getRRuleUtcDate(options.start);
        const endDateUtc = getRRuleUtcDate(options.end);
        const minDateUtc = getRRuleUtcDate(options.min);
        const maxDateUtc = getRRuleUtcDate(options.max);
        const exception = options.exception;

        const duration = endDateUtc ? endDateUtc.getTime() - startDateUtc.getTime() : 0;

        const minTime = minDateUtc.getTime();
        const leftBorder = recurrenceUtils.getLeftBorder(options, minDateUtc, duration);

        const rRuleSet = recurrenceUtils.createRRuleSet(options, startDateUtc);

        if(exception) {
            const splitDates = exception.split(',');
            const exceptDates = getDatesByRecurrenceException(splitDates, startDateUtc);
            for(let i = 0; i < exceptDates.length; i++) {
                rRuleSet.exdate(getRRuleUtcDate(exceptDates[i]));
            }
        }

        rRuleSet.between(leftBorder, maxDateUtc, true).forEach(date => {
            const endAppointmentTime = date.getTime() + duration;

            if(endAppointmentTime >= minTime) {
                correctTimezoneOffset(date);
                result.push(date);
            }
        });

        return result;
    },

    createRRuleSet: function(options, startDateUtc) {
        const ruleOptions = RRule.parseString(options.rule);
        const firstDayOfWeek = options.firstDayOfWeek;

        ruleOptions.dtstart = startDateUtc;

        if(!ruleOptions.wkst && firstDayOfWeek) {
            const weekDayNumbers = [6, 0, 1, 2, 3, 4, 5];
            ruleOptions.wkst = weekDayNumbers[firstDayOfWeek];
        }

        const rRuleSet = new RRuleSet();

        rRuleSet.rrule(new RRule(ruleOptions));

        return rRuleSet;
    },

    getLeftBorder: function(options, minDateUtc, appointmentDuration) {
        if(options.end && !timeZoneUtils.isSameAppointmentDates(options.start, options.end)) {
            return new Date(minDateUtc.getTime() - appointmentDuration);
        }

        return minDateUtc;
    },

    getRecurrenceRule: function(recurrence) {
        const result = {
            rule: {},
            isValid: false
        };

        if(recurrence) {
            result.rule = parseRecurrenceRule(recurrence);
            result.isValid = validateRRule(result.rule, recurrence);
        }

        return result;
    },

    daysFromByDayRule: function(rule) {
        let result = [];

        if(rule['byday']) {
            if(Array.isArray(rule['byday'])) {
                result = rule['byday'];
            } else {
                result = rule['byday'].split(',');
            }
        }

        return result;
    },

    getAsciiStringByDate: function(date) {
        const currentOffset = recurrenceUtils.getTimeZoneOffset() * toMs('minute');

        date = new Date(date.getTime() + currentOffset);
        return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) +
            'T' + ('0' + (date.getHours())).slice(-2) + ('0' + (date.getMinutes())).slice(-2) + ('0' + (date.getSeconds())).slice(-2) + 'Z';
    },

    getRecurrenceString: function(object) {
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
                value = recurrenceUtils.getAsciiStringByDate(value);
            }

            result += field + '=' + value + ';';
        }

        result = result.substring(0, result.length - 1);

        return result.toUpperCase();
    },

    getDateByAsciiString: function(string, initialDate) {
        if(typeof string !== 'string') {
            return string;
        }

        const arrayDate = string.match(/(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2}))?(Z)?/);

        if(!arrayDate) {
            return null;
        }

        const isUTCString = arrayDate[8] !== undefined;
        let currentOffset = initialDate ? initialDate.getTimezoneOffset() : recurrenceUtils.getTimeZoneOffset();
        let date = new (Function.prototype.bind.apply(Date, prepareDateArrayToParse(arrayDate)))();

        currentOffset = currentOffset * toMs('minute');

        if(isUTCString) {
            date = new Date(date.getTime() - currentOffset);
        }

        return date;
    }
};

function getDatesByRecurrenceException(ruleValues, date) {
    const result = [];

    for(let i = 0, len = ruleValues.length; i < len; i++) {
        result[i] = recurrenceUtils.getDateByAsciiString(ruleValues[i], date);
    }

    return result;
}

function getRRuleUtcDate(date) {
    if(!date) {
        return null;
    }

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

function correctTimezoneOffset(date) {
    // TZ correction - Some specific in RRule. Perhaps it related to using of luxon.
    const timezoneOffsetBefore = date.getTimezoneOffset();
    const timezoneOffset = timezoneOffsetBefore * toMs('minute');

    date.setTime(date.getTime() + timezoneOffset);

    const timezoneOffsetDelta = date.getTimezoneOffset() - timezoneOffsetBefore;
    if(timezoneOffsetDelta) {
        date.setTime(date.getTime() + timezoneOffsetDelta * toMs('minute'));
    }
}

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
    const daysByRule = recurrenceUtils.daysFromByDayRule(rule);
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
        ruleObject.until = recurrenceUtils.getDateByAsciiString(ruleObject.until);
    }

    return ruleObject;
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
