import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

test('Interval count: 1, February of 2021', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: [{
      type: 'month',
      intervalCount: 1,
    }],
    currentView: 'month',
    firstDayOfWeek: 1,
    currentDate: new Date(2021, 1, 1),
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'month-february-2021.png', { element: scheduler.workSpace });
});

test('Interval count: 12', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: [{
      type: 'month',
      intervalCount: 12,
    }],
    height: 600,
    currentView: 'month',
    currentDate: new Date(2023, 6, 1),
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.scrollTo(new Date(2024, 6, 1)); // scroll to last row

  await testScreenshot(page, 'month-interval-count-12.png', { element: scheduler.workSpace });
});
