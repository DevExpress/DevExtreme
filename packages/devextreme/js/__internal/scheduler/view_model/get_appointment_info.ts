import timeZoneUtils from '../utils_time_zone';
import type {
  AppointmentAgendaViewModel,
  AppointmentItemViewModel,
  ListEntity,
  UTCDatesAfterSplit,
} from './types';

export const getAppointmentInfo = (
  item: ListEntity,
): AppointmentItemViewModel['info'] => {
  const appointment = {
    allDay: item.allDay,
    startDate: timeZoneUtils.createDateFromUTCWithLocalOffset(
      new Date(item.datesBeforeSplit.startDateUTC),
    ),
    endDate: timeZoneUtils.createDateFromUTCWithLocalOffset(
      new Date(item.datesBeforeSplit.endDateUTC),
    ),
  };
  const source = {
    allDay: item.allDay,
    startDate: new Date(item.source.startDate),
    endDate: new Date(item.source.endDate),
  };

  return {
    appointment,
    sourceAppointment: source,
  };
};

export const getAgendaAppointmentInfo = (
  item: ListEntity & UTCDatesAfterSplit,
): AppointmentAgendaViewModel['info'] => ({
  ...getAppointmentInfo(item),
  partialDates: {
    allDay: item.allDay,
    startDate: timeZoneUtils.createDateFromUTCWithLocalOffset(
      new Date(item.datesAfterSplit.startDateUTC),
    ),
    endDate: timeZoneUtils.createDateFromUTCWithLocalOffset(
      new Date(item.datesAfterSplit.endDateUTC),
    ),
  },
});
