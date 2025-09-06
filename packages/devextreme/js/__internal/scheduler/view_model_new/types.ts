import type { Orientation } from '@js/common';

import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { AllDayPanelModeType, SafeAppointment } from '../types';
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
  cells: CellInterval[];
}

export interface FilterOptions {
  allDayPanelMode: AllDayPanelModeType;
  showAllDayPanel: boolean;
  supportAllDayPanel: boolean;
  resourceManager: ResourceManager;
  timeZoneCalculator: TimeZoneCalculator;
  viewOffset: number;
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
  startDate: number;
  startDateTimeZone?: string;
  endDate: number;
  endDateTimeZone?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
  hasRecurrenceRule: boolean;
  allDay: boolean;
  visible: boolean;
  disabled: boolean;
  itemData: SafeAppointment;
}

export interface Duration {
  duration: number;
}

export interface AppointmentPart {
  reduced?: 'head' | 'body' | 'tail';
  partIndex: number;
  partCount: number;
}

export interface DatesBeforeSplit {
  sourceDatesBeforeSplit: {
    allDay: boolean;
    startDate: number;
    endDate: number;
  };
  datesBeforeSplit: {
    allDay: boolean;
    startDate: number;
    endDate: number;
  };
}

export interface DatesAfterSplit {
  datesAfterSplit: {
    allDay: boolean;
    startDate: number;
    endDate: number;
  };
}

export type ListEntity = MinimalAppointmentEntity
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
  & DatesBeforeSplit
  & DatesAfterSplit
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
  & DatesBeforeSplit
  & RealSize;

export interface AppointmentCollector {
  items: (ListEntity & DatesBeforeSplit)[];
  isCompact: boolean;
}

export interface AppointmentCollectorWithGeometry {
  items: CollectorItemEntity[];
  isCompact: boolean;
}

export interface Direction {
  direction: Orientation;
}

export type AppointmentEntity = ListEntity
  & DatesBeforeSplit
  & AppointmentPart
  & Level
  & Position
  & Direction
  & Empty
  & SortedIndex
  & Geometry
  & AppointmentCollectorWithGeometry;
