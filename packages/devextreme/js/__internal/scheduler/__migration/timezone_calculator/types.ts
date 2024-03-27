export type DateType = Date | string;

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
