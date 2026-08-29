import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

test('Scheduler a11y: Insufficient contrast of day numbers in the MonthView', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'month_day_number_contrast.png', { element: scheduler.element });
});
