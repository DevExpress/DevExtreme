import { isDefined } from '@js/core/utils/type';
import type { Appointment } from '@js/ui/scheduler';

import { replaceWrongEndDate } from '../../appointments/data_provider/m_utils';
import { createAppointmentAdapter } from '../../m_appointment_adapter';
import type { TimeZoneCalculator } from '../timezone_calculator';
import type { AppointmentDataItem, DataAccessorType, LoadDataType } from '../types';

const RECURRENCE_FREQ = 'freq';

export const getPreparedDataItems = (
  dataItems: Appointment[] | undefined,
  dataAccessors: DataAccessorType,
  cellDurationInMinutes: number,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentDataItem[] => {
  const result: AppointmentDataItem[] = [];

  dataItems?.forEach((rawAppointment) => {
    const startDate = new Date(dataAccessors.getter.startDate(rawAppointment));
    const endDate = new Date(dataAccessors.getter.endDate(rawAppointment));

    replaceWrongEndDate(rawAppointment, startDate, endDate, cellDurationInMinutes, dataAccessors);

    const adapter = createAppointmentAdapter(rawAppointment, dataAccessors, timeZoneCalculator);

    const comparableStartDate = adapter.startDate && adapter.calculateStartDate('toGrid');
    const comparableEndDate = adapter.endDate && adapter.calculateEndDate('toGrid');
    const regex = new RegExp(RECURRENCE_FREQ, 'gi');
    const recurrenceRule = adapter.recurrenceRule as string;
    const hasRecurrenceRule = !!recurrenceRule?.match(regex)?.length;
    const visible = isDefined(rawAppointment.visible)
      ? !!rawAppointment.visible
      : true;

    if (comparableStartDate && comparableEndDate) {
      result.push({
        allDay: !!adapter.allDay,
        startDate: comparableStartDate,
        startDateTimeZone: rawAppointment.startDateTimeZone,
        endDate: comparableEndDate,
        endDateTimeZone: rawAppointment.endDateTimeZone,
        recurrenceRule: adapter.recurrenceRule,
        recurrenceException: adapter.recurrenceException,
        hasRecurrenceRule,
        visible,
        rawAppointment,
      });
    }
  });

  return result;
};

export const resolveDataItems = (options: LoadDataType): Appointment[] => (
  Array.isArray(options)
    ? options
    : options.data
);
