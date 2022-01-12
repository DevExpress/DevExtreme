import type { AppointmentCollectorTemplateData, AppointmentTemplateData } from '../../../../ui/scheduler';
import { BaseTemplateProps, Direction } from '../types';

export type ReduceType = 'head' | 'body' | 'tail';

export interface AppointmentGeometry {
  empty: boolean; // TODO
  left: number;
  top: number;
  width: number;
  height: number;
  leftVirtualWidth: number;
  topVirtualHeight: number;
}

export interface AppointmentData {
  startDate: Date;
  endDate: Date;
  text: string;
}

export interface AppointmentInfo {
  allDay: boolean;
  direction: Direction;
  isRecurrent: boolean;
  appointmentReduced?: ReduceType;
  groupIndex: number;
  appointment: {
    startDate: Date;
    endDate: Date;
  };
  sourceAppointment: {
    groupIndex: number;
  };
  dateText: string;
}

export interface AppointmentViewModel {
  key: string;
  appointment: AppointmentData;
  geometry: AppointmentGeometry;
  info: AppointmentInfo;
}

export interface OverflowIndicatorViewModel {
  key: string;
  isAllDay: boolean;
  isCompact: boolean;
  groupIndex: number;
  geometry: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  items: {
    colors: string[];
    data: AppointmentData[];
    settings: AppointmentViewModel[];
  };
}

export interface AppointmentsViewModelType {
  allDay: AppointmentViewModel[];
  allDayCompact: OverflowIndicatorViewModel[];
  regular: AppointmentViewModel[];
  regularCompact: OverflowIndicatorViewModel[];
}

export interface AppointmentTemplateProps extends BaseTemplateProps {
  data: AppointmentTemplateData;
}

export interface OverflowIndicatorTemplateProps extends BaseTemplateProps {
  data: AppointmentCollectorTemplateData;
}

export interface AppointmentClickData {
  data: AppointmentViewModel[];
  target: HTMLElement;
  index: number;
}

export interface ReducedIconHoverData {
  target: HTMLDivElement;
  endDate?: Date | string;
}
