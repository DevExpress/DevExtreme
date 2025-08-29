import type { Orientation } from '@js/common';

import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { AllDayPanelModeType, SafeAppointment } from '../types';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { GroupLeaf } from '../utils/resource_manager/types';
import type {
  Geometry,
  RealSize,
} from './generate_view_model/steps/add_geometry/types';

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

export interface DateIntervalsExtended {
  intervals: DateInterval[];
  prevIntervalEndDate: number;
  nextIntervalStartDate: number;
}

export interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: Date;
  max: Date;
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

export interface OriginalAppointmentDates {
  originalAppointmentDates: {
    startDate: number;
    endDate: number;
  };
}

export interface AppointmentPart extends OriginalAppointmentDates {
  reduced?: 'head' | 'body' | 'tail';
  partIndex: number;
  partCount: number;
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
  & AppointmentPart
  & AgendaGeometry
  & LastInGroup
  & SortedIndex;

export interface Level {
  level: number;
}

export interface MaxLevel {
  maxLevel: number;
}

export interface AppointmentCollector {
  items: (ListEntity & OriginalAppointmentDates)[];
  isCompact: boolean;
}

export interface AppointmentCollectorWithGeometry {
  items: (ListEntity & OriginalAppointmentDates & RealSize)[];
  isCompact: boolean;
}

export interface Direction {
  direction: Orientation;
}

export type AppointmentEntity = ListEntity
  & AppointmentPart
  & Level
  & MaxLevel
  & Position
  & Direction
  & SortedIndex
  & Geometry
  & AppointmentCollectorWithGeometry;
