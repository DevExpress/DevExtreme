import { dxSchedulerAppointment } from '../../../ui/scheduler';

export type Color = string | undefined;
export type DeferredColor = Promise<Color> & JQueryPromise<Color>;

export type AppointmentItem = {
  data: dxSchedulerAppointment;
  currentData?: dxSchedulerAppointment;
  settings?: AppointmentItemSettings;
  color?: DeferredColor;
};
export type AppointmentItemSettings = {
  targetedAppointmentData?: dxSchedulerAppointment;
};
export type FormattedContent = {
  text: string;
  formatDate: string;
};
