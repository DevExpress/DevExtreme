import type { AppointmentTemplateData } from '../../../../ui/scheduler';
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

export interface AppointmentViewModel {
  key: string;
  appointment: AppointmentData;
  geometry: AppointmentGeometry;
  info: {
    allDay: boolean;
    direction: Direction;
    isRecurrent: boolean;
    appointmentReduced?: ReduceType;
    appointment: {
      startDate: Date;
      endDate: Date;
    };
    sourceAppointment: {
      groupIndex: number;
    };
    dateText: string;
    resourceColor?: string;
  };
}

export interface OverflowIndicatorViewModel {
  key: string;
  isAllDay: boolean;
  isCompact: boolean;
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
  appointmentCount: number;
  isCompact: boolean;
}
