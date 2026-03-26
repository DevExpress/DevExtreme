import type { SnapToCellsMode } from '@js/ui/scheduler';

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
const getView = (
  type: ViewType,
  groupOrientation: View['groupOrientation'],
  snapToCellsMode: SnapToCellsMode,
  skippedDays: number[] = [],
): View => ({
  groupOrientation,
  intervalCount: 1,
  type,
  skippedDays,
  snapToCellsMode,
});

export const DEFAULT_VIEW_OPTIONS: Record<Exclude<ViewType, 'agenda'>, View> & {
  agenda: AgendaView;
} = {
  day: getView('day', 'horizontal', 'never'),
  week: getView('week', 'horizontal', 'never'),
  workWeek: getView('workWeek', 'horizontal', 'never', WEEKENDS),
  month: getView('month', 'horizontal', 'always'),
  timelineDay: getView('timelineDay', 'vertical', 'never'),
  timelineWeek: getView('timelineWeek', 'vertical', 'never'),
  timelineWorkWeek: getView('timelineWorkWeek', 'vertical', 'never', WEEKENDS),
  timelineMonth: getView('timelineMonth', 'vertical', 'always'),
  agenda: {
    agendaDuration: 7,
    intervalCount: 1,
    skippedDays: [],
    type: 'agenda',
  },
};
