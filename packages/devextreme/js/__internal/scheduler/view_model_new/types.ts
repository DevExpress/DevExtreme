import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { SafeAppointment } from '../types';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import type { GroupLeaf } from '../utils/resource_manager/types';

export interface Position {
  cellIndex: number;
  rowIndex: number;
  columnIndex: number;
}
export interface DateInterval {
  min: number;
  max: number;
}
export interface CellInterval extends DateInterval, Position {}

export interface CompareOptions {
  startDayHour: number;
  endDayHour: number;
  min: Date;
  max: Date;
}

export interface PanelOptions {
  intervals: DateInterval[];
  prevIntervalEndDate: number;
  nextIntervalStartDate: number;
}

export interface FilterOptions {
  resourceManager: ResourceManager;
  timeZoneCalculator: TimeZoneCalculator;
  viewOffset: number;
  firstDayOfWeek?: number;
  allDayPanel: PanelOptions;
  regularPanel: PanelOptions;
}

export interface SortedIndex {
  sortedIndex: number;
}

export interface GroupIndex {
  groupIndex: GroupLeaf['groupIndex'];
}

export interface MinimalAppointmentEntity {
  startDate: number;
  startDateTimeZone?: string;
  endDate: number;
  duration: number;
  endDateTimeZone?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
  hasRecurrenceRule: boolean;
  allDay: boolean;
  isAllDayPanelOccupied: boolean;
  visible: boolean;
  itemData: SafeAppointment;
}

export interface AppointmentPart {
  reduced?: 'head' | 'body' | 'tail';
  partIndex: number;
  partCount: number;
}

export type ListEntity<T = MinimalAppointmentEntity> = T
  & GroupIndex
  & AppointmentPart;
