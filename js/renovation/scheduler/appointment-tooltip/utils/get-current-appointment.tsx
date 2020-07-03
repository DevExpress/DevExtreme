import { AppointmentItem } from '../types';
import { dxSchedulerAppointment } from '../../../../ui/scheduler';

export default (appointmentItem: AppointmentItem): dxSchedulerAppointment => {
  const { settings, data, currentData } = appointmentItem!;

  return settings?.targetedAppointmentData || currentData || data;
};
