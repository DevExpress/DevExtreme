export type DateType = Date | string | number;

export interface TimeZoneCalculatorOptions {
  timeZone?: string;
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

export type PathTimeZoneConversion = 'toAppointment' | 'fromAppointment' | 'toGrid' | 'fromGrid';
