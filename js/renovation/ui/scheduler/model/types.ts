import { ResourceProps } from '../props';
import { AppointmentColorConfigType } from '../resources/utils';
import { DataAccessorType, GroupOrientation, ViewType } from '../types';
import { CellsMetaData, Group } from '../workspaces/types';

export interface AppointmentsConfigType {
  adaptivityEnabled: boolean;
  rtlEnabled?: boolean;
  startDayHour: number;
  viewStartDayHour: number;
  endDayHour: number;
  viewEndDayHour: number;
  currentDate: Date;
  resources: ResourceProps[];
  maxAppointmentsPerCell: number | 'auto' | 'unlimited';
  isVirtualScrolling: boolean;
  intervalCount: number;
  hoursInterval: number;
  showAllDayPanel: boolean;
  loadedResources: Group[];
  modelGroups: string[];
  groupByDate: boolean;
  appointmentCountPerCell: number;
  appointmentOffset: number;
  allowResizing: boolean;
  allowAllDayResizing: boolean;
  dateTableOffset: number; // 0 always
  groupOrientation: GroupOrientation;
  startViewDate?: Date;
  timeZone: string;
  firstDayOfWeek: number;
  viewType: ViewType;
  cellDurationInMinutes: number;
  supportAllDayRow: boolean; // ?
  isVerticalGroupOrientation: boolean; // ?
  groupCount: number; // resource manager
  dateRange: Date[]; // ? -> viewDataProvider
}

export interface AppointmentsModelType extends AppointmentsConfigType {
  appointmentRenderingStrategyName: string;
  loadedResources: [];
  dataAccessors: DataAccessorType;
  timeZoneCalculator: unknown;
  viewDataProvider: unknown;
  positionHelper: unknown;
  resizableStep: number; // positionHelper.getResizableStep()
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
  getAppointmentColor: (config: AppointmentColorConfigType) => Promise<string>;
  DOMMetaData: CellsMetaData;
}
