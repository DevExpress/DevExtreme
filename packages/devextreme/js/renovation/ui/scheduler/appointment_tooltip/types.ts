// https://github.com/benmosher/eslint-plugin-import/issues/1699
// eslint-disable-next-line import/named
import { dxSchedulerAppointment } from '../../../../ui/scheduler';

export type Color = string | undefined;

export interface AppointmentItem {
  data: dxSchedulerAppointment;
  currentData?: dxSchedulerAppointment;
  settings?: AppointmentItemSettings;
  color?: Promise<Color>;
  disabled?: boolean;
}

export interface AppointmentItemSettings {
  targetedAppointmentData?: dxSchedulerAppointment;
  originalAppointmentStartDate?: Date;
  originalAppointmentEndDate?: Date;
  startDate?: Date;
  endDate?: Date;
  direction?: 'vertical' | 'horizontal';
  allDay?: boolean;
  isCompact?: boolean;
  virtual?: boolean;
  groupIndex?: number;
  appointmentReduced?: boolean;
  sortedIndex?: number;
}

export interface FormattedContent {
  text: string;
  formatDate: string;
}

export type GetTextAndFormatDateFn = (
  appointment?: dxSchedulerAppointment, currentAppointment?: dxSchedulerAppointment,
) => FormattedContent;

export type GetSingleAppointmentFn = (
  appointment: dxSchedulerAppointment, target?: HTMLElement,
) => dxSchedulerAppointment;

export type CheckAndDeleteAppointmentFn = (
  appointment: dxSchedulerAppointment, currentAppointment: dxSchedulerAppointment,
) => void;

export type ShowAppointmentPopupFn = (
  appointment: dxSchedulerAppointment, visibleButtons: boolean,
  currentAppointment: dxSchedulerAppointment,
) => void;

export interface AppointmentTooltipTemplate {
  model: {
    appointmentData: dxSchedulerAppointment;
    targetedAppointmentData: dxSchedulerAppointment;
  };
  index: number;
}
