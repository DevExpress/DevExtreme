import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';

import timeZoneUtils from '../../m_utils_time_zone';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';

interface StartHoursCompareOptions {
  startDate: Date;
  endDate: Date;
  startDayHour: number;
  isAllDay?: boolean;
  isSeveralDays?: boolean;
}

interface CompareOptions extends StartHoursCompareOptions {
  endDayHour: number;
  min: Date;
  max: Date;
  isTimeDateView: boolean;
}

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';

export const compareDateWithStartDayHour = ({
  startDate,
  endDate,
  startDayHour,
  isAllDay = false,
  isSeveralDays = false,
}: StartHoursCompareOptions): boolean => {
  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const appointmentStart = {
    hours: startDate.getHours(),
    minutes: startDate.getMinutes(),
  };
  const appointmentEnd = {
    hours: endDate.getHours(),
    minutes: endDate.getMinutes(),
  };

  const isStartAfterOrEqual = appointmentStart.hours >= startTime.hours && appointmentStart.minutes >= startTime.minutes;
  const isEndAfterStartTime = appointmentEnd.hours > startTime.hours
    || (appointmentEnd.hours === startTime.hours && appointmentEnd.minutes > startTime.minutes);

  return isStartAfterOrEqual
    || isEndAfterStartTime
    || isSeveralDays
    || isAllDay;
};

export const compareDateWithTime = ({
  startDate,
  endDate,
  startDayHour,
  endDayHour,
  min,
  max,
  isTimeDateView,
  isAllDay = false,
}: CompareOptions): boolean => {
  const appointmentStart = {
    hours: startDate.getHours(),
    minutes: startDate.getMinutes(),
  };
  const appointmentEnd = {
    hours: endDate.getHours(),
    minutes: endDate.getMinutes(),
  };

  const trimMin = dateUtils.trimTime(min);
  const trimMax = dateUtils.trimTime(max);
  const trimStartDate = dateUtils.trimTime(startDate);
  const trimEndDate = dateUtils.trimTime(endDate);
  const isBetween = trimEndDate > trimMin && trimStartDate < trimMax;
  const isStartDateBorder = Boolean(dateUtils.sameDate(trimEndDate, trimMin));
  const isEndDateBorder = Boolean(dateUtils.sameDate(trimStartDate, trimMax));

  if (!isTimeDateView || isAllDay) {
    return isBetween || isStartDateBorder || isEndDateBorder;
  }

  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const isAfterMinHours = isStartDateBorder && (
    appointmentEnd.hours > startTime.hours
    || (appointmentEnd.hours === startTime.hours && appointmentEnd.minutes > startTime.minutes)
  );
  const isBeforeMinHours = isEndDateBorder && (
    appointmentStart.hours < endTime.hours
    || (appointmentStart.hours === endTime.hours && appointmentStart.minutes < endTime.minutes)
  );

  return isBetween || isAfterMinHours || isBeforeMinHours;
};

export const getAppointmentTakesSeveralDays = (dates: {
  startDate: Date;
  endDate: Date;
}) => !dateUtils.sameDate(dates.startDate, dates.endDate);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _appointmentPartInInterval = (startDate, endDate, startDayHour, endDayHour) => {
  const apptStartDayHour = startDate.getHours();
  const apptEndDayHour = endDate.getHours();

  return (apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour)
        || (apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour);
};

export const getRecurrenceException = (appointmentAdapter, timeZoneCalculator) => {
  const { recurrenceException } = appointmentAdapter;

  if (recurrenceException) {
    const exceptions = recurrenceException.split(',');

    for (let i = 0; i < exceptions.length; i++) {
      exceptions[i] = _convertRecurrenceException(
        exceptions[i],
        appointmentAdapter.startDate,
        timeZoneCalculator,
      );
    }

    return exceptions.join();
  }

  return recurrenceException;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _convertRecurrenceException = (exceptionString, startDate, timeZoneCalculator) => {
  exceptionString = exceptionString.replace(/\s/g, '');

  const getConvertedToTimeZone = (date) => timeZoneCalculator.createDate(date, 'toGrid');

  const exceptionDate = dateSerialization.deserializeDate(exceptionString);
  const convertedStartDate = getConvertedToTimeZone(startDate);
  let convertedExceptionDate = getConvertedToTimeZone(exceptionDate);

  convertedExceptionDate = timeZoneUtils.correctRecurrenceExceptionByTimezone(
    convertedExceptionDate,
    convertedStartDate,
  );

  exceptionString = dateSerialization.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT);

  return exceptionString;
};

export const sortAppointmentsByStartDate = (
  appointments,
  dataAccessors: AppointmentDataAccessor,
) => {
  appointments.sort((a, b) => {
    const firstDate = dataAccessors.get('startDate', a.settings || a);
    const secondDate = dataAccessors.get('startDate', b.settings || b);

    return Math.sign(firstDate.getTime() - secondDate.getTime());
  });
};
