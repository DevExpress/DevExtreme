export type GroupOrientation = 'vertical' | 'horizontal';
export type ViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
export interface DataAccessorType {
  getter: unknown;
  setter: unknown;
  expr: unknown;
}

export interface BaseTemplateProps {
  index: number;
}
