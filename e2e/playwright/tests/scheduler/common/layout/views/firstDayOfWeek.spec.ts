import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('WorkWeek should generate correct start view date', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: ['workWeek'],
    currentView: 'workWeek',
    firstDayOfWeek: 1,
    currentDate: new Date(2021, 11, 12),
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'work-week-first-day-of-week.png', {
    element: scheduler.element,
  });
});
