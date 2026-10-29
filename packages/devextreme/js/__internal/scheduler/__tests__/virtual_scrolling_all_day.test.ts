import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { ScrollOffset } from '@ts/core/utils/scroll';
import type Scheduler from '@ts/scheduler/scheduler';
import type { VirtualScrollingDispatcher } from '@ts/scheduler/workspaces/virtual_scrolling';

import { createScheduler } from './__mock__/create_scheduler';
import { DEFAULT_CELL_WIDTH, setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const getDispatcher = (scheduler: Scheduler): VirtualScrollingDispatcher => (
  scheduler as unknown as { _workSpace: { virtualScrollingDispatcher: VirtualScrollingDispatcher } }
)._workSpace.virtualScrollingDispatcher;

const scroll = (scheduler: Scheduler, offset: ScrollOffset): void => {
  getDispatcher(scheduler).handleOnScrollEvent(offset);
  jest.runAllTimers();
};

const config = {
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 28),
  cellDuration: 30,
  scrolling: { mode: 'virtual' },
  height: 600,
};

describe('Virtual scrolling: all-day appointments', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('should render all-day appointment after vertical scroll (T1337264)', async () => {
    const { scheduler, POM } = await createScheduler({
      ...config,
      dataSource: [{
        text: 'All day',
        startDate: new Date(2021, 2, 28, 10),
        endDate: new Date(2021, 2, 28, 11),
        allDay: true,
      }],
    });
    jest.useFakeTimers();

    scroll(scheduler, { left: 0, top: 2000 });
    const { cellCountInsideTopVirtualRow } = getDispatcher(scheduler);

    expect(cellCountInsideTopVirtualRow).toBeGreaterThan(0);
    expect(POM.getAppointments().length).toBe(1);
  });

  it('should crop all-day appointment after horizontal scroll', async () => {
    const { scheduler, POM } = await createScheduler({
      ...config,
      groups: ['ownerId'],
      resources: [{
        fieldExpr: 'ownerId',
        dataSource: Array.from({ length: 10 }, (_, i) => ({ id: i, text: `Owner ${i}` })),
      }],
      dataSource: [{
        text: 'All week',
        ownerId: 0,
        startDate: new Date(2021, 2, 28),
        endDate: new Date(2021, 3, 3),
        allDay: true,
      }],
    });
    jest.useFakeTimers();

    scroll(scheduler, { left: 1000, top: 0 });
    const { cellCountInsideLeftVirtualCell } = getDispatcher(scheduler);
    const { left, width } = POM.getAppointment('All week').getGeometry();

    expect(cellCountInsideLeftVirtualCell).toBeGreaterThan(0);
    expect(left).toBe(cellCountInsideLeftVirtualCell * DEFAULT_CELL_WIDTH);
    expect(width).toBeLessThan(7 * DEFAULT_CELL_WIDTH);
  });
});
