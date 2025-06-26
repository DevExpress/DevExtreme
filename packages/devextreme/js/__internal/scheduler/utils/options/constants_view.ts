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
export const VIEW_TYPES = Object.values(VIEWS);
export const TIMELINE_VIEWS = [
  VIEWS.TIMELINE_DAY,
  VIEWS.TIMELINE_WEEK,
  VIEWS.TIMELINE_WORK_WEEK,
  VIEWS.TIMELINE_MONTH,
];

const getView = (name: ViewType, groupOrientation: View['groupOrientation']): View => ({
  groupOrientation,
  intervalCount: 1,
  maxAppointmentsPerCell: 'auto',
  name,
  type: name,
  allDayPanelMode: 'all',
});

export const DEFAULT_VIEW_OPTIONS: Record<Exclude<ViewType, 'agenda'>, View> & {
  agenda: AgendaView;
} = {
  day: getView('day', 'horizontal'),
  week: getView('week', 'horizontal'),
  workWeek: getView('workWeek', 'horizontal'),
  month: getView('month', 'horizontal'),
  timelineDay: getView('timelineDay', 'vertical'),
  timelineWeek: getView('timelineWeek', 'vertical'),
  timelineWorkWeek: getView('timelineWorkWeek', 'vertical'),
  timelineMonth: getView('timelineMonth', 'vertical'),
  agenda: {
    agendaDuration: 7,
    intervalCount: 1,
    name: 'agenda',
    type: 'agenda',
    allDayPanelMode: 'all',
  },
};
