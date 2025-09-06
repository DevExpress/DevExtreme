import type { Orientation } from '@js/common';

import type {
  AllDayPanelOccupation,
  AppointmentCollector,
  CellInterval,
  DateInterval,
  Level,
  ListEntity,
  Position,
} from '../../../types';

export interface Empty {
  empty: boolean;
}
export interface Geometry {
  left: number;
  top: number;
  width: number;
  height: number;
}
export interface X {
  sizeX: number; // abstract width
  offsetX: number; // abstract left corner
}
export interface Y {
  sizeY: number; // abstract height
  offsetY: number; // abstract top corner
}
export interface RealSize {
  height: number; // real height
  width: number; // real width
}
export interface AbstractSize {
  sizeX: number; // abstract width
  sizeY: number; // abstract height
}
export interface CollectorCSS {
  height: string;
  width: string;
  marginRight: string;
  marginLeft: string;
  marginTop: string;
  marginBottom: string;
}

export type GeometryMinimalEntity = Pick<ListEntity, 'startDate' | 'endDate' | 'groupIndex' | 'duration'>
  & Position
  & Level
  & AppointmentCollector
  & AllDayPanelOccupation;

export interface GeometryOptions {
  intervals: DateInterval[];
  cells: CellInterval[];
  maxAppointmentsPerCell: number;
  viewOrientation: Orientation;
  groupOrientation?: Orientation;
  isGroupByDate: boolean;
  hasAllDayPanel: boolean;
  isTimelineView: boolean;
  isRTLEnabled: boolean;
  isAdaptivityEnabled: boolean;
  collectorPosition: 'start' | 'end';
  groupCount: number;
  cellSize: RealSize;
  collectorSize: RealSize;
  collectorWithMarginsSize: RealSize;
  groupSize: RealSize;
  panelSize: RealSize;
}
