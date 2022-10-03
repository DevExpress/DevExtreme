export type DateType = Date | string;

export enum PathTimeZoneConversion {
  fromSourceToAppointment = 'toAppointment',
  fromAppointmentToSource = 'fromAppointment',
  fromSourceToGrid = 'toGrid',
  fromGridToSource = 'fromGrid',
}

export interface TimeZoneCalculatorOptions {
  getClientOffset: (date: Date) => number;
  tryGetCommonOffset: (date: Date, timeZone?: string) => number | undefined;
  tryGetAppointmentOffset: (
    date: Date,
    appointmentTimezone?: string,
  ) => number | undefined;
}

export interface TimeZoneOffsetsType {
  client: number;
  common: number;
  appointment: number;
}
