import type { Orientation } from '@js/common';
import type NotifyScheduler from '@ts/scheduler/base/widget_notify_scheduler';
import type { TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator/calculator';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';
import type { ResourceManager } from '@ts/scheduler/utils/resource_manager/resource_manager';

export interface AppointmentProperties extends Record<string, unknown> {
  data: SafeAppointment;
  groupIndex?: number;
  groupTexts: string[];
  notifyScheduler: NotifyScheduler | undefined;
  geometry: any;
  direction: Orientation;
  allowResize: boolean;
  allowDrag: boolean;
  allowDelete: boolean;
  allDay: boolean;
  reduced: string;
  isCompact: boolean;
  startDate: Date;
  cellWidth: number;
  cellHeight: number;
  resizableConfig: Record<string, unknown>;
  groups: any[];
  partIndex?: number;
  partTotalCount: number;

  dataAccessors: AppointmentDataAccessor;
  timeZoneCalculator: TimeZoneCalculator;
  getResourceManager: () => ResourceManager;
  getResizableStep: () => number;
}
