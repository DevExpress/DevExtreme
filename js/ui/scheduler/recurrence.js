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
export function getRecurrenceProcessor() {
    if(!recurrence) {
        recurrence = new RecurrenceProcessor();
    }
    return recurrence;
}

class RecurrenceProcessor {
    constructor() {
        this.rRule = null;
        this.rRuleSet = null;
        this.validator = new RecurrenceValidator();
    }

    generateDates(options) {
        const result = [];
        const recurrenceRule = this.evalRecurrenceRule(options.rule);
        const rule = recurrenceRule.rule;

        if(!recurrenceRule.isValid || !rule.freq) {
            return result;
        }

        const startDateUtc = timeZoneUtils.createUTCDateWithLocalOffset(options.start);
        const endDateUtc = timeZoneUtils.createUTCDateWithLocalOffset(options.end);
        const minDateUtc = timeZoneUtils.createUTCDateWithLocalOffset(options.min);
        const maxDateUtc = timeZoneUtils.createUTCDateWithLocalOffset(options.max);

        const duration = endDateUtc ? endDateUtc.getTime() - startDateUtc.getTime() : 0;

        this._initializeRRule(options, startDateUtc);

        const minTime = minDateUtc.getTime();
        const leftBorder = this._getLeftBorder(options, minDateUtc, duration);

        this.rRuleSet.between(leftBorder, maxDateUtc, true).forEach(date => {
            const endAppointmentTime = date.getTime() + duration;

            if(endAppointmentTime >= minTime) {
                const correctDate = timeZoneUtils.createDateFromUTCWithLocalOffset(date);
                result.push(correctDate);
            }
        });

        return result;
    }

    hasRecurrence(options) {
        return !!this.generateDates(options).length;
    }

    evalRecurrenceRule(rule) {
        const result = {
            rule: {},
            isValid: false
        };

        if(rule) {
            result.rule = this._parseRecurrenceRule(rule);
            result.isValid = this.validator.validateRRule(result.rule, rule);
        }

        return result;
    }

    isValidRecurrenceRule(rule) {
        return this.evalRecurrenceRule(rule).isValid;
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

        return result.map(item => {
            const match = item.match(/[A-Za-z]+/);
            return !!match && match[0];
        }).filter(item => !!item);
    }

    getAsciiStringByDate(date) {
        const currentOffset = date.getTimezoneOffset() * toMs('minute');
        const offsetDate = new Date(date.getTime() + currentOffset);

        return offsetDate.getFullYear() + ('0' + (offsetDate.getMonth() + 1)).slice(-2) + ('0' + offsetDate.getDate()).slice(-2) +
            'T' + ('0' + (offsetDate.getHours())).slice(-2) + ('0' + (offsetDate.getMinutes())).slice(-2) + ('0' + (offsetDate.getSeconds())).slice(-2) + 'Z';
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

    _parseExceptionToRawArray(value) {
        return value.match(/(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2}))?(Z)?/);
    }

    getDateByAsciiString(exceptionText) {
        if(typeof exceptionText !== 'string') {
            return exceptionText;
        }

        const result = this._parseExceptionToRawArray(exceptionText);

        if(!result) {
            return null;
        }

        const [year, month, date, hours, minutes, seconds, isUtc] = this._createDateTuple(result);

        if(isUtc) {
            return new Date(Date.UTC(
                year,
                month,
                date,
                hours,
                minutes,
                seconds)
            );
        }

        return new Date(
            year,
            month,
            date,
            hours,
            minutes,
            seconds
        );
    }

    _dispose() {
        if(this.rRuleSet) {
            delete this.rRuleSet;
            this.rRuleSet = null;
        }
        if(this.rRule) {
            delete this.rRule;
            this.rRule = null;
        }
    }

    _getTimeZoneOffset() {
        return new Date().getTimezoneOffset();
    }

    _initializeRRule(options, startDateUtc) {
        const ruleOptions = RRule.parseString(options.rule);
        const firstDayOfWeek = options.firstDayOfWeek;

        ruleOptions.dtstart = startDateUtc;

        if(!ruleOptions.wkst && firstDayOfWeek) {
            const weekDayNumbers = [6, 0, 1, 2, 3, 4, 5];
            ruleOptions.wkst = weekDayNumbers[firstDayOfWeek];
        }

        this._createRRule(ruleOptions);

        if(options.exception) {
            const exceptionStrings = options.exception;
            const exceptionDates = exceptionStrings
                .split(',')
                .map(rule => this.getDateByAsciiString(rule));

            exceptionDates.forEach(date => {
                if(options.getPostProcessedException) {
                    date = options.getPostProcessedException(date);
                }

                const utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
                this.rRuleSet.exdate(utcDate);
            });
        }
    }

    _createRRule(ruleOptions) {
        this._dispose();

        const rRuleSet = new RRuleSet();

        this.rRuleSet = rRuleSet;
        this.rRule = new RRule(ruleOptions);

        this.rRuleSet.rrule(this.rRule);
    }

    _getLeftBorder(options, minDateUtc, appointmentDuration) {
        if(options.end && !timeZoneUtils.isSameAppointmentDates(options.start, options.end)) {
            return new Date(minDateUtc.getTime() - appointmentDuration);
        }

        return minDateUtc;
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

    _createDateTuple(parseResult) {
        const isUtc = parseResult[8] !== undefined;

        parseResult.shift();

        if(parseResult[3] === undefined) {
            parseResult.splice(3);
        } else {
            parseResult.splice(3, 1);
            parseResult.splice(6);
        }

        parseResult[1]--;

        parseResult.unshift(null);

        return [
            parseInt(parseResult[1]),
            parseInt(parseResult[2]),
            parseInt(parseResult[3]),
            parseInt(parseResult[4]) || 0,
            parseInt(parseResult[5]) || 0,
            parseInt(parseResult[6]) || 0,
            isUtc
        ];
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
        const byDay = rule['byday'];
        const daysByRule = getRecurrenceProcessor().daysFromByDayRule(rule);
        let brokenDaysExist = false;

        if(byDay === '') {
            brokenDaysExist = true;
        }
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
