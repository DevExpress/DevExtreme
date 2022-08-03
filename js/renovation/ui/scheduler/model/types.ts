import { ResourceProps } from '../props';
import { DataAccessorType, GroupOrientation, ViewType } from '../types';
import { CellsMetaData, Group } from '../workspaces/types';
import { IAllDayPanelBehavior } from '../appointment/allDayStrategy/types';

export interface AppointmentsConfigType {
  adaptivityEnabled: boolean;
  rtlEnabled?: boolean;
  startDayHour: number;
  viewStartDayHour: number;
  endDayHour: number;
  viewEndDayHour: number;
  currentDate: Date;
  resources: ResourceProps[];
  maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
  isVirtualScrolling: boolean;
  intervalCount: number;
  hoursInterval: number;
  loadedResources: Group[];
  groups: string[];
  groupByDate: boolean;
  appointmentCountPerCell: number;
  appointmentOffset: number;
  allowResizing: boolean;
  allowAllDayResizing: boolean;
  dateTableOffset: number;
  groupOrientation: GroupOrientation;
  startViewDate?: Date;
  timeZone: string;
  firstDayOfWeek: number;
  viewType: ViewType;
  cellDurationInMinutes: number;
  supportAllDayRow: boolean;
  isVerticalGroupOrientation: boolean;
  groupCount: number;
  dateRange: Date[]; // TODO replace with min / max
  allDayPanelBehavior: IAllDayPanelBehavior;
}

export interface AppointmentsModelType extends AppointmentsConfigType {
  appointmentRenderingStrategyName: string;
  loadedResources: Group[];
  dataAccessors: DataAccessorType;
  timeZoneCalculator: unknown;
  viewDataProvider: unknown;
  positionHelper: unknown;
  resizableStep: number;
  isGroupedAllDayPanel: boolean;
  rowCount: number;
  cellWidth: number;
  cellHeight: number;
  allDayHeight: number;
  isGroupedByDate: boolean;
  endViewDate: Date;
  visibleDayDuration: number;
  intervalDuration: number; // ?
  allDayIntervalDuration: number; // ?
  leftVirtualCellCount: number;
  topVirtualCellCount: number;
  cellDuration: number;
  DOMMetaData: CellsMetaData;
}
