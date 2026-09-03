import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

test('Week view without all-day panel should be rendered correctly', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentDate: new Date(2020, 6, 15),
    views: ['week'],
    currentView: 'week',
    height: 500,
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(page, 'week-without-all-day-panel.png', {
    element: scheduler.workSpace,
  });
});
