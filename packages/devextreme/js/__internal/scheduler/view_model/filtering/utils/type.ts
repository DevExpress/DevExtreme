import type { AllDayPanelModeType, AppointmentDataItem } from '../../../types';
import type { ResourceLoader } from '../../../utils/loader/resource_loader';

export interface DateInterval {
  min: number;
  max: number;
}

export interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: number;
  max: number;
}

export interface FilterOptions {
  startDayHour: number;
  endDayHour: number;
  viewOffset: number;
  resources: ResourceLoader[];
  firstDayOfWeek: number;
  min: number;
  max: number;
  allDayPanelFilter?: boolean;
  allDayPanelMode: AllDayPanelModeType;
  supportAllDayRow: boolean;
  visibleDateIntervals: DateInterval[];
  visibleTimeIntervals: DateInterval[];
}

export type CombinedFilter<T = AppointmentDataItem> = ((appointment: T) => boolean)[][];
