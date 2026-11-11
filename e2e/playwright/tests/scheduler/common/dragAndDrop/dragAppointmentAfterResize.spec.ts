import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

interface ClientMetrics {
  clientWidth: number;
  clientHeight: number;
  clientLeft: number;
  clientTop: number;
}

const getClientMetrics = (element: Locator): Promise<ClientMetrics> => element.evaluate((node) => ({
  clientWidth: node.clientWidth,
  clientHeight: node.clientHeight,
  clientLeft: node.clientLeft,
  clientTop: node.clientTop,
}));

test.describe('Drag-n-drop appointment after resize (T835545)', () => {
  ['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => test(`After drag-n-drop appointment, size of appointment shouldn't change in the '${view}' view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      startDayHour: 9,
      currentDate: new Date(2017, 4, 1),
      dataSource: [{
        text: 'app',
        startDate: new Date(2017, 4, 1, 9, 0),
        endDate: new Date(2017, 4, 1, 10, 0),
      }],
    });

    const scheduler = new Scheduler(page, '#container');
    const { element, resizableHandle } = scheduler.getAppointment('app');

    const initSize = await getClientMetrics(element);

    const isVertical = await resizableHandle.bottom.count() !== 0;

    await dragToOffset(page, isVertical ? resizableHandle.bottom : resizableHandle.right, 50, 50);

    await expect.poll(async () => {
      const { clientWidth, clientHeight } = await getClientMetrics(element);

      return isVertical ? clientHeight : clientWidth;
    }).toBeGreaterThan(isVertical ? initSize.clientHeight : initSize.clientWidth);

    const metricsBeforeDrag = await getClientMetrics(element);

    await dragToOffset(page, element, 10, 10, {
      offsetX: 0,
      offsetY: 0,
    });

    await expect.poll(() => getClientMetrics(element)).toEqual(metricsBeforeDrag);
  }));
});
