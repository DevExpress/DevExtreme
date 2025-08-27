import type { TimeZoneCalculator } from '../r1/timezone_calculator';
import type { AllDayPanelModeType, SafeAppointment } from '../types';
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
  allDayPanelMode: AllDayPanelModeType;
  showAllDayPanel: boolean;
  supportAllDayPanel: boolean;
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

export interface AppointmentPart {
  originalAppointmentDates: {
    startDate: number;
    endDate: number;
  };
  reduced?: 'head' | 'body' | 'tail';
  partIndex: number;
  partCount: number;
}

export type ListEntity<T = MinimalAppointmentEntity> = T
  & AllDayPanelOccupation
  & GroupIndex
  & AppointmentPart;

export interface LastInGroup {
  isLastInGroup: boolean;
}

export interface AgendaGeometry {
  width: string;
  height: number;
}

export type AgendaEntity = ListEntity
  & AgendaGeometry
  & LastInGroup
  & SortedIndex;
