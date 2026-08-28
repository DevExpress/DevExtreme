import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

test('View switching should work for empty agenda', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      startDate: new Date(2021, 4, 25, 0),
      endDate: new Date(2021, 4, 25, 1),
      text: 'Test Appointment',
    }],
    views: ['day', 'agenda'],
    currentView: 'day',
    currentDate: new Date(2021, 4, 25),
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.option('currentDate', new Date(2021, 4, 26));
  await scheduler.option('currentView', 'agenda');

  await testScreenshot(page, 'switch-to-agenda-without-appointments.png');
});
