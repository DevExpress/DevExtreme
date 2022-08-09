export type DateType = Date | string;

export enum PathTimeZoneConversion {
  fromSourceToAppointment = 'toAppointment',
  fromAppointmentToSource = 'fromAppointment',
  fromSourceToGrid = 'toGrid',
  fromGridToSource = 'fromGrid',
}

export interface TimeZoneCalculatorOptions {
  timeZone: string | undefined;
  getClientOffset: (date: Date) => number;
  getCommonOffset: (date: Date, timeZone?: string) => number;
  getAppointmentOffset: (
    date: Date,
    appointmentTimezone?: string,
  ) => number;
}

export interface TimeZoneOffsetsType {
  client: number;
  common: number;
  appointment: number;
}
