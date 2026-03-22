import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

const resourceDataSource = [{
  fieldExpr: 'priorityId',
  dataSource: [
    { text: 'Low Priority', id: 0, color: '#24ff50' },
    { text: 'High Priority', id: 1, color: '#ff9747' },
  ],
  label: 'Priority',
}];

const createDataSetForScreenShotTests = (): Record<string, unknown>[] => {
  const result: any[] = [];
  for (let day = 1; day < 25; day++) {
    result.push({
      text: '1 appointment', startDate: new Date(2020, 6, day, 0),
      endDate: new Date(2020, 6, day, 1), priorityId: 0,
    });
    result.push({
      text: '2 appointment', startDate: new Date(2020, 6, day, 1),
      endDate: new Date(2020, 6, day, 2), priorityId: 1,
    });
    result.push({
      text: '3 appointment', startDate: new Date(2020, 6, day, 3),
      endDate: new Date(2020, 6, day, 5), allDay: true, priorityId: 0,
    });
  }
  return result;
};

test.describe('Scheduler: Resources layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [undefined, resourceDataSource].forEach((resourcesValue) => {
    ['agenda', 'day', 'week', 'month', 'workWeek'].forEach((view) => {
      test(`Base views layout test with resources(view='${view}'), resource=${!!resourcesValue}`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          views: [view],
          currentView: view,
          resources: resourcesValue,
          height: 600,
        });

        await page.locator('.dx-scheduler-header').click();
        await page.locator('.dx-scheduler-appointment').filter({ hasText: '1 appointment' }).first().click();
        await expect(page.locator('.dx-tooltip-appointment-item')).toBeVisible();

        await testScreenshot(page, `resource(view=${view}-resource=${!!resourcesValue}).png`);
      });
    });
  });

  [undefined, resourceDataSource].forEach((resourcesValue) => {
    ['timelineDay', 'timelineWeek', 'timelineMonth', 'timelineWorkWeek'].forEach((view) => {
      test(`Timeline views layout test with resources(view='${view}'), resource=${!!resourcesValue}`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: createDataSetForScreenShotTests(),
          currentDate: new Date(2020, 6, 15),
          views: [view],
          currentView: view,
          resources: resourcesValue,
          height: 600,
        });

        await page.locator('.dx-scheduler-header').click();
        await page.locator('.dx-scheduler-appointment').filter({ hasText: '1 appointment' }).first().click();
        await expect(page.locator('.dx-tooltip-appointment-item')).toBeVisible();

        await testScreenshot(page, `resource(view=${view}-resource=${!!resourcesValue}).png`);
      });
    });
  });

  test('Scheduler should have correct height in month view (T927862)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['month'],
      currentView: 'month',
      height: 800,
    });

    const result = await page.evaluate(() => {
      const dateTable = document.querySelector('.dx-scheduler-date-table');
      const scrollable = document.querySelector('.dx-scheduler-date-table-scrollable');
      if (!dateTable || !scrollable) return { match: false };
      const dtRect = dateTable.getBoundingClientRect();
      const scRect = scrollable.getBoundingClientRect();
      return { match: Math.abs(dtRect.bottom - scRect.bottom) < 1 };
    });

    expect(result.match).toBeTruthy();
  });
});
