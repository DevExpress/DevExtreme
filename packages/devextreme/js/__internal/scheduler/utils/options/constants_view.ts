import messageLocalization from '@js/common/core/localization/message';
import { camelize } from '@ts/core/utils/m_inflector';

import type { AgendaView, View, ViewType } from './types';

export const VIEWS: Record<string, ViewType> = {
  DAY: 'day',
  WEEK: 'week',
  WORK_WEEK: 'workWeek',
  MONTH: 'month',
  TIMELINE_DAY: 'timelineDay',
  TIMELINE_WEEK: 'timelineWeek',
  TIMELINE_WORK_WEEK: 'timelineWorkWeek',
  TIMELINE_MONTH: 'timelineMonth',
  AGENDA: 'agenda',
};
export const VIEW_TYPES: ViewType[] = Object.values(VIEWS);

const WEEKENDS = [0, 6];
const getName = (type: ViewType): string => messageLocalization.format(`dxScheduler-switcher${camelize(type, true)}`);
const getView = (
  type: ViewType,
  groupOrientation: View['groupOrientation'],
  skippedDays: number[] = [],
): View => ({
  groupOrientation,
  intervalCount: 1,
  name: getName(type),
  type,
  skippedDays,
});

export const DEFAULT_VIEW_OPTIONS: Record<Exclude<ViewType, 'agenda'>, View> & {
  agenda: AgendaView;
} = {
  day: getView('day', 'horizontal'),
  week: getView('week', 'horizontal'),
  workWeek: getView('workWeek', 'horizontal', WEEKENDS),
  month: getView('month', 'horizontal'),
  timelineDay: getView('timelineDay', 'vertical'),
  timelineWeek: getView('timelineWeek', 'vertical'),
  timelineWorkWeek: getView('timelineWorkWeek', 'vertical'),
  timelineMonth: getView('timelineMonth', 'vertical'),
  agenda: {
    agendaDuration: 7,
    intervalCount: 1,
    skippedDays: [],
    name: getName('agenda'),
    type: 'agenda',
  },
};
