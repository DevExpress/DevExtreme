import { describe, expect, it } from '@jest/globals';
import { mockFieldExpressions } from '@ts/scheduler/__mock__/appointment_data_accessor.mock';

import subscribes from './m_subscribes';
import type { ViewType } from './types';
import { AppointmentDataAccessor } from './utils/data_accessor/appointment_data_accessor';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 50;
const CELL_DURATION = 30;
const HOUR_MS = 3600000;
const DAY_MS = 24 * HOUR_MS;

const createScheduler = (viewType: ViewType, allDayPanelMode = 'all'): unknown => ({
  currentView: { type: viewType },
  _dataAccessors: new AppointmentDataAccessor(mockFieldExpressions, true, 'yyyy/MM/dd HH:mm:ss'),
  option: (name: string): unknown => (name === 'allDayPanelMode' ? allDayPanelMode : undefined),
  getWorkSpace: () => ({
    getCellWidth: () => CELL_WIDTH,
    getCellHeight: () => CELL_HEIGHT,
    option: (name: string): unknown => (name === 'cellDuration' ? CELL_DURATION : undefined),
    positionHelper: { getResizableStep: () => CELL_WIDTH },
  }),
});

const getDeltaTime = (
  viewType: ViewType,
  allDay: boolean,
  size: { width: number; height: number },
  allDayPanelMode = 'all',
): number => subscribes.getDeltaTime.call(
  createScheduler(viewType, allDayPanelMode),
  size,
  { width: 0, height: 0 },
  {
    startDate: new Date(2021, 3, 12, 9),
    endDate: allDay ? new Date(2021, 3, 13, 9) : new Date(2021, 3, 12, 10),
    allDay,
  },
);

describe('getDeltaTime', () => {
  describe('timeline views', () => {
    it.each(['timelineDay', 'timelineWeek', 'timelineWorkWeek'] as ViewType[])(
      'should resize an all day appointment by the cell duration in %s',
      (viewType) => {
        expect(getDeltaTime(viewType, true, { width: CELL_WIDTH, height: 0 }))
          .toBe(CELL_DURATION * 60000);
      },
    );

    it('should resize a regular appointment by the cell duration', () => {
      expect(getDeltaTime('timelineWeek', false, { width: CELL_WIDTH, height: 0 }))
        .toBe(CELL_DURATION * 60000);
    });

    it('should resize an all day appointment by whole days in timelineMonth', () => {
      expect(getDeltaTime('timelineMonth', true, { width: CELL_WIDTH, height: 0 }))
        .toBe(DAY_MS);
    });
  });

  describe('vertical views', () => {
    it('should resize an all day appointment by whole days', () => {
      expect(getDeltaTime('week', true, { width: CELL_WIDTH, height: 0 })).toBe(DAY_MS);
    });

    it('should resize an all day appointment by the cell duration when the all day panel is hidden', () => {
      expect(getDeltaTime('week', true, { width: 0, height: CELL_HEIGHT }, 'hidden'))
        .toBe(CELL_DURATION * 60000);
    });

    it('should resize a regular appointment by the cell duration', () => {
      expect(getDeltaTime('week', false, { width: 0, height: CELL_HEIGHT }))
        .toBe(CELL_DURATION * 60000);
    });
  });

  describe('month view', () => {
    it('should resize an all day appointment by whole days', () => {
      expect(getDeltaTime('month', true, { width: CELL_WIDTH, height: 0 })).toBe(DAY_MS);
    });
  });
});
