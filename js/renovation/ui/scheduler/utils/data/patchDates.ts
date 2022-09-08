import { replaceWrongEndDate } from '../../../../../ui/scheduler/appointments/dataProvider/utils';
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
  let startDate = new Date(dataAccessors.getter.startDate(rawAppointment));

  if (startDate) {
    let endDate = new Date(dataAccessors.getter.endDate(rawAppointment));
    const allDay = dataAccessors.getter.allDay(rawAppointment);

    if (datesInUTC && allDay) {
      startDate = convertUTCDate(startDate, 'toLocal') as Date;
      endDate = convertUTCDate(endDate, 'toLocal') as Date;
      dataAccessors.setter.startDate(rawAppointment, startDate);
    }

    replaceWrongEndDate(rawAppointment, startDate, endDate, cellDurationInMinutes, dataAccessors);
  }
};

export default patchDates;
