import type { Properties } from '@js/ui/scheduler';

export type SchedulerOptions = Required<Properties>;

export type SchedulerValidatorNames = 'startDayHour'
| 'endDayHour'
| 'startDayHourAndEndDayHour'
| 'offset'
| 'cellDuration'
| 'cellDurationAndVisibleInterval';

// TODO: This export just a workaround for SystemJS issue
//  with ts files that contains only type definitions.
export const REDUNDANT_EXPORT = undefined;
