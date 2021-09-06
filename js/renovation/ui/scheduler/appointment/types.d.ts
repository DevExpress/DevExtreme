import { BaseTemplateProps } from '../types';

interface AppointmentData {
  startDate: Date;
  endDate: Date;
}

interface TargetAppointmentData extends AppointmentData {
  text: string;
}

export interface AppointmentViewModel {
  appointment: TargetAppointmentData;

  geometry: {
    empty: boolean; // TODO
    left: number;
    top: number;
    width: number;
    height: number;
    leftVirtualWidth: number;
    topVirtualHeight: number;
  };

  info: {
    appointment: AppointmentData;

    sourceAppointment: {
      groupIndex: number;
    };
    dateText: string;
    resourceColor?: string;
  };
}

export interface AppointmentInfo {
  appointmentData: AppointmentData;
  targetedAppointmentData: TargetAppointmentData;
}

export interface AppointmentTemplateProps extends BaseTemplateProps {
  data: AppointmentInfo;
}
