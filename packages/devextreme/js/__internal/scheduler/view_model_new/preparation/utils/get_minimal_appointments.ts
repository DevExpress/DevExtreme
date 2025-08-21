import { isDefined } from '@js/core/utils/type';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator';
import type { SafeAppointment } from '../../../types';
import { AppointmentAdapter } from '../../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../../utils/data_accessor/appointment_data_accessor';
import type { MinimalAppointmentEntity } from '../../types';

interface Options {
  dataAccessors: AppointmentDataAccessor;
  timeZoneCalculator: TimeZoneCalculator;
}

export const getMinimalAppointments = (
  safeItems: SafeAppointment[],
  { dataAccessors, timeZoneCalculator }: Options,
): MinimalAppointmentEntity[] => safeItems.map((rawAppointment) => {
  const adapter = new AppointmentAdapter(rawAppointment, dataAccessors);
  const { startDate, endDate } = adapter.getCalculatedDates(timeZoneCalculator, 'toGrid');
  const rawVisible = dataAccessors.get('visible', rawAppointment);
  const visible = isDefined(rawVisible) ? Boolean(rawVisible) : true;
  const startDateMs = startDate.getTime();
  const endDateMs = endDate.getTime();

  return {
    allDay: adapter.allDay,
    startDate: startDateMs,
    startDateTimeZone: adapter.startDateTimeZone,
    endDate: endDateMs,
    endDateTimeZone: adapter.endDateTimeZone,
    recurrenceRule: adapter.recurrenceRule,
    recurrenceException: adapter.recurrenceException,
    hasRecurrenceRule: adapter.isRecurrent,
    visible,
    disabled: adapter.disabled,
    itemData: rawAppointment,
  };
});
