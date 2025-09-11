export interface ProcessorOptions {
  start: Date;
  end?: Date;
  min: Date;
  max: Date;
  appointmentTimezoneOffset: number;
  rule?: string;
  exception?: string;
  firstDayOfWeek?: number;
  getExceptionDateTimezoneOffsets?: (date: Date) => number[];
}

export interface Rule {
  count?: number;
  interval: number;
  freq: string;
  until?: Date | null;
  // eslint-disable-next-line spellcheck/spell-checker
  bymonthday?: string;
  // eslint-disable-next-line spellcheck/spell-checker
  bymonth?: string;
  // eslint-disable-next-line spellcheck/spell-checker
  byday?: string;
}

export interface RRuleParams {
  startIntervalDate: Date;
  minViewTime: number;
  minViewDate: Date;
  maxViewDate: Date;
  startIntervalDateDSTShift: number;
  appointmentDuration: number;
}
