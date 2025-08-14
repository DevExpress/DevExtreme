import dateSerialization from '@js/core/utils/date_serialization';

import timeZoneUtils from '../../m_utils_time_zone';
import type { TimeZoneCalculator } from '../../r1/timezone_calculator';

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';

const convertRecurrenceException = (
  rawExceptionString: string,
  startDate: Date,
  timeZoneCalculator: TimeZoneCalculator,
): string => {
  const exceptionString = rawExceptionString.replace(/\s/g, '');

  const exceptionDate = dateSerialization.deserializeDate(exceptionString);
  const convertedStartDate = timeZoneCalculator.createDate(startDate, 'toGrid');
  let convertedExceptionDate = timeZoneCalculator.createDate(exceptionDate, 'toGrid');

  convertedExceptionDate = timeZoneUtils.correctRecurrenceExceptionByTimezone(
    convertedExceptionDate,
    convertedStartDate,
  );

  return dateSerialization.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT) as string;
};

export const getRecurrenceException = (
  recurrenceException: string | undefined,
  startDate: Date,
  timeZoneCalculator: TimeZoneCalculator,
): string | undefined => {
  if (recurrenceException) {
    const exceptions = recurrenceException.split(',');

    for (let i = 0; i < exceptions.length; i += 1) {
      exceptions[i] = convertRecurrenceException(
        exceptions[i],
        startDate,
        timeZoneCalculator,
      );
    }

    return exceptions.join();
  }

  return recurrenceException;
};
