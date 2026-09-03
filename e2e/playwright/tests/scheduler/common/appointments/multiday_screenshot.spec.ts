import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

[
  'week',
  'month',
  'timelineMonth',
].forEach((currentView) => {
  test(`it should not cut multiday appointment in ${currentView} view`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      width: 900,
      height: 400,
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 28, 8),
        endDate: new Date(2021, 3, 4, 8),
      }],
      views: ['week', 'month', 'timelineMonth'],
      currentView,
      currentDate: new Date(2021, 3, 4),
      startDayHour: 12,
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(page, `multiday-appointment_${currentView}.png`, {
      element: scheduler.element,
    });
  });
});
