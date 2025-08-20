import type { TimeZoneCalculator } from '../../r1/timezone_calculator';
import type { ViewDataProviderType } from '../../types';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type { AppointmentItemViewModel } from '../../view_model/generate_view_model/types';

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
  viewDataProvider: ViewDataProviderType;
  isDateAndTimeView: boolean;
  startDayHour: number;
  endDayHour: number;
  timeZoneCalculator: TimeZoneCalculator;
  dataAccessors: AppointmentDataAccessor;
  rtlEnabled?: boolean;
  DOMMetaData: {
    allDayPanelCellsMeta: Rect[];
    dateTableCellsMeta: Rect[][];
  };
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
