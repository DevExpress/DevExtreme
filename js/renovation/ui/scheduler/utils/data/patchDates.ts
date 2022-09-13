import { replaceWrongEndDate } from '../../../../../ui/scheduler/appointments/dataProvider/utils';
import { convertUTCDate } from '../date/convertUTCDate';
import type { Appointment } from '../../../../../ui/scheduler';
import { DataAccessorType } from '../../types';

// TODO get rid of rawAppointment mutation
const patchDates = (
  rawAppointment: Appointment,
  dataAccessors: DataAccessorType,
  cellDurationInMinutes: number,
  convertAllDayDatesToLocal: boolean,
): void => {
  const startDate = new Date(dataAccessors.getter.startDate(rawAppointment));

  if (startDate) {
    const endDate = new Date(dataAccessors.getter.endDate(rawAppointment));
    const allDay = dataAccessors.getter.allDay(rawAppointment);

    if (convertAllDayDatesToLocal && allDay) {
      const startDateInUtc = convertUTCDate(startDate, 'toUtc') as Date;
      const endDateInUtc = convertUTCDate(endDate, 'toUtc') as Date;
      dataAccessors.setter.startDate(rawAppointment, startDateInUtc);
      dataAccessors.setter.endDate(rawAppointment, endDateInUtc);
    }

    replaceWrongEndDate(rawAppointment, startDate, endDate, cellDurationInMinutes, dataAccessors);
  }
};

export default patchDates;
