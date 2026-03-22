import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const defaultSchedulerOptions = {
  views: ['day'],
  dataSource: [],
  resources: [
    {
      fieldExpr: 'resourceId',
      dataSource: [
        { id: 0, color: '#e01e38' },
        { id: 1, color: '#f98322' },
        { id: 2, color: '#1e65e8' },
      ],
      label: 'Color',
    },
  ],
  width: 1666,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
};

test.describe('Drag-n-drop appointment after resize (T835545)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
    test(`After drag-n-drop appointment, size of appointment shouldn't change in the '${view}' view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        ...defaultSchedulerOptions,
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

      const element = page.locator('.dx-scheduler-appointment').filter({ hasText: 'app' });

      const initSize = await element.evaluate((el) => ({
        width: el.clientWidth,
        height: el.clientHeight,
      }));

      const bottomHandle = element.locator('.dx-resizable-handle-bottom');
      const rightHandle = element.locator('.dx-resizable-handle-right');
      const isVertical = await bottomHandle.count() > 0;

      const handle = isVertical ? bottomHandle : rightHandle;
      const handleBox = await handle.boundingBox();
      await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 50, handleBox!.y + handleBox!.height / 2 + 50, { steps: 5 });
      await page.mouse.up();

      const sizeAfterResize = await element.evaluate((el) => ({
        width: el.clientWidth,
        height: el.clientHeight,
      }));

      if (isVertical) {
        expect(sizeAfterResize.height).toBeGreaterThan(initSize.height);
      } else {
        expect(sizeAfterResize.width).toBeGreaterThan(initSize.width);
      }

      const sizeBeforeDrag = await element.evaluate((el) => ({
        width: el.clientWidth,
        height: el.clientHeight,
      }));
      const positionBeforeDrag = await element.evaluate((el) => ({
        left: el.clientLeft,
        top: el.clientTop,
      }));

      const box = await element.boundingBox();
      await page.mouse.move(box!.x, box!.y);
      await page.mouse.down();
      await page.mouse.move(box!.x + 10, box!.y + 10, { steps: 5 });
      await page.mouse.up();

      const sizeAfterDrag = await element.evaluate((el) => ({
        width: el.clientWidth,
        height: el.clientHeight,
      }));
      const positionAfterDrag = await element.evaluate((el) => ({
        left: el.clientLeft,
        top: el.clientTop,
      }));

      expect(sizeBeforeDrag.width).toBe(sizeAfterDrag.width);
      expect(sizeBeforeDrag.height).toBe(sizeAfterDrag.height);
      expect(positionBeforeDrag.left).toBe(positionAfterDrag.left);
      expect(positionBeforeDrag.top).toBe(positionAfterDrag.top);
    });
  });
});
