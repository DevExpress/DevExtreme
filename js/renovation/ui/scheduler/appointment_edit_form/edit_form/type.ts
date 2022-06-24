/* eslint-disable @typescript-eslint/no-type-alias */
import { JSXTemplate } from '@devextreme-generator/declarations';
import { DescriptionEditorProps } from './editors/descriptionEditor';
import type { EndDateEditorProps } from './editors/endDateEditor';
import type { StartDateEditorProps } from './editors/startDateEditor';
import { SwitchEditorProps } from './editors/switchEditor';
import { TimeZoneEditorProps } from './editors/timeZoneEditor';

export type JSXStartDateEditorTemplate = JSXTemplate<StartDateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'dateChange'>;
export type JSXEndDateEditorTemplate = JSXTemplate<EndDateEditorProps, 'value' | 'firstDayOfWeek' | 'isAllDay' | 'dateChange'>;
export type JSXTimeZoneEditorTemplate = JSXTemplate<TimeZoneEditorProps, 'date' | 'value' | 'valueChange'>;
export type JSXSwitchEditorTemplate = JSXTemplate<SwitchEditorProps, 'value' | 'valueChange'>;
export type JSXDescriptionEditorTemplate = JSXTemplate<DescriptionEditorProps, 'value' | 'valueChange'>;
