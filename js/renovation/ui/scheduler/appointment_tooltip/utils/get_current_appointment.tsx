import { AppointmentItem } from '../types.d';
/* eslint-disable-next-line import/named */
import { dxSchedulerAppointment } from '../../../../../ui/scheduler';

export default (appointmentItem: AppointmentItem): dxSchedulerAppointment => {
  const { settings, data, currentData } = appointmentItem;

  return (settings?.targetedAppointmentData ?? currentData) ?? data;
};
