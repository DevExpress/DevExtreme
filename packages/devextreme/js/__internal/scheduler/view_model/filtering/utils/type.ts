import type { AllDayPanelModeType, AppointmentDataItem } from '../../../types';
import type { ResourceLoader } from '../../../utils/loader/resource_loader';
import type { DateInterval } from '../../../view_model_new/types';

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
