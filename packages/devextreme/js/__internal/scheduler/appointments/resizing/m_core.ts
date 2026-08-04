import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { ViewCellData } from '../../types';
import type {
  CellsInfo,
  DateRange,
  GetAppointmentDateRangeOptions,
  GetAppointmentDateRangeOptionsExtended,
  Rect,
} from './types';

const toMs = dateUtils.dateToMilliseconds;

// NOTE: View data generator shifts all day cell dates by offset
// and return equal start and end dates.
const getCellData = (
  { viewDataProvider }: GetAppointmentDateRangeOptionsExtended,
  cellRowIndex: number,
  cellColumnIndex: number,
  isOccupiedAllDay: boolean,
  isAllDay = false,
  rtlEnabled = false,
): ViewCellData => {
  const cellData = viewDataProvider.getCellData(
    cellRowIndex,
    cellColumnIndex,
    isOccupiedAllDay,
    rtlEnabled,
  );
  // NOTE: All day appointments occupy day if they start at the beginning of the day,
  // but long appointments are not. So for all day appointments endDate === startDate,
  // for long appointments endDate = startDate + 1 day.
  if (!isAllDay) {
    cellData.endDate = dateUtilsTs.addOffsets(cellData.startDate, toMs('day'));
  }

  return cellData;
};

// NOTE: Cell indexes are always counted from the left table border,
// getCellData mirrors them in RTL.
const getAppointmentCellIndexes = (
  options: GetAppointmentDateRangeOptionsExtended,
): { rowIndex: number; columnIndex: number } => {
  const { cellHeight, cellWidth, relativeAppointmentRect } = options;

  return {
    rowIndex: Math.floor(relativeAppointmentRect.top / cellHeight),
    columnIndex: Math.round(relativeAppointmentRect.left / cellWidth),
  };
};

const getAppointmentLeftCell = (options: GetAppointmentDateRangeOptionsExtended): ViewCellData => {
  const { appointment, rtlEnabled } = options;
  const { rowIndex, columnIndex } = getAppointmentCellIndexes(options);

  return getCellData(
    options,
    rowIndex,
    columnIndex,
    appointment.isOccupiedAllDay,
    appointment.isAllDay,
    rtlEnabled,
  );
};

const getAppointmentRightCell = (options: GetAppointmentDateRangeOptionsExtended): ViewCellData => {
  const {
    cellWidth,
    cellCountInRow,
    relativeAppointmentRect,
    appointment,
    rtlEnabled,
  } = options;
  const { rowIndex, columnIndex } = getAppointmentCellIndexes(options);
  const cellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
  const rightColumnIndex = Math.min(columnIndex + cellsAmount - 1, cellCountInRow - 1);

  return getCellData(
    options,
    rowIndex,
    rightColumnIndex,
    appointment.isOccupiedAllDay,
    appointment.isAllDay,
    rtlEnabled,
  );
};

const getDateRangeHorizontal = (options: GetAppointmentDateRangeOptionsExtended): DateRange => {
  const { appointment, handles } = options;

  if (handles.left) {
    const { startDate } = getAppointmentLeftCell(options);

    return {
      startDate,
      endDate: startDate > appointment.endDate
        ? startDate
        : appointment.endDate,
    };
  }

  const { endDate } = getAppointmentRightCell(options);

  return {
    startDate: endDate < appointment.startDate
      ? endDate
      : appointment.startDate,
    endDate,
  };
};

const getDateRangeHorizontalRTL = (options: GetAppointmentDateRangeOptionsExtended): DateRange => {
  const { appointment, handles } = options;

  if (handles.right) {
    const { startDate } = getAppointmentRightCell(options);

    return {
      startDate,
      endDate: startDate > appointment.endDate
        ? startDate
        : appointment.endDate,
    };
  }

  const { endDate } = getAppointmentLeftCell(options);

  return {
    startDate: endDate < appointment.startDate
      ? endDate
      : appointment.startDate,
    endDate,
  };
};

const getRelativeAppointmentRect = (appointmentRect: Rect, parentAppointmentRect: Rect): Rect => {
  const left = appointmentRect.left - parentAppointmentRect.left;
  const top = appointmentRect.top - parentAppointmentRect.top;
  const width = left < 0
    ? appointmentRect.width + left
    : appointmentRect.width;
  const height = top < 0
    ? appointmentRect.height + top
    : appointmentRect.height;

  return {
    left: Math.max(0, left),
    top: Math.max(0, top),
    width,
    height,
  };
};

const getAppointmentCellsInfo = (options: GetAppointmentDateRangeOptions): CellsInfo => {
  const {
    appointmentSettings,
    isVerticalGroupedWorkSpace,
    DOMMetaData,
  } = options;

  const DOMMetaTable = appointmentSettings.allDay && !isVerticalGroupedWorkSpace
    ? [DOMMetaData.allDayPanelCellsMeta]
    : DOMMetaData.dateTableCellsMeta;

  const {
    height: cellHeight,
    width: cellWidth,
  } = DOMMetaTable[appointmentSettings.rowIndex][appointmentSettings.columnIndex];
  const cellCountInRow = DOMMetaTable[appointmentSettings.rowIndex].length;

  return {
    cellWidth,
    cellHeight,
    cellCountInRow,
  };
};

export const getAppointmentDateRange = (options: GetAppointmentDateRangeOptions): DateRange => {
  const {
    appointmentSettings,
  } = options;

  const relativeAppointmentRect = getRelativeAppointmentRect(
    options.appointmentRect,
    options.parentAppointmentRect,
  );
  const cellInfo = getAppointmentCellsInfo(options);
  const appointment = {
    startDate: appointmentSettings.info.sourceAppointment.startDate,
    endDate: appointmentSettings.info.sourceAppointment.endDate,
    isAllDay: Boolean(appointmentSettings.info.appointment.allDay),
    isOccupiedAllDay: Boolean(appointmentSettings.allDay),
  };
  const extendedOptions = {
    ...options,
    ...cellInfo,
    appointment,
    relativeAppointmentRect,
  };

  return !options.rtlEnabled
    ? getDateRangeHorizontal(extendedOptions)
    : getDateRangeHorizontalRTL(extendedOptions);
};
