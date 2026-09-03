import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

test('Header cells should be aligned with date-table cells in timeline-month when current date changes', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2020, 10, 1),
    currentView: 'timelineMonth',
    height: 600,
    views: ['timelineMonth'],
    crossScrollingEnabled: true,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('currentDate', new Date(2020, 11, 1));

  await testScreenshot(page, 'timeline-month-change-current-date.png');
});
