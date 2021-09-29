import { GroupOrientation } from '../types';
import { CellsMetaData, Group } from '../workspaces/types';

export interface AppointmentsConfigType {
  key: number;
  appointmentRenderingStrategyName: string;
  adaptivityEnabled: boolean;
  rtlEnabled?: boolean;
  maxAppointmentsPerCell: number | 'auto' | 'unlimited';
  isVirtualScrolling: boolean;
  leftVirtualCellCount: number;
  topVirtualCellCount: number;
  modelGroups: Group[];
  groupCount: number; // resource manager
  dateTableOffset: number; // 0 always
  groupOrientation: GroupOrientation;
  startViewDate?: Date;
  endViewDate?: Date;
  isGroupedByDate: boolean; // TODO isGroupedByDate in viewDataProvider
  cellWidth: number;
  cellHeight: number;
  allDayHeight: number;
  visibleDayDuration: number; // viewDataProvider.getVisibleDayDuration(...);
  timeZone: string;
  firstDayOfWeek: number;
  viewType: string;
  cellDuration: number;
  supportAllDayRow: boolean; // ?
  dateRange: Date[]; // ? -> viewDataProvider
  intervalDuration: number; // ?
  allDayIntervalDuration: number; // ?
  isVerticalGroupOrientation: boolean; // ?
  DOMMetaData: CellsMetaData;
}

export interface AppointmentsModelType extends AppointmentsConfigType {
  timeZoneCalculator: unknown;
  appointmentDataProvider: unknown;
  viewDataProvider: unknown;
  positionHelper: unknown;
  resizableStep: number; // positionHelper.getResizableStep()
}
