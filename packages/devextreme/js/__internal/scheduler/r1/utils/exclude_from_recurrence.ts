import dateSerialization from '@js/core/utils/date_serialization';
import type { Appointment } from '@js/ui/scheduler';

import { AppointmentAdapter } from '../../entities/appointment/adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../entities/data-source/data-accessor/appointment_data_accessor';

const FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
const UTC_FULL_DATE_FORMAT = `${FULL_DATE_FORMAT}Z`;

const getSerializedDate = (
  date: Date,
  startDate: Date,
  isAllDay: boolean,
): string => {
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
  ) as string;
};

const createRecurrenceException = (
  appointmentAdapter: AppointmentAdapter,
  exceptionDate: Date,
): string => {
  const result: string[] = [];

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
  dataAccessors: AppointmentDataAccessor,
): AppointmentAdapter => {
  const appointmentAdapter = new AppointmentAdapter(
    { ...appointment },
    dataAccessors,
  );

  appointmentAdapter.recurrenceException = createRecurrenceException(
    appointmentAdapter,
    exceptionDate,
  );

  return appointmentAdapter;
};
