import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { AppointmentItemViewModel } from '../view_model/generate_view_model/types';
import type { GridAppointmentDates, ListEntity } from './types';

export const getAppointmentInfo = (
  item: ListEntity & GridAppointmentDates,
  timeZoneCalculator: TimeZoneCalculator,
): AppointmentItemViewModel['info'] => {
  const appointment = {
    allDay: item.allDay,
    startDate: new Date(item.gridAppointmentDates.startDate),
    endDate: new Date(item.gridAppointmentDates.endDate),
  };
  const source = {
    allDay: item.allDay,
    startDate: timeZoneCalculator.createDate(appointment.startDate, 'fromGrid'),
    endDate: timeZoneCalculator.createDate(appointment.endDate, 'fromGrid'),
  };

  return {
    appointment,
    sourceAppointment: source,
  };
};
