import dateSerialization from '@js/core/utils/date_serialization';

import type { TimeZoneCalculator } from '../../../../r1/timezone_calculator';

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';

const convertRecurrenceException = (
  rawExceptionString: string,
  timeZoneCalculator: TimeZoneCalculator,
): string => {
  const exceptionString = rawExceptionString.replace(/\s/g, '');

  const exceptionDate = dateSerialization.deserializeDate(exceptionString);
  const convertedExceptionDate = timeZoneCalculator.createDate(exceptionDate, 'toGrid');

  return dateSerialization.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT) as string;
};

export const getRecurrenceException = (
  recurrenceException: string | undefined,
  timeZoneCalculator: TimeZoneCalculator,
): string | undefined => {
  if (recurrenceException) {
    const exceptions = recurrenceException.split(',');

    for (let i = 0; i < exceptions.length; i += 1) {
      exceptions[i] = convertRecurrenceException(
        exceptions[i],
        timeZoneCalculator,
      );
    }

    return exceptions.join();
  }

  return recurrenceException;
};
