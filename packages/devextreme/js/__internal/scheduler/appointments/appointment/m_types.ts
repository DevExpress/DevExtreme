import type { Orientation } from '@js/common';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import type NotifyScheduler from '@ts/scheduler/base/widget_notify_scheduler';
import type { TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator/calculator';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';
import type { ResourceManager } from '@ts/scheduler/utils/resource_manager/resource_manager';

import type { Appointment } from './m_appointment';

export type AppointmentReducedPart = 'head' | 'body' | 'tail';

export interface AppointmentGeometry {
  top?: number;
  left?: number;
  width: number | string;
  height: number;
  empty?: boolean;
}

export interface AppointmentProperties extends DOMComponentProperties<Appointment> {
  data: SafeAppointment;
  groupIndex?: number;
  groupTexts: string[];
  notifyScheduler: NotifyScheduler | undefined;
  geometry: AppointmentGeometry;
  direction: Orientation;
  allowResize: boolean;
  allowDrag: boolean;
  allowDelete: boolean;
  allDay: boolean;
  reduced: AppointmentReducedPart | null | undefined;
  isCompact: boolean;
  startDate: Date;
  cellWidth: number;
  cellHeight: number;
  resizableConfig: object;
  groups: string[];
  partIndex?: number;
  partTotalCount: number;
  isDragSource: boolean;
  sortedIndex?: number;

  dataAccessors: AppointmentDataAccessor;
  timeZoneCalculator: TimeZoneCalculator;
  getResourceManager: () => ResourceManager;
  getResizableStep: () => number;
}
