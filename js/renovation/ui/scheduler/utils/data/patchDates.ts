import { getValidEndDate } from '../../../../../ui/scheduler/appointments/dataProvider/utils';
import { convertUTCDate } from '../date/convertUTCDate';
import type { Appointment } from '../../../../../ui/scheduler';
import { DataAccessorType } from '../../types';

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

export default patchDates;
