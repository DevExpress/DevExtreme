import { dateUtilsTs } from '@ts/core/utils/date';
import { RRule, RRuleSet } from 'rrule';

import timeZoneUtils from '../utils_time_zone';
import { getDateByAsciiString, parseRecurrenceRule } from './base';
import type { ProcessorOptions, RRuleParams } from './types';
import { validateRRuleObject } from './validate_rule';

const { addOffsets } = dateUtilsTs;

const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

const RRULE_BROKEN_TIMEZONES = [
  'Etc/GMT-13',
  'MIT',
  'Pacific/Apia',
  'Pacific/Enderbury',
  'Pacific/Tongatapu',
  'Etc/GMT-14',
  'Pacific/Kiritimati',
];

const getRruleParams = (options: ProcessorOptions): RRuleParams => {
  const {
    start, min, max, appointmentTimezoneOffset,
  } = options;
  // NOTE: Get local timezone offset of each Rrule date params.
  const clientOffsets = {
    startDate: timeZoneUtils.getClientTimezoneOffset(start),
    minViewDate: timeZoneUtils.getClientTimezoneOffset(min),
    maxViewDate: timeZoneUtils.getClientTimezoneOffset(max),
  };
  const duration = options.end ? options.end.getTime() - options.start.getTime() : 0;

  // NOTE: Remove local timezone offsets from Rrule date params.
  const startIntervalDate = addOffsets(
    options.start,
    -clientOffsets.startDate,
    appointmentTimezoneOffset,
  );
  const minViewTime = options.min.getTime() - clientOffsets.minViewDate + appointmentTimezoneOffset;
  // NOTE: Shift minViewDate, because recurrent appointment may start before start view date.
  const minViewDate = new Date(minViewTime - duration);
  const maxViewDate = addOffsets(
    options.max,
    -clientOffsets.maxViewDate,
    appointmentTimezoneOffset,
  );

  // NOTE: Check DST after start date without local timezone offset conversion.
  const startDateDSTDifferenceMs = timeZoneUtils.getDiffBetweenClientTimezoneOffsets(
    options.start,
    startIntervalDate,
  );
  const switchToSummerTime = startDateDSTDifferenceMs < 0;

  return {
    startIntervalDate,
    minViewTime,
    minViewDate,
    maxViewDate,
    startIntervalDateDSTShift: switchToSummerTime ? 0 : startDateDSTDifferenceMs,
    appointmentDuration: duration,
  };
};

const getLocalMachineOffset = (rruleDate: Date): number[] => {
  const machineTimezoneOffset = timeZoneUtils.getClientTimezoneOffset(rruleDate);
  const machineTimezoneName = timeZoneUtils.getMachineTimezoneName();
  const result = [machineTimezoneOffset];

  // NOTE: Workaround for the RRule bug with timezones greater than GMT+12
  // (e.g. Apia Standard Time GMT+13)
  // GitHub issue: https://github.com/jakubroztocil/rrule/issues/555
  // UPD: 05.09.2023 - The issue still hasn't been fixed in the Rule package.
  // RRule returns results that are one day greater than expected.
  // Therefore, for broken from RRule point of view timezones, we subtract one day from the result.
  const brokenTimezonesOffset = -13;
  const isTimezoneOffsetInBrokenRange = machineTimezoneOffset / MS_IN_HOUR <= brokenTimezonesOffset;
  const isTimezoneNameInBrokenNames = !machineTimezoneName
    || RRULE_BROKEN_TIMEZONES.some((timezone) => machineTimezoneName.includes(timezone));

  if (isTimezoneOffsetInBrokenRange && isTimezoneNameInBrokenNames) {
    result.push(-MS_IN_DAY);
  }

  return result;
};

const convertRruleResult = (
  rruleIntervalParams: RRuleParams,
  options: ProcessorOptions,
  rruleDate: Date,
): Date => {
  const convertedBackDate = addOffsets(
    rruleDate,
    ...getLocalMachineOffset(rruleDate),
    -options.appointmentTimezoneOffset,
    rruleIntervalParams.startIntervalDateDSTShift,
  );
  const convertedDateDSTShift = timeZoneUtils.getDiffBetweenClientTimezoneOffsets(
    convertedBackDate,
    rruleDate,
  );
  const switchToSummerTime = convertedDateDSTShift < 0;
  const resultDate = addOffsets(convertedBackDate, convertedDateDSTShift);
  const resultDateDSTShift = timeZoneUtils.getDiffBetweenClientTimezoneOffsets(
    resultDate,
    convertedBackDate,
  );

  if (resultDateDSTShift && switchToSummerTime) {
    return new Date(resultDate.getTime() + resultDateDSTShift);
  }

  return resultDate;
};

const createRRule = (
  options: ProcessorOptions,
  startDateUtc: Date,
  until?: Date | null,
): RRuleSet => {
  const ruleOptions = RRule.parseString(String(options.rule));
  const { firstDayOfWeek } = options;

  ruleOptions.dtstart = startDateUtc;

  if (!ruleOptions.wkst && firstDayOfWeek) {
    const weekDayNumbers = [6, 0, 1, 2, 3, 4, 5];
    ruleOptions.wkst = weekDayNumbers[firstDayOfWeek];
  }

  if (until) {
    ruleOptions.until = addOffsets(
      until,
      -timeZoneUtils.getClientTimezoneOffset(until),
      options.appointmentTimezoneOffset,
    );
  }

  const rRuleSet = new RRuleSet();
  const rRule = new RRule(ruleOptions);
  rRuleSet.rrule(rRule);

  if (options.exception) {
    const exceptionStrings = options.exception;
    const exceptionDates = exceptionStrings
      .split(',')
      .map((rule) => getDateByAsciiString(rule))
      .filter(Boolean) as Date[];

    exceptionDates.forEach((date) => {
      const rruleTimezoneOffsets = typeof options.getExceptionDateTimezoneOffsets === 'function'
        ? options.getExceptionDateTimezoneOffsets(date)
        : [-timeZoneUtils.getClientTimezoneOffset(date), options.appointmentTimezoneOffset];
      const exceptionDateInPseudoUtc = addOffsets(
        date,
        ...rruleTimezoneOffsets,
      );

      rRuleSet.exdate(exceptionDateInPseudoUtc);
    });
  }

  return rRuleSet;
};

export const generateDates = (options: ProcessorOptions): Date[] => {
  if (!options.rule) {
    return [];
  }

  const rule = parseRecurrenceRule(options.rule);
  const isValid = validateRRuleObject(rule, options.rule);

  if (!isValid) {
    return [];
  }

  const rruleIntervalParams = getRruleParams(options);
  const {
    startIntervalDate, maxViewDate, minViewDate, minViewTime, appointmentDuration,
  } = rruleIntervalParams;
  const rRuleSet = createRRule(
    options,
    startIntervalDate,
    rule.until,
  );

  return rRuleSet.between(
    minViewDate,
    maxViewDate,
    true,
  )
    .filter((date) => date.getTime() + appointmentDuration >= minViewTime)
    .map((date) => convertRruleResult(rruleIntervalParams, options, date));
};
