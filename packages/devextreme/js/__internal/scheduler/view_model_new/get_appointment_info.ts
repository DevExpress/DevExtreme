import type { AppointmentItemViewModel } from '../view_model/generate_view_model/types';
import type { DatesBeforeSplit, ListEntity } from './types';

export const getAppointmentInfo = (
  item: ListEntity & DatesBeforeSplit,
): AppointmentItemViewModel['info'] => {
  const appointment = {
    allDay: item.allDay,
    startDate: new Date(item.datesBeforeSplit.startDate),
    endDate: new Date(item.datesBeforeSplit.endDate),
  };
  const source = {
    allDay: item.allDay,
    startDate: new Date(item.sourceDatesBeforeSplit.startDate),
    endDate: new Date(item.sourceDatesBeforeSplit.endDate),
  };

  return {
    appointment,
    sourceAppointment: source,
  };
};
