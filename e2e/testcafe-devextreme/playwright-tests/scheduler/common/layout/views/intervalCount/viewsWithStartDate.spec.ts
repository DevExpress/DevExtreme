import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Layout: Views: IntervalCount with StartDate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

[{
  view: 'timelineDay',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 4, 8),
  intervalCount: 6,
}, {
  view: 'week',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'timelineWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'workWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'timelineWorkWeek',
  currentDate: new Date(2021, 4, 11),
  startDate: new Date(2021, 3, 12),
  intervalCount: 8,
}, {
  view: 'month',
  currentDate: new Date(2020, 5, 11),
  startDate: new Date(2020, 3, 8),
  intervalCount: 6,
}, {
  view: 'timelineMonth',
  currentDate: new Date(2020, 5, 11),
  startDate: new Date(2020, 3, 8),
  intervalCount: 6,
}].forEach(({
  view, currentDate, startDate, intervalCount,
}) => {
  test(`startDate should work in ${view} view`, async ({ page }) => {
    // Scheduler on '#container'

        await testScreenshot(page, `start-date-in-${view}.png`);

    await (page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0).dblclick());

    await testScreenshot(page, `start-date-in-${view}-with-form.png`);

    expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget(page, 'dxScheduler', {
    views: [{
      type: view,
      intervalCount,
      startDate,
    }],
    currentView: view,
    currentDate,
    dataSource: [],
    crossScrollingEnabled: true,
  }));
});

[{
  view: 'week',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'timelineWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'workWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}, {
  view: 'timelineWorkWeek',
  currentDate: new Date(2020, 9, 6),
  startDate: new Date(2020, 8, 16),
  intervalCount: 3,
}].forEach(({
  view, currentDate, startDate, intervalCount,
}) => {
  test(`startDate should work in ${view} view when it indicates the same week as the start as currentDate`, async ({ page }) => {
        await testScreenshot(page, `complex-start-date-in-${view}.png`);

    expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget(page, 'dxScheduler', {
    views: [{
      type: view,
      intervalCount,
      startDate,
    }],
    currentView: view,
    currentDate,
    dataSource: [],
    crossScrollingEnabled: true,
  }));
});
});
