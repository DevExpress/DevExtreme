export interface AppointmentViewModel {
  appointment: {
    startDate: Date;
    endDate: Date;
    text: string;
  };

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
