import dateUtils from '@js/core/utils/date';

import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';

// TODO: wrong place for these functions - move it to root utils

export const getAppointmentTakesSeveralDays = (dates: {
  startDate: Date;
  endDate: Date;
}) => !dateUtils.sameDate(dates.startDate, dates.endDate);

export const sortAppointmentsByStartDate = (
  appointments,
  dataAccessors: AppointmentDataAccessor,
) => {
  appointments.sort((a, b) => {
    const firstDate = dataAccessors.get('startDate', a.settings || a);
    const secondDate = dataAccessors.get('startDate', b.settings || b);

    return Math.sign(firstDate.getTime() - secondDate.getTime());
  });
};
