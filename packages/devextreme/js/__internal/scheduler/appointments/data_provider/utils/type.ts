import type { AllDayPanelModeType } from '../../../types';
import type { ResourceLoader } from '../../../utils/loader/resource_loader';

export interface DateInterval {
  min: Date;
  max: Date;
}

export interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: Date;
  max: Date;
}

export interface FilterOptions {
  startDayHour: number;
  endDayHour: number;
  viewOffset: number;
  resources: ResourceLoader[];
  firstDayOfWeek: number;
  min: Date;
  max: Date;
  supportAllDayPanel?: boolean;
  allDayPanelMode: AllDayPanelModeType;
  visibleDateIntervals: DateInterval[];
  visibleTimeIntervals: DateInterval[];
}
