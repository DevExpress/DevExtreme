import type { CellDateInfo } from '../../entieties/scale';
import type { TimeZoneCalculator } from '../../r1/timezone_calculator';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type { AppointmentItemViewModel } from '../../view_model/types';

export type Rect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;

export interface GetAppointmentDateRangeOptions {
  handles: {
    left: boolean;
    right: boolean;
  };
  appointmentSettings: AppointmentItemViewModel;
  isVerticalGroupedWorkSpace: boolean;
  appointmentRect: Rect;
  parentAppointmentRect: Rect;
  getCellDateInfo: (
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
    rtlEnabled: boolean,
  ) => CellDateInfo | undefined;
  getCellGeometry: (
    rowIndex: number,
    columnIndex: number,
    isAllDay: boolean,
  ) => CellsInfo | undefined;
  isDateAndTimeView: boolean;
  startDayHour: number;
  endDayHour: number;
  timeZoneCalculator: TimeZoneCalculator;
  dataAccessors: AppointmentDataAccessor;
  rtlEnabled?: boolean;
  viewOffset: number;
}

export interface CellsInfo {
  cellWidth: number;
  cellHeight: number;
  cellCountInRow: number;
}

export type GetAppointmentDateRangeOptionsExtended = Omit<GetAppointmentDateRangeOptions, 'appointmentSettings'>
  & CellsInfo & {
    relativeAppointmentRect: Rect;
    appointment: {
      startDate: Date;
      endDate: Date;
      isAllDay: boolean;
      isOccupiedAllDay: boolean;
    };
  };

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
