import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const resourcesData = [...Array(20).keys()].map((num: number) => ({
  text: `Name ${num}`,
  id: num,
}));

test.describe('Scheduler: SmoothCellLines', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('The group panel and date table stay in sync during scrolling on material themes (T1146448)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      groups: ['ownerId'],
      currentDate: new Date(2021, 1, 2),
      resources: [{ fieldExpr: 'ownerId', dataSource: resourcesData, label: 'Owner' }],
      height: 600,
    });

    const scrollable = page.locator('.dx-scheduler-date-table-scrollable .dx-scrollable-container');
    await scrollable.evaluate((el) => { el.scrollTop = 1100; });

    await page.waitForTimeout(300);

    await testScreenshot(page, 'scrolling-vertical', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
