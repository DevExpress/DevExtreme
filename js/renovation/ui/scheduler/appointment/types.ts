import type { AppointmentTemplateData } from '../../../../ui/scheduler';
import { BaseTemplateProps } from '../types';

export interface AppointmentGeometry {
  empty: boolean; // TODO
  left: number;
  top: number;
  width: number;
  height: number;
  leftVirtualWidth: number;
  topVirtualHeight: number;
}

export interface AppointmentViewModel {
  key: string;

  appointment: {
    startDate: Date;
    endDate: Date;
    text: string;
  };

  geometry: AppointmentGeometry;

  info: {
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

export interface AppointmentsViewModelType {
  regular: AppointmentViewModel[];
  allDay: AppointmentViewModel[];
}

export interface AppointmentTemplateProps extends BaseTemplateProps {
  data: AppointmentTemplateData;
}
