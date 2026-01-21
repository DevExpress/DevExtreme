import type { FirstDayOfWeek } from '@js/common';
import type { NativeEventInfo } from '@js/common/core/events';
import type dxCalendar from '@js/ui/calendar';
import type { ValueChangedInfo } from '@js/ui/editor/editor';

import type { NormalizedView, SafeSchedulerOptions } from '../utils/options/types';

export interface HeaderOptions {
  currentView: NormalizedView;
  views: NormalizedView[];
  currentDate: Date;
  min?: Date;
  max?: Date;
  indicatorTime?: Date;
  startViewDate: Date;
  tabIndex?: number;
  focusStateEnabled?: boolean;
  useDropDownViewSwitcher: boolean;
  firstDayOfWeek?: FirstDayOfWeek;
  toolbar: SafeSchedulerOptions['toolbar'];
  onCurrentViewChange: (name: string) => void;
  onCurrentDateChange: (date: Date) => void;
  customizeDateNavigatorText: SafeSchedulerOptions['customizeDateNavigatorText'];
}

export type Step = 'day' | 'week' | 'workWeek' | 'month' | 'agenda';

export interface IntervalOptions {
  date: Date;
  step: Step;
  firstDayOfWeek?: number;
  intervalCount: number;
  agendaDuration?: number;
}

export interface SchedulerCalendarProperties {
  value: Date;
  min?: Date;
  max?: Date;
  firstDayOfWeek?: FirstDayOfWeek;
  focusStateEnabled?: boolean;
  tabIndex?: number;
  onValueChanged?: (e: (NativeEventInfo<dxCalendar> & ValueChangedInfo)) => void;
}

export type EventMapHandler = (value: unknown) => void;
