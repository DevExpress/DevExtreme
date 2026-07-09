import {
  describe, expect, it,
} from '@jest/globals';

import type { CellRect, DOMMetaData, ViewCellData } from '../../types';
import type { AppointmentItemViewModel } from '../../view_model/types';
import { getAppointmentDateRange } from './get_appointment_date_range';
import type { GetAppointmentDateRangeOptions, Rect } from './types';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 50;
const COLUMN_COUNT = 7;

const mockViewDataProvider = {
  getCellData: (rowIndex: number, columnIndex: number): ViewCellData => ({
    startDate: new Date(2024, 0, 1 + columnIndex),
    endDate: new Date(2024, 0, 2 + columnIndex),
    index: columnIndex,
  } as ViewCellData),
};

const mockDOMMetaData = (): DOMMetaData => ({
  allDayPanelCellsMeta: Array.from({ length: COLUMN_COUNT }, (_, columnIndex): CellRect => ({
    top: 0,
    left: columnIndex * CELL_WIDTH,
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  })),
  dateTableCellsMeta: [],
});

const createOptions = (overrides: {
  handles: { left: boolean; right: boolean };
  appointmentRect: Rect;
  sourceStartDate: Date;
  sourceEndDate: Date;
  rtlEnabled?: boolean;
}): GetAppointmentDateRangeOptions => ({
  handles: overrides.handles,
  appointmentSettings: {
    allDay: true,
    rowIndex: 0,
    columnIndex: 0,
    info: {
      sourceAppointment: {
        startDate: overrides.sourceStartDate,
        endDate: overrides.sourceEndDate,
      },
      appointment: { allDay: true },
    },
  } as unknown as AppointmentItemViewModel,
  isVerticalGroupedWorkSpace: false,
  appointmentRect: overrides.appointmentRect,
  parentAppointmentRect: {
    top: 0, left: 0, width: COLUMN_COUNT * CELL_WIDTH, height: CELL_HEIGHT,
  },
  viewDataProvider: mockViewDataProvider as unknown as GetAppointmentDateRangeOptions['viewDataProvider'],
  rtlEnabled: overrides.rtlEnabled ?? false,
  DOMMetaData: mockDOMMetaData(),
} as unknown as GetAppointmentDateRangeOptions);

describe('getAppointmentDateRange', () => {
  it('should set endDate from the last occupied cell when the right handle is dragged', () => {
    const options = createOptions({
      handles: { left: false, right: true },
      appointmentRect: {
        top: 0, left: CELL_WIDTH, width: CELL_WIDTH, height: CELL_HEIGHT,
      },
      sourceStartDate: new Date(2024, 0, 2),
      sourceEndDate: new Date(2024, 0, 4),
    });

    const range = getAppointmentDateRange(options);

    expect(range.startDate).toEqual(new Date(2024, 0, 2));
    expect(range.endDate).toEqual(new Date(2024, 0, 3));
  });

  it('should set startDate from the first occupied cell when the left handle is dragged', () => {
    const options = createOptions({
      handles: { left: true, right: false },
      appointmentRect: {
        top: 0, left: 2 * CELL_WIDTH, width: CELL_WIDTH, height: CELL_HEIGHT,
      },
      sourceStartDate: new Date(2024, 0, 2),
      sourceEndDate: new Date(2024, 0, 4),
    });

    const range = getAppointmentDateRange(options);

    expect(range.startDate).toEqual(new Date(2024, 0, 3));
    expect(range.endDate).toEqual(new Date(2024, 0, 4));
  });

  it('should set endDate from the last occupied cell when the right handle is dragged across several cells', () => {
    const options = createOptions({
      handles: { left: false, right: true },
      appointmentRect: {
        top: 0, left: CELL_WIDTH, width: 2 * CELL_WIDTH, height: CELL_HEIGHT,
      },
      sourceStartDate: new Date(2024, 0, 2),
      sourceEndDate: new Date(2024, 0, 4),
    });

    const range = getAppointmentDateRange(options);

    expect(range.startDate).toEqual(new Date(2024, 0, 2));
    expect(range.endDate).toEqual(new Date(2024, 0, 4));
  });

  it('should set startDate from the first occupied cell when the right handle is dragged in RTL', () => {
    const options = createOptions({
      handles: { left: false, right: true },
      appointmentRect: {
        top: 0, left: CELL_WIDTH, width: CELL_WIDTH, height: CELL_HEIGHT,
      },
      sourceStartDate: new Date(2024, 0, 2),
      sourceEndDate: new Date(2024, 0, 4),
      rtlEnabled: true,
    });

    const range = getAppointmentDateRange(options);

    expect(range.startDate).toEqual(new Date(2024, 0, 2));
    expect(range.endDate).toEqual(new Date(2024, 0, 4));
  });

  it('should set endDate from the last occupied cell when the left handle is dragged in RTL', () => {
    const options = createOptions({
      handles: { left: true, right: false },
      appointmentRect: {
        top: 0, left: CELL_WIDTH, width: CELL_WIDTH, height: CELL_HEIGHT,
      },
      sourceStartDate: new Date(2024, 0, 2),
      sourceEndDate: new Date(2024, 0, 4),
      rtlEnabled: true,
    });

    const range = getAppointmentDateRange(options);

    expect(range.startDate).toEqual(new Date(2024, 0, 2));
    expect(range.endDate).toEqual(new Date(2024, 0, 3));
  });
});
