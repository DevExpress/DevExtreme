import type { Appointment } from '@js/ui/scheduler';
import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { SafeAppointment } from '../../types';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';

const toMs = dateUtils.dateToMilliseconds;

export const replaceIncorrectEndDate = (
  rawAppointments: Appointment[] | undefined,
  appointmentMinDuration: number,
  dataAccessors: AppointmentDataAccessor,
): SafeAppointment[] => {
  if (!rawAppointments) {
    return [];
  }

  return rawAppointments.reduce<SafeAppointment[]>((result, rawAppointment) => {
    const startDate = dataAccessors.get('startDate', rawAppointment);
    const endDate = dataAccessors.get('endDate', rawAppointment);

    // NOTE: error E1032
    if (!dateUtilsTs.isValidDate(startDate)) {
      return result;
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

    result.push(rawAppointment as SafeAppointment);
    return result;
  }, []);
};
