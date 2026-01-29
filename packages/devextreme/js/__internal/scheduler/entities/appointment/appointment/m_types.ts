import type { Orientation } from '@js/common';
import type NotifyScheduler from '@ts/scheduler/base/m_widget_notify_scheduler';
import type { TimeZoneCalculator } from '../../timezone';
import type { SafeAppointment } from '../../../types';
import type { AppointmentDataAccessor } from '../../data-source/data-accessor/appointment_data_accessor';
import type { ResourceManager } from '../../resource/manager';

export interface AppointmentProperties extends Record<string, unknown> {
  data: SafeAppointment;
  groupIndex?: number;
  groupTexts: string[];
  notifyScheduler: NotifyScheduler | undefined;
  geometry: any;
  direction: Orientation;
  allowResize: boolean;
  allowDrag: boolean;
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
