import dateSerialization from '@js/core/utils/date_serialization';
import type { Appointment } from '@js/ui/scheduler';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils';

import type AppointmentAdapter from '../../m_appointment_adapter';
import { createAppointmentAdapter } from '../../m_appointment_adapter';
import type { TimeZoneCalculator } from '../timezone_calculator';

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
    result.push(new Date(appointmentAdapter.recurrenceException));
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
  dataAccessors: AppointmentDataAccessor,
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
