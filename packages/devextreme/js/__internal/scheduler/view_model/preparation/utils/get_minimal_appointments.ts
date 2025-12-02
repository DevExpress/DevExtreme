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
  { dataAccessors }: Options,
): MinimalAppointmentEntity[] => safeItems.map((rawAppointment) => {
  const startDateMs = dataAccessors.get('startDate', rawAppointment).getTime();
  const startDateTimeZone = dataAccessors.get('startDateTimeZone', rawAppointment);

  const endDateMs = dataAccessors.get('endDate', rawAppointment).getTime();
  const endDateTimeZone = dataAccessors.get('endDateTimeZone', rawAppointment);

  const rawVisible = dataAccessors.get('visible', rawAppointment);
  const visible = isDefined(rawVisible) ? Boolean(rawVisible) : true;

  return {
    allDay: dataAccessors.get('allDay', rawAppointment),
    startDateTimeZone,
    endDateTimeZone,
    source: {
      startDate: startDateMs,
      endDate: endDateMs,
    },
    recurrenceRule: dataAccessors.get('recurrenceRule', rawAppointment),
    recurrenceException: dataAccessors.get('recurrenceException', rawAppointment),
    hasRecurrenceRule: dataAccessors.isRecurrent(rawAppointment),
    visible,
    disabled: dataAccessors.get('disabled', rawAppointment),
    itemData: rawAppointment,
  };
});
