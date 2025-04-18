import type { Orientation } from '@js/common';
import type { TimeZoneCalculator } from '@ts/scheduler/r1/timezone_calculator';
import type { ResourceProcessor } from '@ts/scheduler/resources/resource_processor';
import type { SafeAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils';

export interface AppointmentProperties extends Record<string, unknown> {
  data: SafeAppointment;
  groupIndex?: number;
  groupTexts: string[];
  observer: any;
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
  getLoadedResources: () => {
    data: Record<string, unknown>[];
    items: {
      id: number | string;
      text: string;
    }[];
    name: string;
  }[];
  getAppointmentColor: (config: any) => any;
  getResourceDataAccessors: () => any;
  getResourceProcessor: () => ResourceProcessor;
  getResizableStep: () => number;
}
