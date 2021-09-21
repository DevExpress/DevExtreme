export type GroupOrientation = 'vertical' | 'horizontal';
export type ViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

export interface DataAccessorType {
  getter: Record<string, (data: unknown) => unknown>;
  setter: unknown;
  expr: unknown;
}

export interface BaseTemplateProps {
  index: number;
}
