import { dateUtilsTs } from '@ts/core/utils/date';
import { dateUtils } from '@ts/core/utils/m_date';

import type { CellDateInfo } from '../../entieties/scale';
import type {
  CellsInfo,
  DateRange,
  GetAppointmentDateRangeOptions,
  GetAppointmentDateRangeOptionsExtended,
  Rect,
} from './types';

const toMs = dateUtils.dateToMilliseconds;

const getCellData = (
  { getCellDateInfo }: GetAppointmentDateRangeOptionsExtended,
  cellRowIndex: number,
  cellColumnIndex: number,
  isOccupiedAllDay: boolean,
  isAllDay = false,
  rtlEnabled = false,
): CellDateInfo => {
  const cellData = getCellDateInfo(
    cellRowIndex,
    cellColumnIndex,
    isOccupiedAllDay,
    rtlEnabled,
  )!;

  if (!isAllDay) {
    cellData.endDate = dateUtilsTs.addOffsets(cellData.startDate, toMs('day'));
  }

  return cellData;
};

const getAppointmentLeftCell = (options: GetAppointmentDateRangeOptionsExtended): CellDateInfo => {
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

const getDateRangeHorizontal = (options: GetAppointmentDateRangeOptionsExtended): DateRange => {
  const {
    cellWidth,
    cellCountInRow,
    relativeAppointmentRect,
    appointment,
    handles,
  } = options;

  const appointmentFirstCell = getAppointmentLeftCell(options);
  const appointmentCellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
  const appointmentLastCellIndex = appointmentFirstCell.index + (appointmentCellsAmount - 1);

  if (handles.left) {
    return {
      startDate: appointmentFirstCell.startDate,
      endDate: appointmentFirstCell.startDate > appointment.endDate
        ? appointmentFirstCell.startDate
        : appointment.endDate,
    };
  }

  const appointmentRowIndex = Math.floor(appointmentLastCellIndex / cellCountInRow);
  const appointmentColumnIndex = appointmentLastCellIndex % cellCountInRow;
  const appointmentLastCell = getCellData(
    options,
    appointmentRowIndex,
    appointmentColumnIndex,
    appointment.isOccupiedAllDay,
    appointment.isAllDay,
  );

  const { endDate } = appointmentLastCell;

  return {
    startDate: endDate < appointment.startDate
      ? endDate
      : appointment.startDate,
    endDate,
  };
};

const getDateRangeHorizontalRTL = (options: GetAppointmentDateRangeOptionsExtended): DateRange => {
  const {
    cellCountInRow,
    appointment,
    handles,
    cellWidth,
    relativeAppointmentRect,
  } = options;

  const appointmentLastCell = getAppointmentLeftCell(options);

  if (handles.right) {
    const appointmentLastCellIndex = appointmentLastCell.index;
    const appointmentCellsAmount = Math.round(relativeAppointmentRect.width / cellWidth);
    const appointmentFirstCellIndex = appointmentLastCellIndex - appointmentCellsAmount + 1;
    const appointmentRowIndex = Math.floor(appointmentLastCellIndex / cellCountInRow);
    const appointmentFirstCell = getCellData(
      options,
      appointmentRowIndex,
      appointmentFirstCellIndex,
      appointment.isOccupiedAllDay,
      appointment.isAllDay,
    );

    return {
      startDate: appointmentFirstCell.startDate,
      endDate: appointmentFirstCell.startDate > appointment.endDate
        ? appointmentFirstCell.startDate
        : appointment.endDate,
    };
  }

  const { endDate } = appointmentLastCell;

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
    getCellGeometry,
  } = options;

  const geometry = getCellGeometry(
    appointmentSettings.rowIndex,
    appointmentSettings.columnIndex,
    Boolean(appointmentSettings.allDay),
  );

  return geometry ?? { cellWidth: 0, cellHeight: 0, cellCountInRow: 0 };
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
