import {
  beforeEach, describe, expect, it,
} from '@jest/globals';
import type { Properties } from '@js/ui/scheduler';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const APPOINTMENT_SELECTOR = '.dx-scheduler-appointment';
const REDUCED_SELECTOR = '.dx-scheduler-appointment-reduced';
const HANDLE_LEFT_SELECTOR = '.dx-resizable-handle-left';
const HANDLE_RIGHT_SELECTOR = '.dx-resizable-handle-right';

const getResizeHandles = (container: HTMLElement): string[][] => Array
  .from(container.querySelectorAll(APPOINTMENT_SELECTOR))
  .map((part) => [
    ...(part.querySelector(HANDLE_LEFT_SELECTOR) ? ['left'] : []),
    ...(part.querySelector(HANDLE_RIGHT_SELECTOR) ? ['right'] : []),
  ]);

const baseConfig: Properties = {
  dataSource: [{
    text: 'Long',
    roomId: 1,
    startDate: new Date(2021, 3, 12, 9),
    endDate: new Date(2021, 3, 14, 12),
  }],
  currentDate: new Date(2021, 3, 14),
  editing: { allowUpdating: true, allowResizing: true },
  groups: ['roomId'],
  resources: [{
    fieldExpr: 'roomId',
    dataSource: [{ id: 1, text: 'Room 1' }, { id: 2, text: 'Room 2' }],
  }],
  height: 600,
};

describe('Appointments resizing', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  describe('grouping by date', () => {
    it('should render resize handles only on the edges of a long appointment [month]', async () => {
      const { container } = await createScheduler({
        ...baseConfig,
        views: ['month'],
        currentView: 'month',
        groupByDate: true,
      });

      expect(getResizeHandles(container)).toEqual([['left'], [], ['right']]);
    });

    it('should not render the reduced icon on parts of a long appointment [month]', async () => {
      const { container } = await createScheduler({
        ...baseConfig,
        views: ['month'],
        currentView: 'month',
        groupByDate: true,
      });

      expect(container.querySelectorAll(APPOINTMENT_SELECTOR).length).toBe(3);
      expect(container.querySelectorAll(REDUCED_SELECTOR).length).toBe(0);
    });

    it('should render resize handles only on the edges of a long all-day appointment [week]', async () => {
      const { container } = await createScheduler({
        ...baseConfig,
        dataSource: [{
          text: 'Long',
          roomId: 1,
          allDay: true,
          startDate: new Date(2021, 3, 12, 9),
          endDate: new Date(2021, 3, 14, 12),
        }],
        views: ['week'],
        currentView: 'week',
        groupByDate: true,
      });

      expect(getResizeHandles(container)).toEqual([['left'], [], ['right']]);
    });
  });

  describe('grouping by resource', () => {
    it('should render resize handles only on the edges of a long appointment [month]', async () => {
      const { container } = await createScheduler({
        ...baseConfig,
        dataSource: [{
          text: 'Long',
          roomId: 1,
          startDate: new Date(2021, 3, 9, 9),
          endDate: new Date(2021, 3, 14, 12),
        }],
        views: ['month'],
        currentView: 'month',
        groupByDate: false,
      });

      expect(getResizeHandles(container)).toEqual([['left'], ['right']]);
    });
  });
});
