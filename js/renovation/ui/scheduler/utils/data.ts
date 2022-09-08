import type { Appointment } from '../../../../ui/scheduler';
import { AppointmentDataItem, DataAccessorType, LoadDataType } from '../types';
import { getValidEndDate } from '../../../../ui/scheduler/appointments/dataProvider/utils';
import { createAppointmentAdapter } from '../../../../ui/scheduler/appointmentAdapter';
import { TimeZoneCalculator } from '../timeZoneCalculator/utils';
import { isDefined } from '../../../../core/utils/type';
import { convertUTCDate } from './date/convertUTCDate';

const RECURRENCE_FREQ = 'freq';

// TODO get rid of rawAppointment mutation
const patchDates = (
  rawAppointment: Appointment,
  dataAccessors: DataAccessorType,
  cellDurationInMinutes: number,
  datesInUTC: boolean,
): void => {
  let startDate = dataAccessors.getter.startDate(rawAppointment);

  if (startDate) {
    let endDate = dataAccessors.getter.endDate(rawAppointment);
    const allDay = dataAccessors.getter.allDay(rawAppointment);

    if (datesInUTC && allDay) {
      startDate = convertUTCDate(startDate, 'toLocal');
      endDate = convertUTCDate(endDate, 'toLocal');
      dataAccessors.setter.startDate(rawAppointment, startDate);
    }

    if (!endDate) {
      const isAllDay = dataAccessors.getter.allDay(rawAppointment);
      endDate = getValidEndDate(isAllDay, startDate, endDate, cellDurationInMinutes);
    }

    dataAccessors.setter.endDate(rawAppointment, endDate);
  }
};

export const getPreparedDataItems = (
  dataItems: Appointment[] | undefined,
  dataAccessors: DataAccessorType,
  cellDurationInMinutes: number,
  timeZoneCalculator: TimeZoneCalculator,
  datesInUTC: boolean,
): AppointmentDataItem[] => {
  const result: AppointmentDataItem[] = [];

  dataItems?.forEach((rawAppointment) => {
    patchDates(rawAppointment, dataAccessors, cellDurationInMinutes, datesInUTC);

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
