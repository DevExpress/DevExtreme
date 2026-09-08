import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

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

  const scheduler = new Scheduler(page, '#container');

  await scheduler.scrollWorkSpaceTo({ left: 3000, top: 0 });

  await testScreenshot(page, 'virtual_scroll_timeline_3000.png', { element: scheduler.workSpace });
});
