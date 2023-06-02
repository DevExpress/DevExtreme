import type { dxSchedulerAppointment } from '../../../../../ui/scheduler';

export interface IAppointmentFormData extends dxSchedulerAppointment {
  repeat: boolean;
}

export const createFormData = (
  appointment: dxSchedulerAppointment,
): IAppointmentFormData => ({
  ...appointment,
  repeat: !!appointment.recurrenceRule,
});
