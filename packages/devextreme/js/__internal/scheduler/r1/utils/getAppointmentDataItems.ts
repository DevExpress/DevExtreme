import { isDefined } from '@js/core/utils/type';
import type { Appointment } from '@js/ui/scheduler';
import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import { createAppointmentAdapter } from '../../m_appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type { TimeZoneCalculator } from '../timezone_calculator';
import type { AppointmentDataItem } from '../types';

const RECURRENCE_FREQ = 'freq';
const toMs = dateUtils.dateToMilliseconds;

export const replaceIncorrectEndDate = (
  rawAppointment: Appointment,
  startDate: Date,
  endDate: Date | undefined,
  appointmentDuration: number,
  dataAccessors: AppointmentDataAccessor,
): void => {
  const isEndDateIncorrect = !dateUtilsTs.isValidDate(endDate)
    || startDate.getTime() > endDate.getTime();

  if (isEndDateIncorrect) {
    const isAllDay = Boolean(dataAccessors.get('allDay', rawAppointment));
    const correctedEndDate = isAllDay
      ? dateUtils.setToDayEnd(new Date(startDate))
      : new Date(startDate.getTime() + appointmentDuration * toMs('minute'));

    dataAccessors.set('endDate', rawAppointment, correctedEndDate);
  }
};

export const getAppointmentDataItems = (
  dataItems: Appointment[] | undefined,
  dataAccessors: AppointmentDataAccessor,
  cellDurationInMinutes: number,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentDataItem[] => {
  const result: AppointmentDataItem[] = [];

  dataItems?.forEach((rawAppointment) => {
    const startDate = new Date(dataAccessors.get('startDate', rawAppointment));
    const endDate = new Date(dataAccessors.get('endDate', rawAppointment));

    replaceIncorrectEndDate(
      rawAppointment,
      startDate,
      endDate,
      cellDurationInMinutes,
      dataAccessors,
    );

    const adapter = createAppointmentAdapter(rawAppointment, dataAccessors, timeZoneCalculator);

    const gridStartDate = adapter.startDate && adapter.calculateStartDate('toGrid');
    const gridEndDate = adapter.endDate && adapter.calculateEndDate('toGrid');
    const regex = new RegExp(RECURRENCE_FREQ, 'gi');
    const { recurrenceRule } = adapter;
    const hasRecurrenceRule = Boolean(recurrenceRule?.match(regex)?.length);
    const visible = isDefined(rawAppointment.visible)
      ? Boolean(rawAppointment.visible)
      : true;

    if (gridStartDate && gridEndDate) {
      result.push({
        allDay: Boolean(adapter.allDay),
        startDate: gridStartDate,
        startDateTimeZone: rawAppointment.startDateTimeZone,
        endDate: gridEndDate,
        endDateTimeZone: rawAppointment.endDateTimeZone,
        recurrenceRule,
        recurrenceException: adapter.recurrenceException,
        hasRecurrenceRule,
        visible,
        rawAppointment,
      });
    }
  });

  return result;
};
