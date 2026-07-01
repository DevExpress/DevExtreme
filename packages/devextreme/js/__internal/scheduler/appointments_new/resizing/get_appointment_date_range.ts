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

  if (!isAllDay) {
    cellData.endDate = dateUtilsTs.addOffsets(cellData.startDate, toMs('day'));
  }

  return cellData;
};

const getAppointmentLeftCell = (options: GetAppointmentDateRangeOptionsExtended): ViewCellData => {
  const {
    cellHeight,
    cellWidth,
    relativeAppointmentRect,
    appointment,
    rtlEnabled,
  } = options;

  const cellRowIndex = Math.floor(relativeAppointmentRect.top / cellHeight);
  const cellColumnIndex = Math.round(relativeAppointmentRect.left / cellWidth);

  return getCellData(
    options,
    cellRowIndex,
    cellColumnIndex,
    appointment.isOccupiedAllDay,
    appointment.isAllDay,
    rtlEnabled,
  );
};

const getResizedDateRange = (options: GetAppointmentDateRangeOptionsExtended): DateRange => {
  const {
    rtlEnabled,
    handles,
    appointment,
    relativeAppointmentRect,
    cellWidth,
    cellCountInRow,
  } = options;

  const leftCell = getAppointmentLeftCell(options);
  const cellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
  const isStartEdgeResized = rtlEnabled ? handles.right : handles.left;

  if (isStartEdgeResized) {
    const firstCell = rtlEnabled
      ? getCellData(
        options,
        Math.floor(leftCell.index / cellCountInRow),
        leftCell.index - cellsAmount + 1,
        appointment.isOccupiedAllDay,
        appointment.isAllDay,
      )
      : leftCell;

    return {
      startDate: firstCell.startDate,
      endDate: firstCell.startDate > appointment.endDate
        ? firstCell.startDate
        : appointment.endDate,
    };
  }

  const lastCellIndex = leftCell.index + cellsAmount - 1;
  const lastCell = rtlEnabled
    ? leftCell
    : getCellData(
      options,
      Math.floor(lastCellIndex / cellCountInRow),
      lastCellIndex % cellCountInRow,
      appointment.isOccupiedAllDay,
      appointment.isAllDay,
    );

  return {
    startDate: lastCell.endDate < appointment.startDate
      ? lastCell.endDate
      : appointment.startDate,
    endDate: lastCell.endDate,
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

  return getResizedDateRange(extendedOptions);
};
