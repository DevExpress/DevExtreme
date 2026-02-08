import type { AppointmentDataItem, SafeAppointment } from '../../../types';

export const getRawAppointments = (
  items: AppointmentDataItem[],
): SafeAppointment[] => items.map(({ rawAppointment }) => rawAppointment);
