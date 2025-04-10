import { isDefined } from '@js/core/utils/type';
import type { Appointment } from '@js/ui/scheduler';
import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import { createAppointmentAdapter } from '../../m_appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type { TimeZoneCalculator } from '../timezone_calculator';
import type { AppointmentDataItem, SafeAppointment } from '../types';

const RECURRENCE_FREQ = 'freq';
const toMs = dateUtils.dateToMilliseconds;

export const replaceIncorrectEndDate = (
  rawAppointment: Appointment,
  appointmentDuration: number,
  dataAccessors: AppointmentDataAccessor,
): rawAppointment is SafeAppointment => {
  const startDate = new Date(dataAccessors.get('startDate', rawAppointment));
  const endDate = new Date(dataAccessors.get('endDate', rawAppointment));

  if (!dateUtilsTs.isValidDate(startDate)) {
    return false;
  }

  const isEndDateIncorrect = !dateUtilsTs.isValidDate(endDate)
    || startDate.getTime() > endDate.getTime();

  if (isEndDateIncorrect) {
    const isAllDay = Boolean(dataAccessors.get('allDay', rawAppointment));
    const correctedEndDate = isAllDay
      ? dateUtils.setToDayEnd(new Date(startDate))
      : new Date(startDate.getTime() + appointmentDuration * toMs('minute'));

    // TODO(4): fixme. serializationFormat auto-detection will not the same as in startDate
    dataAccessors.set('endDate', rawAppointment, correctedEndDate);
  }

  return true;
};

export const getAppointmentDataItems = (
  dataItems: Appointment[] | undefined,
  dataAccessors: AppointmentDataAccessor,
  cellDurationInMinutes: number,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentDataItem[] => {
  const result: AppointmentDataItem[] = [];

  dataItems?.forEach((rawAppointment) => {
    const isAppointmentSafe = replaceIncorrectEndDate(
      rawAppointment,
      cellDurationInMinutes,
      dataAccessors,
    );

    if (!isAppointmentSafe) {
      return;
    }

    const adapter = createAppointmentAdapter(rawAppointment, dataAccessors, timeZoneCalculator);
    const regex = new RegExp(RECURRENCE_FREQ, 'gi');
    const { recurrenceRule } = adapter;
    const hasRecurrenceRule = Boolean(recurrenceRule?.match(regex)?.length);
    const visible = isDefined(rawAppointment.visible)
      ? Boolean(rawAppointment.visible)
      : true;

    result.push({
      allDay: Boolean(adapter.allDay),
      startDate: adapter.calculateStartDate('toGrid'),
      startDateTimeZone: rawAppointment.startDateTimeZone,
      endDate: adapter.calculateEndDate('toGrid'),
      endDateTimeZone: rawAppointment.endDateTimeZone,
      recurrenceRule,
      recurrenceException: adapter.recurrenceException,
      hasRecurrenceRule,
      visible,
      rawAppointment,
    });
  });

  return result;
};
