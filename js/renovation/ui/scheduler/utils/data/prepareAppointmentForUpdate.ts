import { extend } from '../../../../../core/utils/extend';
import { Appointment } from '../../appointment/appointment';
import { DataAccessorType } from '../../types';
import getAllDayAppointmentDateRange from '../date/getAllDayAppointmentDateRange';

const prepareAppointmentForUpdate = (
  appointment: Appointment,
  dataAccessors: DataAccessorType,
  datesInUTC: boolean,
): Appointment => {
  const preparedAppointment = extend({}, appointment) as Appointment;

  const allDay = dataAccessors.getter.allDay(appointment);

  if (allDay) {
    const startDate = new Date(dataAccessors.getter.startDate(appointment));
    const endDate = new Date(dataAccessors.getter.endDate(appointment));
    const dateRange = getAllDayAppointmentDateRange(
      startDate,
      endDate,
      datesInUTC,
      'toLocal',
    );

    dataAccessors.setter.startDate(preparedAppointment, dateRange.startDate);
    dataAccessors.setter.endDate(preparedAppointment, dateRange.endDate);
  }

  return preparedAppointment;
};

export default prepareAppointmentForUpdate;
