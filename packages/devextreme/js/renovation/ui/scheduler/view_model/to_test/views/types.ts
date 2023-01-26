export type HeaderCellTextFormat = string | ((date: Date) => string);

export interface GetDateForHeaderTextOptions {
  startDayHour: number;
  startViewDate: Date;
  cellCountInDay: number;
  interval: number;
}

export type GetDateForHeaderText = (
  index: number, date: Date, options: GetDateForHeaderTextOptions,
) => Date;

export type CalculateCellIndex = (
  rowIndex: number, columnIndex: number, rowCount: number, columnCount: number,
) => number;
export type CalculateStartViewDate = (
  currentDate: Date,
  startDayHour: number,
  startDate: Date,
  intervalCount: number,
  firstDayOfWeekOption: number,
) => Date;
