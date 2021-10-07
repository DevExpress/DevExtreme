export type GroupOrientation = 'vertical' | 'horizontal';
export type ViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

export interface DataAccessorType {
  getter: Record<string, (data: unknown) => Date | string>;
  setter: Record<string, (object: unknown, data: unknown) => Date | string>;
  expr: unknown;
}

export interface BaseTemplateProps {
  index: number;
}
