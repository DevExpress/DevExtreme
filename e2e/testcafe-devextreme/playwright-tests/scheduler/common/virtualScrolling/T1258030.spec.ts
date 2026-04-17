import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

async function scrollTo(page, x: number, y: number): Promise<void> {
  await page.evaluate(({ sx, sy }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    const scrollable = instance.getWorkSpaceScrollable();
    scrollable.scrollTo({ y: sy, x: sx });
  }, { sx: x, sy: y });
}

test.describe('Scheduler: Virtual scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should render recurrence appointment with correct width in month timeline view for virtual scrolling', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      height: 300,
      currentView: 'timelineMonth',
      views: ['timelineMonth'],
      currentDate: new Date(2024, 9, 1),
      dataSource: [{
        text: 'appointment',
        startDate: new Date(2024, 9, 1),
        endDate: new Date(2024, 9, 2),
        recurrenceRule: 'FREQ=DAILY',
      }],
      scrolling: { mode: 'virtual' },
    });

    await scrollTo(page, 3000, 0);

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, 'virtual_scroll_timeline_3000.png', { element: workSpace });
  });
});
