import { isDefined } from '@js/core/utils/type';
import type { Appointment } from '@js/ui/scheduler';
import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { TimeZoneCalculator } from '../../r1/timezone_calculator';
import type { AppointmentDataItem, SafeAppointment } from '../../types';
import { AppointmentAdapter } from '../../utils/appointment_adapter/appointment_adapter';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';

const toMs = dateUtils.dateToMilliseconds;

export const replaceIncorrectEndDate = (
  rawAppointment: Appointment,
  appointmentMinDuration: number,
  dataAccessors: AppointmentDataAccessor,
): rawAppointment is SafeAppointment => {
  const startDate = dataAccessors.get('startDate', rawAppointment);
  const endDate = dataAccessors.get('endDate', rawAppointment);

  // NOTE: error E1032
  if (!dateUtilsTs.isValidDate(startDate)) {
    return false;
  }

  const isEndDateIncorrect = !dateUtilsTs.isValidDate(endDate)
    || startDate.getTime() > endDate.getTime();

  if (isEndDateIncorrect) {
    const isAllDay = dataAccessors.get('allDay', rawAppointment);
    const correctedEndDate = isAllDay
      ? dateUtils.setToDayEnd(new Date(startDate))
      : new Date(startDate.getTime() + appointmentMinDuration * toMs('minute'));

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

    const adapter = new AppointmentAdapter(rawAppointment, dataAccessors);
    const { startDate, endDate } = adapter.getCalculatedDates(timeZoneCalculator, 'toGrid');
    const { recurrenceRule } = adapter;
    const hasRecurrenceRule = adapter.isRecurrent;
    const visible = isDefined(rawAppointment.visible)
      ? Boolean(rawAppointment.visible)
      : true;

    result.push({
      allDay: Boolean(adapter.allDay),
      startDate,
      startDateTimeZone: rawAppointment.startDateTimeZone,
      endDate,
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
