/* eslint-disable @typescript-eslint/no-type-alias */
import { JSXTemplate } from '@devextreme-generator/declarations';
import type { EndDateEditorProps } from './editors/endDateEditor';
import type { StartDateEditorProps } from './editors/startDateEditor';
import { TimeZoneEditorProps } from './editors/timeZoneEditor';

export interface IDateBoxEditorConfig {
  width: string | number;
  calendarOptions: { firstDayOfWeek?: number };
  type: string;
  useMaskBehavior: boolean;
}

export type JSXStartDateEditorTemplate = JSXTemplate<StartDateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'dateChange'>;
export type JSXEndDateEditorTemplate = JSXTemplate<EndDateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'dateChange'>;
export type JSXTimeZoneEditorTemplate = JSXTemplate<TimeZoneEditorProps, 'date' | 'value' | 'valueChange'>;
