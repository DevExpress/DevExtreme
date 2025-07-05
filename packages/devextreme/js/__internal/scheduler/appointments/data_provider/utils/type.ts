export interface DateInterval {
  min: Date;
  max: Date;
}

export interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: Date;
  max: Date;
  isDateViewOnly: boolean;
}
