export type SchedulerValidatorNames = 'startDayHour'
| 'endDayHour'
| 'startDayHourAndEndDayHour'
| 'offset'
| 'cellDuration'
| 'cellDurationAndVisibleInterval'
| 'views';

// This export just a workaround for SystemJS issue
//  with ts files that contains only type definitions.
export const REDUNDANT_EXPORT = undefined;
