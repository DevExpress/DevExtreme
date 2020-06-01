// NOTE: https://github.com/jakubroztocil/rrule/issues/402 (IE11 support)
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

let recurrence = null;
export function getRecurrence() {
    if(!recurrence) {
        recurrence = new Recurrence();
    }
    return recurrence;
}

class Recurrence {
    constructor() {
        this.rRule = null;
        this.rRuleSet = null;
        this.validator = new RecurrenceValidator();
    }

    dispose() {
        this.rRuleSet && delete this.rRuleSet;
        this.rRule && delete this.rRule;
    }

    getDatesByRecurrence(options) {
        const result = [];
        const recurrenceRule = this.getRecurrenceRule(options.rule);
        const rule = recurrenceRule.rule;

        if(!recurrenceRule.isValid || !rule.freq) {
            return result;
        }

        const startDateUtc = this._getRRuleUtcDate(options.start);
        const endDateUtc = this._getRRuleUtcDate(options.end);
        const minDateUtc = this._getRRuleUtcDate(options.min);
        const maxDateUtc = this._getRRuleUtcDate(options.max);

        const duration = endDateUtc ? endDateUtc.getTime() - startDateUtc.getTime() : 0;

        const minTime = minDateUtc.getTime();
        const leftBorder = this.getLeftBorder(options, minDateUtc, duration);

        const rRuleSet = this.createRRuleSet(options, startDateUtc);

        rRuleSet.between(leftBorder, maxDateUtc, true).forEach(date => {
            const endAppointmentTime = date.getTime() + duration;

            if(endAppointmentTime >= minTime) {
                this._correctTimezoneOffset(date);
                result.push(date);
            }
        });

        return result;
    }

    createRRuleSet(options, startDateUtc) {
        const ruleOptions = RRule.parseString(options.rule);
        const firstDayOfWeek = options.firstDayOfWeek;

        ruleOptions.dtstart = startDateUtc;

        if(!ruleOptions.wkst && firstDayOfWeek) {
            const weekDayNumbers = [6, 0, 1, 2, 3, 4, 5];
            ruleOptions.wkst = weekDayNumbers[firstDayOfWeek];
        }

        this.dispose();

        const rRuleSet = new RRuleSet();
        const rRule = new RRule(ruleOptions);

        rRuleSet.rrule(rRule);

        if(options.exception) {
            const splitDates = options.exception.split(',');
            const exceptDates = this._getDatesByRecurrenceException(splitDates, startDateUtc);
            for(let i = 0; i < exceptDates.length; i++) {
                rRuleSet.exdate(this._getRRuleUtcDate(exceptDates[i]));
            }
        }

        this.rRule = rRule;
        this.rRuleSet = rRuleSet;

        return rRuleSet;
    }

    getLeftBorder(options, minDateUtc, appointmentDuration) {
        if(options.end && !timeZoneUtils.isSameAppointmentDates(options.start, options.end)) {
            return new Date(minDateUtc.getTime() - appointmentDuration);
        }

        return minDateUtc;
    }

    getRecurrenceRule(recurrence) {
        const result = {
            rule: {},
            isValid: false
        };

        if(recurrence) {
            result.rule = this._parseRecurrenceRule(recurrence);
            result.isValid = this.validator.validateRRule(result.rule, recurrence);
        }

        return result;
    }

    getTimeZoneOffset() {
        return new Date().getTimezoneOffset();
    }

    dateInRecurrenceRange(options) {
        let result = [];

        if(options.rule) {
            result = this.getDatesByRecurrence(options);
        }

        return !!result.length;
    }

    daysFromByDayRule(rule) {
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

    getAsciiStringByDate(date) {
        const currentOffset = this.getTimeZoneOffset() * toMs('minute');

        date = new Date(date.getTime() + currentOffset);
        return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) +
            'T' + ('0' + (date.getHours())).slice(-2) + ('0' + (date.getMinutes())).slice(-2) + ('0' + (date.getSeconds())).slice(-2) + 'Z';
    }

    getRecurrenceString(object) {
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
                value = this.getAsciiStringByDate(value);
            }

            result += field + '=' + value + ';';
        }

        result = result.substring(0, result.length - 1);

        return result.toUpperCase();
    }

    getDateByAsciiString(string, initialDate) {
        if(typeof string !== 'string') {
            return string;
        }

        const arrayDate = string.match(/(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2}))?(Z)?/);

        if(!arrayDate) {
            return null;
        }

        const isUTCString = arrayDate[8] !== undefined;
        let currentOffset = initialDate ? initialDate.getTimezoneOffset() : this.getTimeZoneOffset();
        let date = new (Function.prototype.bind.apply(Date, this._prepareDateArrayToParse(arrayDate)))();

        currentOffset = currentOffset * toMs('minute');

        if(isUTCString) {
            date = new Date(date.getTime() - currentOffset);
        }

        return date;
    }

    _getDatesByRecurrenceException(ruleValues, date) {
        const result = [];

        for(let i = 0, len = ruleValues.length; i < len; i++) {
            result[i] = this.getDateByAsciiString(ruleValues[i], date);
        }

        return result;
    }

    _getRRuleUtcDate(date) {
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

    _correctTimezoneOffset(date) {
        // TZ correction - Some specific in RRule. Perhaps it related to using of luxon.
        const timezoneOffsetBefore = date.getTimezoneOffset();
        const timezoneOffset = timezoneOffsetBefore * toMs('minute');

        date.setTime(date.getTime() + timezoneOffset);

        const timezoneOffsetDelta = date.getTimezoneOffset() - timezoneOffsetBefore;
        if(timezoneOffsetDelta) {
            date.setTime(date.getTime() + timezoneOffsetDelta * toMs('minute'));
        }
    }

    _parseRecurrenceRule(recurrence) {
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
            ruleObject.until = this.getDateByAsciiString(ruleObject.until);
        }

        return ruleObject;
    }

    _prepareDateArrayToParse(arrayDate) {
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
}

class RecurrenceValidator {
    validateRRule(rule, recurrence) {
        if(this._brokenRuleNameExists(rule) ||
            inArray(rule.freq, freqNames) === -1 ||
            this._wrongCountRule(rule) || this._wrongIntervalRule(rule) ||
            this._wrongDayOfWeek(rule) ||
            this._wrongByMonthDayRule(rule) || this._wrongByMonth(rule) ||
            this._wrongUntilRule(rule)) {

            this._logBrokenRule(recurrence);

            return false;
        }

        return true;
    }

    _wrongUntilRule(rule) {
        let wrongUntil = false;
        const until = rule.until;

        if(until !== undefined && !(until instanceof Date)) {
            wrongUntil = true;
        }

        return wrongUntil;
    }

    _wrongCountRule(rule) {
        let wrongCount = false;
        const count = rule.count;

        if(count && typeof count === 'string') {
            wrongCount = true;
        }

        return wrongCount;
    }

    _wrongByMonthDayRule(rule) {
        let wrongByMonthDay = false;
        const byMonthDay = rule['bymonthday'];

        if(byMonthDay && isNaN(parseInt(byMonthDay))) {
            wrongByMonthDay = true;
        }

        return wrongByMonthDay;
    }

    _wrongByMonth(rule) {
        let wrongByMonth = false;
        const byMonth = rule['bymonth'];

        if(byMonth && isNaN(parseInt(byMonth))) {
            wrongByMonth = true;
        }

        return wrongByMonth;
    }

    _wrongIntervalRule(rule) {
        let wrongInterval = false;
        const interval = rule.interval;

        if(interval && typeof interval === 'string') {
            wrongInterval = true;
        }

        return wrongInterval;
    }

    _wrongDayOfWeek(rule) {
        const daysByRule = getRecurrence().daysFromByDayRule(rule);
        let brokenDaysExist = false;

        each(daysByRule, function(_, day) {
            if(!Object.prototype.hasOwnProperty.call(days, day)) {
                brokenDaysExist = true;
                return false;
            }
        });

        return brokenDaysExist;
    }

    _brokenRuleNameExists(rule) {
        let brokenRuleExists = false;

        each(rule, function(ruleName) {
            if(inArray(ruleName, ruleNames) === -1) {
                brokenRuleExists = true;
                return false;
            }
        });

        return brokenRuleExists;
    }

    _logBrokenRule(recurrence) {
        if(inArray(recurrence, loggedWarnings) === -1) {
            errors.log('W0006', recurrence);
            loggedWarnings.push(recurrence);
        }
    }
}
