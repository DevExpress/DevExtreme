import type { Orientation } from '@js/common';

import type { AllDayPanelModeType, SafeAppointment } from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { GroupLeaf } from '../utils/resource_manager/types';
import type {
  Empty,
  Geometry,
  RealSize,
} from './generate_view_model/steps/add_geometry/types';

export type PanelName = 'allDayPanel' | 'regularPanel';

export interface Position {
  cellIndex: number;
  endCellIndex: number;
  rowIndex: number;
  columnIndex: number;
}
export interface DateInterval {
  min: number;
  max: number;
}
export interface CellInterval extends DateInterval, Omit<Position, 'endCellIndex'> {}

export interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: number;
  max: number;
  skippedDays: number[];
}

export interface LayoutIntervals {
  intervals: DateInterval[];
  dayIntervals: DateInterval[];
  cells: CellInterval[];
}

export interface FilterOptions {
  allDayPanelMode: AllDayPanelModeType;
  showAllDayPanel: boolean;
  supportAllDayPanel: boolean;
  isDateTimeView: boolean;
  resourceManager: ResourceManager;
  timeZone: string;
  dataAccessor: AppointmentDataAccessor;
  firstDayOfWeek?: number;
  allDayIntervals: DateInterval[];
  regularIntervals: DateInterval[];
}

export interface SortedIndex {
  sortedIndex: number;
}

export interface GroupIndex {
  groupIndex: GroupLeaf['groupIndex'];
}

export interface AllDayPanelOccupation {
  isAllDayPanelOccupied: boolean;
}

export interface MinimalAppointmentEntity {
  startDateTimeZone?: string;
  endDateTimeZone?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
  hasRecurrenceRule: boolean;
  allDay: boolean;
  visible: boolean;
  disabled: boolean;
  itemData: SafeAppointment;
  source: {
    startDate: number;
    endDate: number;
  };
}

export interface Duration {
  duration: number;
}

export interface AppointmentPart {
  reduced?: 'head' | 'body' | 'tail';
  partIndex: number;
  partCount: number;
}

export interface UTCDates {
  startDateUTC: number;
  endDateUTC: number;
}

export interface UTCDatesBeforeSplit {
  datesBeforeSplit: UTCDates;
}

export interface UTCDatesAfterSplit {
  datesAfterSplit: UTCDates;
}

export type ListEntity = MinimalAppointmentEntity
  & UTCDates
  & UTCDatesBeforeSplit
  & AllDayPanelOccupation
  & GroupIndex
  & Duration;

export interface LastInGroup {
  isLastInGroup: boolean;
}

export interface AgendaGeometry {
  width: string;
  height: number;
}

export type AgendaEntity = ListEntity
  & UTCDatesAfterSplit
  & AppointmentPart
  & AgendaGeometry
  & LastInGroup
  & SortedIndex;

export interface Level {
  level: number;
  maxLevel: number;
  inStackWithCollector: boolean;
}

export type CollectorItemEntity = ListEntity
  & UTCDatesBeforeSplit
  & RealSize;

export interface AppointmentCollector {
  items: (ListEntity & UTCDatesBeforeSplit)[];
  isCompact: boolean;
}

export interface AppointmentCollectorWithGeometry {
  items: CollectorItemEntity[];
  isCompact: boolean;
}

export interface Direction {
  direction: Orientation;
}

export type SortedEntity = ListEntity
  & AppointmentPart
  & Position
  & Level
  & AppointmentCollector
  & SortedIndex;

export type AppointmentEntity = SortedEntity
  & Direction
  & Empty
  & Geometry
  & AppointmentCollectorWithGeometry;

interface SimpleAppointment {
  allDay?: boolean;
  startDate: Date;
  endDate: Date;
}

interface AppointmentInfo {
  info: {
    sourceAppointment: SimpleAppointment;
    appointment: SimpleAppointment;
  };
}

export interface BaseAppointmentViewModel {
  itemData: SafeAppointment;
  allDay: boolean;
  groupIndex: number;
  sortedIndex: number;
}

export interface AppointmentCollectorViewModel extends BaseAppointmentViewModel {
  top: number;
  left: number;
  height: number;
  width: number;
  isCompact: boolean;
  items: AppointmentItemViewModel[];
}

export interface AppointmentAgendaViewModel extends BaseAppointmentViewModel {
  isAgendaModel: true;
  height: number;
  width: string;
  isLastInGroup: boolean;
  info: AppointmentInfo['info'] & {
    partialDates: SimpleAppointment;
  };
}

export interface AppointmentItemViewModel extends BaseAppointmentViewModel, AppointmentInfo {
  direction: string;
  skipResizing: boolean;
  level: number;
  maxLevel: number;
  empty: boolean;
  left: number;
  top: number;
  height: number;
  width: number;
  reduced: 'head' | 'body' | 'tail' | undefined;
  partIndex: number;
  partTotalCount: number;
  rowIndex: number;
  columnIndex: number;
}

export type AppointmentViewModelPlain =
  | AppointmentAgendaViewModel
  | AppointmentItemViewModel
  | AppointmentCollectorViewModel;
