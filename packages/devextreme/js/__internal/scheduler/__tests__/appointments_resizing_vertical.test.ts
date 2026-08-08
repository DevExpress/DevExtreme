import {
  beforeEach, describe, expect, it,
} from '@jest/globals';
import type { Properties } from '@js/ui/scheduler';

import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const APPOINTMENT_SELECTOR = '.dx-scheduler-appointment';
const HANDLE_TOP_SELECTOR = '.dx-resizable-handle-top';
const HANDLE_BOTTOM_SELECTOR = '.dx-resizable-handle-bottom';

const getResizeHandles = (container: HTMLElement): string[][] => Array
  .from(container.querySelectorAll(APPOINTMENT_SELECTOR))
  .map((part) => [
    ...(part.querySelector(HANDLE_TOP_SELECTOR) ? ['top'] : []),
    ...(part.querySelector(HANDLE_BOTTOM_SELECTOR) ? ['bottom'] : []),
  ]);

const baseConfig: Properties = {
  currentDate: new Date(2021, 3, 12),
  views: ['week'],
  currentView: 'week',
  editing: { allowUpdating: true, allowResizing: true },
  height: 600,
};

describe('Appointments resizing in vertical views', () => {
  beforeEach(() => {
    setupSchedulerTestEnvironment();
  });

  it('should render both resize handles on an appointment that is not split', async () => {
    const { container } = await createScheduler({
      ...baseConfig,
      dataSource: [{
        text: 'Short',
        startDate: new Date(2021, 3, 12, 9),
        endDate: new Date(2021, 3, 12, 11),
      }],
    });

    expect(getResizeHandles(container)).toEqual([['top', 'bottom']]);
  });

  it('should render resize handles only on the edges of an appointment split by midnight', async () => {
    const { container } = await createScheduler({
      ...baseConfig,
      dataSource: [{
        text: 'Long',
        startDate: new Date(2021, 3, 12, 22),
        endDate: new Date(2021, 3, 13, 3),
      }],
    });

    expect(getResizeHandles(container)).toEqual([['top'], ['bottom']]);
  });

  it('should render resize handles only on the edges of an all day appointment when the all day panel is hidden', async () => {
    const { container } = await createScheduler({
      ...baseConfig,
      allDayPanelMode: 'hidden',
      dataSource: [{
        text: 'All day',
        allDay: true,
        startDate: new Date(2021, 3, 12, 5),
        endDate: new Date(2021, 3, 13, 5),
      }],
    });

    expect(getResizeHandles(container)).toEqual([['top'], [], ['bottom']]);
  });
});
