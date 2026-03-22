import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler: Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

resources,
  createDataSetForScreenShotTests,
  views,
  horizontalViews,
  scrollConfig,
  groupedByDateViews,
} from './utils';

);

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2021, 0, 1),
    height: 600,
    resources,
    views,
    currentView: 'day',
    scrolling: { mode: 'virtual' },
    startDayHour: 0,
    endDayHour: 3,
    ...additionalProps,
  });
};

test('Virtual scrolling layout in scheduler views', async ({ page }) => {
  // --- setup ---
await createScheduler({
  // --- test ---
// Scheduler on '#container'

    // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);
    await scrollToDate(scrollConfig[i].firstDate);

    await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll.png`);

    await scrollToDate(scrollConfig[i].lastDate);

    await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll.png`);
  }

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled', async ({ page }) => {
  // --- setup ---
await createScheduler({
    views: horizontalViews,
    groups: ['resourceId'],
  // --- test ---
// Scheduler on '#container'

    // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);
    await scrollToDate(scrollConfig[i].firstDate, { resourceId: 6 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll-horizontal-grouping.png`);

    await scrollToDate(scrollConfig[i].lastDate, { resourceId: 0 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll-horizontal-grouping.png`);
  }

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});

test('Virtual scrolling layout in scheduler views when grouping by date is enabled', async ({ page }) => {
  // --- setup ---
await createScheduler({
    views: groupedByDateViews,
    groups: ['resourceId'],
  // --- test ---
// Scheduler on '#container'

    // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await scrollToDate(scrollConfig[i].firstDate, { resourceId: 3 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-after-scroll-grouping-by-date.png`);

    await scrollToDate(scrollConfig[i].lastDate, { resourceId: 0 });

    await testScreenshot(page, `virtual-scrolling-${view.type}-before-scroll-grouping-by-date.png`);
  }

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});

test('Header cells should be aligned with date-table cells in timeline-month when current date changes and virtual scrolling is used', async ({ page }) => {
  // --- setup ---
await createScheduler({
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
  // --- test ---
  // Scheduler on '#container'

  await scheduler.option('currentDate', new Date(2020, 11, 1));

  await testScreenshot(page, 'virtual-scrolling-timeline-month-change-current-date-virtual.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
