import errors from '../../core/errors';
import { each } from '../../core/utils/iterator';
import { RRule, RRuleSet } from 'rrule';
import dateUtils from '../../core/utils/date';
import timeZoneUtils from './utils.timeZone';

const toMs = dateUtils.dateToMilliseconds;

const ruleNames = ['freq', 'interval', 'byday', 'byweekno', 'byyearday', 'bymonth', 'bymonthday', 'count', 'until', 'byhour', 'byminute', 'bysecond', 'bysetpos', 'wkst'];
const freqNames = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SECONDLY', 'MINUTELY', 'HOURLY'];
const days = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
const loggedWarnings = [];
const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

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
        const recurrenceRule = this.evalRecurrenceRule(options.rule);
        const rule = recurrenceRule.rule;

        if(!recurrenceRule.isValid || !rule.freq) {
            return [];
        }

        const rruleIntervalParams = this._createRruleIntervalParams(options);

        this._initializeRRule(options,
            rruleIntervalParams.startIntervalDate,
            rule.until);

        return this.rRuleSet.between(
            rruleIntervalParams.minViewDate,
            rruleIntervalParams.maxViewDate,
            true
        )
            .filter((date) => date.getTime() + rruleIntervalParams.appointmentDuration >= rruleIntervalParams.minViewTime)
            .map((date) => this._convertRruleResult(rruleIntervalParams, options, date));
    }

    _createRruleIntervalParams(options) {
        const { start, min, max, appointmentTimezoneOffset } = options;
        // NOTE: Get local timezone offset of each Rrule date params.
        const clientOffsets = {
            startDate: timeZoneUtils.getClientTimezoneOffset(start),
            minViewDate: timeZoneUtils.getClientTimezoneOffset(min),
            maxViewDate: timeZoneUtils.getClientTimezoneOffset(max),
        };
        const duration = options.end ? options.end.getTime() - options.start.getTime() : 0;

        // NOTE: Remove local timezone offsets from Rrule date params.
        const startIntervalDate = timeZoneUtils.setOffsetsToDate(options.start, [-clientOffsets.startDate, appointmentTimezoneOffset]);
        const minViewTime = options.min.getTime() - clientOffsets.minViewDate + appointmentTimezoneOffset;
        // NOTE: Shift minViewDate, because recurrent appointment may start before start view date.
        const minViewDate = new Date(minViewTime - duration);
        const maxViewDate = timeZoneUtils.setOffsetsToDate(options.max, [-clientOffsets.maxViewDate, appointmentTimezoneOffset]);

        // NOTE: Check DST after start date without local timezone offset conversion.
        const startDateDSTDifferenceMs = timeZoneUtils.getDiffBetweenClientTimezoneOffsets(options.start, startIntervalDate);
        const switchToSummerTime = startDateDSTDifferenceMs < 0;

        return {
            startIntervalDate,
            minViewTime,
            minViewDate,
            maxViewDate,
            startIntervalDateDSTShift: switchToSummerTime ? 0 : startDateDSTDifferenceMs,
            appointmentDuration: duration,
        };
    }

    _convertRruleResult(rruleIntervalParams, options, rruleDate) {
        const localTimezoneOffset = timeZoneUtils.getClientTimezoneOffset(rruleDate);
        // NOTE: Workaround for the RRule bug with timezones greater than GMT+12 (e.g. Apia Standard Time GMT+13)
        // GitHub issue: https://github.com/jakubroztocil/rrule/issues/555
        const additionalWorkaroundOffsetForRrule =
            localTimezoneOffset / MS_IN_HOUR <= -13 ? -MS_IN_DAY : 0;
        const convertedBackDate = timeZoneUtils.setOffsetsToDate(
            rruleDate, [
                localTimezoneOffset,
                additionalWorkaroundOffsetForRrule,
                -options.appointmentTimezoneOffset,
                rruleIntervalParams.startIntervalDateDSTShift,
            ]);
        const convertedDateDSTShift = timeZoneUtils.getDiffBetweenClientTimezoneOffsets(convertedBackDate, rruleDate);
        const switchToSummerTime = convertedDateDSTShift < 0;
        const resultDate = timeZoneUtils.setOffsetsToDate(convertedBackDate, [convertedDateDSTShift]);
        const resultDateDSTShift = timeZoneUtils.getDiffBetweenClientTimezoneOffsets(resultDate, convertedBackDate);

        if(resultDateDSTShift && switchToSummerTime) {
            return new Date(resultDate.getTime() + resultDateDSTShift);
        }

        return resultDate;
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

    _initializeRRule(options, startDateUtc, until) {
        const ruleOptions = RRule.parseString(options.rule);
        const firstDayOfWeek = options.firstDayOfWeek;

        ruleOptions.dtstart = startDateUtc;

        if(!ruleOptions.wkst && firstDayOfWeek) {
            const weekDayNumbers = [6, 0, 1, 2, 3, 4, 5];
            ruleOptions.wkst = weekDayNumbers[firstDayOfWeek];
        }

        if(until) {
            ruleOptions.until = timeZoneUtils.setOffsetsToDate(until,
                [-timeZoneUtils.getClientTimezoneOffset(until), options.appointmentTimezoneOffset]);
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

                const utcDate = timeZoneUtils.setOffsetsToDate(date,
                    [-timeZoneUtils.getClientTimezoneOffset(date), options.appointmentTimezoneOffset]);

                this.rRuleSet.exdate(utcDate);
            });
        }
    }

    _createRRule(ruleOptions) {
        this._dispose();

        this.rRuleSet = new RRuleSet();
        this.rRule = new RRule(ruleOptions);

        this.rRuleSet.rrule(this.rRule);
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
            !freqNames.includes(rule.freq) ||
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
            if(!ruleNames.includes(ruleName)) {
                brokenRuleExists = true;
                return false;
            }
        });

        return brokenRuleExists;
    }

    _logBrokenRule(recurrence) {
        if(!loggedWarnings.includes(recurrence)) {
            errors.log('W0006', recurrence);
            loggedWarnings.push(recurrence);
        }
    }
}
