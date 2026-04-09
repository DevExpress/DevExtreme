import type { FirstDayOfWeek } from '@js/common';
import type { ValueChangedEvent } from '@js/ui/calendar';

import type { NormalizedView, SafeSchedulerOptions } from '../utils/options/types';
import type { WeekdayIndex } from '../utils/skipped_days';

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
  _useShortDateFormat?: boolean;
}

export type Step = 'day' | 'week' | 'workWeek' | 'month' | 'agenda';

export interface IntervalOptions {
  date: Date;
  step: Step;
  firstDayOfWeek?: number;
  intervalCount: number;
  agendaDuration?: number;
  skippedDays: WeekdayIndex[];
}

export interface HeaderCalendarOptions {
  value: Date;
  min?: Date;
  max?: Date;
  firstDayOfWeek?: FirstDayOfWeek;
  focusStateEnabled?: boolean;
  tabIndex?: number;
  onValueChanged?: (e: ValueChangedEvent) => void;
}

export type EventMapHandler = (value: unknown) => void;
