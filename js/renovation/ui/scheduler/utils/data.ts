import type { Appointment } from '../../../../ui/scheduler';
import { DataAccessorType } from '../types';
import { replaceWrongEndDate } from '../../../../ui/scheduler/appointments/dataProvider/utils';
import { createAppointmentAdapter } from '../../../../ui/scheduler/appointmentAdapter';
import { TimeZoneCalculator } from '../timeZoneCalculator/utils';
import { isDefined } from '../../../../core/utils/type';

const RECURRENCE_FREQ = 'freq';

interface AppointmentDataItem {
  startDate: Date;
  endDate: Date;
  recurrenceRule: string;
  recurrenceException: string;
  hasRecurrenceRule: boolean;
  allDay: boolean;
  visible: boolean;
  rawAppointment: Appointment;
}

const getPreparedDataItems = (
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
        endDate: comparableEndDate,
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

export default getPreparedDataItems;
