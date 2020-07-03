import { dxSchedulerAppointment } from '../../../ui/scheduler';
import { dxPromise } from '../../../core/utils/deferred';

export type Color = string | undefined;
export type DeferredColor = dxPromise<Color>;

export type AppointmentItem = {
  data: dxSchedulerAppointment;
  currentData?: dxSchedulerAppointment;
  settings?: AppointmentItemSettings;
  color?: DeferredColor;
  disabled?: boolean;
};

export type AppointmentItemSettings = {
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
};

export type FormattedContent = {
  text: string;
  formatDate: string;
};

export type GetTextAndFormatDateFn = (
  appointment?: dxSchedulerAppointment, currentAppointment?: dxSchedulerAppointment,
) => FormattedContent;

export type GetSingleAppointmentFn = (
  appointment: dxSchedulerAppointment, target: HTMLElement,
) => dxSchedulerAppointment;

export type CheckAndDeleteAppointmentFn = (
  appointment: dxSchedulerAppointment, currentAppointment: dxSchedulerAppointment,
) => void;

export type ShowAppointmentPopupFn = (
  appointment: dxSchedulerAppointment, visibleButtons: boolean,
  currentAppointment: dxSchedulerAppointment,
) => void;
