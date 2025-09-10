import { isDefined } from '@js/core/utils/type';

import type { TimeZoneCalculator } from '../../../r1/timezone_calculator';
import type { SafeAppointment } from '../../../types';
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
  const rawStartDate = dataAccessors.get('startDate', rawAppointment);
  const rawEndDate = dataAccessors.get('endDate', rawAppointment);
  const startDate = timeZoneCalculator.createDate(rawStartDate, 'toGrid');
  const endDate = timeZoneCalculator.createDate(rawEndDate, 'toGrid');
  const startDateMs = startDate.getTime();
  const endDateMs = endDate.getTime();

  const rawVisible = dataAccessors.get('visible', rawAppointment);
  const visible = isDefined(rawVisible) ? Boolean(rawVisible) : true;

  return {
    allDay: dataAccessors.get('allDay', rawAppointment),
    startDate: startDateMs,
    startDateTimeZone: dataAccessors.get('startDateTimeZone', rawAppointment),
    endDate: endDateMs,
    endDateTimeZone: dataAccessors.get('endDateTimeZone', rawAppointment),
    recurrenceRule: dataAccessors.get('recurrenceRule', rawAppointment),
    recurrenceException: dataAccessors.get('recurrenceException', rawAppointment),
    hasRecurrenceRule: dataAccessors.isRecurrent(rawAppointment),
    visible,
    disabled: dataAccessors.get('disabled', rawAppointment),
    itemData: rawAppointment,
  };
});
