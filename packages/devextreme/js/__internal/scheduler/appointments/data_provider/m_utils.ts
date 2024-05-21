import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';

import { ExpressionUtils } from '../../m_expression_utils';
import timeZoneUtils from '../../m_utils_time_zone';

const toMs = dateUtils.dateToMilliseconds;

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';

export const compareDateWithStartDayHour = (startDate, endDate, startDayHour, allDay, severalDays) => {
  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);

  const result = (startDate.getHours() >= startTime.hours && startDate.getMinutes() >= startTime.minutes)
        || (endDate.getHours() === startTime.hours && endDate.getMinutes() > startTime.minutes)
        || (endDate.getHours() > startTime.hours)
        || severalDays
        || allDay;

  return result;
};

export const compareDateWithEndDayHour = (options) => {
  const {
    startDate,
    endDate,
    startDayHour,
    endDayHour,
    viewStartDayHour,
    viewEndDayHour,
    allDay,
    severalDays,
    min,
    max,
    checkIntersectViewport,
  } = options;

  const hiddenInterval = (24 - viewEndDayHour + viewStartDayHour) * toMs('hour');
  const apptDuration = endDate.getTime() - startDate.getTime();
  const delta = (hiddenInterval - apptDuration) / toMs('hour');
  const apptStartHour = startDate.getHours();
  const apptStartMinutes = startDate.getMinutes();
  let result;

  const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
  const startTime = dateUtils.dateTimeFromDecimal(startDayHour);
  const apptIntersectViewport = startDate < max && endDate > min;

  result = (checkIntersectViewport
            && apptIntersectViewport)
        || (apptStartHour < endTime.hours)
        || (apptStartHour === endTime.hours && apptStartMinutes < endTime.minutes)
        || (allDay
            && startDate <= max)
        || (severalDays
            && apptIntersectViewport
                && (apptStartHour < endTime.hours || (endDate.getHours() * 60 + endDate.getMinutes()) > startTime.hours * 60)
        );

  if (apptDuration < hiddenInterval) {
    if ((apptStartHour > endTime.hours && apptStartMinutes > endTime.minutes) && (delta <= apptStartHour - endDayHour)) {
      result = false;
    }
  }

  return result;
};

export const getAppointmentTakesSeveralDays = (adapter) => !dateUtils.sameDate(adapter.startDate, adapter.endDate);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _isEndDateWrong = (startDate, endDate) => !endDate || isNaN(endDate.getTime()) || startDate.getTime() > endDate.getTime();

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _appointmentPartInInterval = (startDate, endDate, startDayHour, endDayHour) => {
  const apptStartDayHour = startDate.getHours();
  const apptEndDayHour = endDate.getHours();

  return (apptStartDayHour <= startDayHour && apptEndDayHour <= endDayHour && apptEndDayHour >= startDayHour)
        || (apptEndDayHour >= endDayHour && apptStartDayHour <= endDayHour && apptStartDayHour >= startDayHour);
};

export const getRecurrenceException = (appointmentAdapter, timeZoneCalculator, timeZone) => {
  const { recurrenceException } = appointmentAdapter;

  if (recurrenceException) {
    const exceptions = recurrenceException.split(',');

    for (let i = 0; i < exceptions.length; i++) {
      exceptions[i] = _convertRecurrenceException(
        exceptions[i],
        appointmentAdapter.startDate,
        timeZoneCalculator,
        timeZone,
      );
    }

    return exceptions.join();
  }

  return recurrenceException;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const _convertRecurrenceException = (exceptionString, startDate, timeZoneCalculator, timeZone) => {
  exceptionString = exceptionString.replace(/\s/g, '');

  const getConvertedToTimeZone = (date) => timeZoneCalculator.createDate(date, {
    path: 'toGrid',
  });

  const exceptionDate = dateSerialization.deserializeDate(exceptionString);
  const convertedStartDate = getConvertedToTimeZone(startDate);
  let convertedExceptionDate = getConvertedToTimeZone(exceptionDate);

  convertedExceptionDate = timeZoneUtils.correctRecurrenceExceptionByTimezone(
    convertedExceptionDate,
    convertedStartDate,
    timeZone,
  );

  exceptionString = dateSerialization.serializeDate(convertedExceptionDate, FULL_DATE_FORMAT);

  return exceptionString;
};

export const replaceWrongEndDate = (rawAppointment, startDate, endDate, appointmentDuration, dataAccessors) => {
  const calculateAppointmentEndDate = (isAllDay, startDate) => {
    if (isAllDay) {
      return dateUtils.setToDayEnd(new Date(startDate));
    }

    return new Date(startDate.getTime() + appointmentDuration * toMs('minute'));
  };

  if (_isEndDateWrong(startDate, endDate)) {
    const isAllDay = ExpressionUtils.getField(dataAccessors, 'allDay', rawAppointment);

    const calculatedEndDate = calculateAppointmentEndDate(isAllDay, startDate);
    dataAccessors.setter.endDate(rawAppointment, calculatedEndDate);
  }
};

export const sortAppointmentsByStartDate = (appointments, dataAccessors) => {
  appointments.sort((a, b) => {
    const firstDate = new Date(ExpressionUtils.getField(dataAccessors, 'startDate', a.settings || a));
    const secondDate = new Date(ExpressionUtils.getField(dataAccessors, 'startDate', b.settings || b));

    return Math.sign(firstDate.getTime() - secondDate.getTime());
  });
};
