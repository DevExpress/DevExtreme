import type { Appointment } from '../../../../../ui/scheduler';
import AppointmentAdapter, { createAppointmentAdapter } from '../../../../../ui/scheduler/appointmentAdapter';
import { TimeZoneCalculator } from '../../timeZoneCalculator/utils';
import { DataAccessorType } from '../../types';
import dateSerialization from '../../../../../core/utils/date_serialization';

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const UTC_FULL_DATE_FORMAT = `${FULL_DATE_FORMAT}Z`;

const getSerializedDate = (
  date: Date,
  startDate: Date,
  isAllDay: boolean,
): Date => {
  if (isAllDay) {
    date.setHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      startDate.getMilliseconds(),
    );
  }

  return dateSerialization.serializeDate(
    date,
    UTC_FULL_DATE_FORMAT,
  ) as Date;
};

const createRecurrenceException = (
  appointmentAdapter: AppointmentAdapter,
  exceptionDate: Date,
): string => {
  const result: Date[] = [];

  if (appointmentAdapter.recurrenceException) {
    result.push(appointmentAdapter.recurrenceException);
  }

  result.push(
    getSerializedDate(
      exceptionDate,
      appointmentAdapter.startDate,
      appointmentAdapter.allDay,
    ),
  );

  return result.join();
};

export const excludeFromRecurrence = (
  appointment: Appointment,
  exceptionDate: Date,
  dataAccessors: DataAccessorType,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentAdapter => {
  const appointmentAdapter = createAppointmentAdapter(
    { ...appointment },
    dataAccessors,
    timeZoneCalculator,
  );

  appointmentAdapter.recurrenceException = createRecurrenceException(
    appointmentAdapter,
    exceptionDate,
  );

  return appointmentAdapter;
};
