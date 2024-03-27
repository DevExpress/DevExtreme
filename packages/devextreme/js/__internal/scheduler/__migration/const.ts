import type { ViewType } from './types';

export const VERTICAL_GROUP_ORIENTATION = 'vertical';
export const HORIZONTAL_GROUP_ORIENTATION = 'horizontal';

export const TIMELINE_VIEWS: Partial<Record<ViewType, boolean>> = {
  timelineDay: true,
  timelineWeek: true,
  timelineWorkWeek: true,
  timelineMonth: true,
};

export const VIEW_TYPES = [
  'day', 'week', 'workWeek',
  'month', 'timelineDay', 'timelineWeek',
  'timelineWorkWeek', 'timelineMonth', 'agenda',
];
