import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

interface ClientBox {
  width: number;
  height: number;
  left: number;
  top: number;
}

const clientBoxOf = (element: Locator): Promise<ClientBox> => element.evaluate((node) => ({
  width: node.clientWidth,
  height: node.clientHeight,
  left: node.clientLeft,
  top: node.clientTop,
}));

['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
  test(`After drag-n-drop appointment, size of appointment shouldn't change in the '${view}' view`, async ({ page }) => {
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

    const initSize = await clientBoxOf(element);
    const isVertical = await resizableHandle.bottom.count() !== 0;

    await dragToOffset(page, isVertical ? resizableHandle.bottom : resizableHandle.right, 50, 50);

    await expect
      .poll(async () => {
        const box = await clientBoxOf(element);

        return isVertical ? box.height : box.width;
      })
      .toBeGreaterThan(isVertical ? initSize.height : initSize.width);

    const boxBeforeDrag = await clientBoxOf(element);

    await dragToOffset(page, element, 10, 10, { offsetX: 0, offsetY: 0 });

    const boxAfterDrag = await clientBoxOf(element);

    expect(boxAfterDrag.width).toBe(boxBeforeDrag.width);
    expect(boxAfterDrag.height).toBe(boxBeforeDrag.height);
    expect(boxAfterDrag.left).toBe(boxBeforeDrag.left);
    expect(boxAfterDrag.top).toBe(boxBeforeDrag.top);
  });
});
