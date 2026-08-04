import { describe, expect, it } from '@jest/globals';

import { getAppointmentDateRange } from './m_core';
import type { GetAppointmentDateRangeOptions, Rect } from './types';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 24;
const FIRST_DATE = new Date(2021, 3, 11);

const addDays = (date: Date, days: number): Date => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate() + days,
);

// NOTE: Every date column is repeated for each group when grouping by date,
// so a cell column index is not equal to a date index anymore.
const createAllDayRow = (dateCount: number, groupCount: number): {
  startDate: Date;
  endDate: Date;
  index: number;
  groupIndex: number;
}[] => Array.from({ length: dateCount * groupCount }, (_, columnIndex) => {
  const dateIndex = Math.floor(columnIndex / groupCount);
  const startDate = addDays(FIRST_DATE, dateIndex);

  return {
    startDate,
    endDate: startDate,
    index: dateIndex,
    groupIndex: columnIndex % groupCount,
  };
});

const createOptions = ({
  dateCount = 7,
  groupCount = 2,
  left,
  width,
  handles,
  rtlEnabled = false,
  appointment = {
    startDate: new Date(2021, 3, 12),
    endDate: new Date(2021, 3, 14),
    allDay: false,
  },
}: {
  dateCount?: number;
  groupCount?: number;
  left: number;
  width: number;
  handles: { left: boolean; right: boolean };
  rtlEnabled?: boolean;
  appointment?: { startDate: Date; endDate: Date; allDay: boolean };
}): GetAppointmentDateRangeOptions => {
  const row = createAllDayRow(dateCount, groupCount);
  const cellsMeta = row.map(() => ({ width: CELL_WIDTH, height: CELL_HEIGHT }));
  const rect = (values: Partial<Rect>): Rect => ({
    top: 0, left: 0, width: 0, height: 0, ...values,
  });

  return {
    handles,
    rtlEnabled,
    isVerticalGroupedWorkSpace: false,
    appointmentSettings: {
      allDay: true,
      rowIndex: 0,
      columnIndex: 0,
      info: {
        appointment: { allDay: appointment.allDay },
        sourceAppointment: {
          startDate: appointment.startDate,
          endDate: appointment.endDate,
        },
      },
    },
    appointmentRect: rect({ left, width, height: CELL_HEIGHT }),
    parentAppointmentRect: rect({}),
    DOMMetaData: { allDayPanelCellsMeta: cellsMeta },
    viewDataProvider: {
      getCellData: (
        rowIndex: number,
        columnIndex: number,
        isAllDay: boolean,
        rtl: boolean,
      ) => ({ ...row[rtl ? row.length - 1 - columnIndex : columnIndex] }),
    },
  } as unknown as GetAppointmentDateRangeOptions;
};

describe('getAppointmentDateRange', () => {
  describe('grouping by date', () => {
    it('should take the end date from the cell under the right appointment border', () => {
      const dateRange = getAppointmentDateRange(createOptions({
        left: 2 * CELL_WIDTH,
        width: 5 * CELL_WIDTH,
        handles: { left: false, right: true },
      }));

      expect(dateRange).toEqual({
        startDate: new Date(2021, 3, 12),
        endDate: new Date(2021, 3, 15),
      });
    });

    it('should take the start date from the cell under the left appointment border', () => {
      const dateRange = getAppointmentDateRange(createOptions({
        left: 0,
        width: 5 * CELL_WIDTH,
        handles: { left: true, right: false },
      }));

      expect(dateRange).toEqual({
        startDate: new Date(2021, 3, 11),
        endDate: new Date(2021, 3, 14),
      });
    });

    it('should not go outside of the row when the appointment is wider than the row', () => {
      const dateRange = getAppointmentDateRange(createOptions({
        left: 12 * CELL_WIDTH,
        width: 5 * CELL_WIDTH,
        handles: { left: false, right: true },
      }));

      expect(dateRange).toEqual({
        startDate: new Date(2021, 3, 12),
        endDate: new Date(2021, 3, 18),
      });
    });

    it('should mirror cell indexes in RTL', () => {
      const dateRange = getAppointmentDateRange(createOptions({
        left: 11 * CELL_WIDTH,
        width: 3 * CELL_WIDTH,
        handles: { left: false, right: true },
        rtlEnabled: true,
      }));

      expect(dateRange).toEqual({
        startDate: new Date(2021, 3, 11),
        endDate: new Date(2021, 3, 14),
      });
    });
  });

  describe('without grouping', () => {
    it('should take the end date from the cell under the right appointment border', () => {
      const dateRange = getAppointmentDateRange(createOptions({
        groupCount: 1,
        left: CELL_WIDTH,
        width: 3 * CELL_WIDTH,
        handles: { left: false, right: true },
      }));

      expect(dateRange).toEqual({
        startDate: new Date(2021, 3, 12),
        endDate: new Date(2021, 3, 15),
      });
    });

    it('should keep the all day appointment end date inside the last occupied cell', () => {
      const dateRange = getAppointmentDateRange(createOptions({
        groupCount: 1,
        left: CELL_WIDTH,
        width: 3 * CELL_WIDTH,
        handles: { left: false, right: true },
        appointment: {
          startDate: new Date(2021, 3, 12),
          endDate: new Date(2021, 3, 14),
          allDay: true,
        },
      }));

      expect(dateRange).toEqual({
        startDate: new Date(2021, 3, 12),
        endDate: new Date(2021, 3, 14),
      });
    });
  });
});
