import { ViewType } from '../../../../types';

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

export const TIMELINE_VIEWS: Partial<Record<ViewType, boolean>> = {
  timelineDay: true,
  timelineWeek: true,
  timelineWorkWeek: true,
  timelineMonth: true,
};
