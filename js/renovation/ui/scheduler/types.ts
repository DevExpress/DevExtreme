import type { DxPromise } from '../../../core/utils/deferred';

export type Direction = 'vertical' | 'horizontal';
export type GroupOrientation = 'vertical' | 'horizontal';
export type ViewType = 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';

export interface DataAccessorType {
  getter: Record<string, (data: unknown) => Date | string>;
  setter: Record<string, (object: unknown, data: unknown) => Date | string>;
  expr: Record<string, string>;
  resources?: DataAccessorType;
}

export interface BaseTemplateProps {
  index: number;
}

export interface DataSourcePromise extends DxPromise {
  done: (items: unknown) => void;
}
