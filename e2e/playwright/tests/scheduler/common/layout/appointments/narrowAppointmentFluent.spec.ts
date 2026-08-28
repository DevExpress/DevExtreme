import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import Scheduler from '../../../../../models/scheduler';

test('Very narrow appointment in horizontal timeline should hide the appointment strip in Fluent theme', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2016, 1, 2),
    dataSource: [
      {
        text: 'short',
        startDate: new Date(2016, 1, 2, 12, 0),
        endDate: new Date(2016, 1, 2, 12, 1),
      },
    ],
    views: ['timelineWeek'],
    currentView: 'timelineWeek',
    maxAppointmentsPerCell: 'unlimited',
    height: 505,
    width: 800,
    startDayHour: 8,
    endDayHour: 20,
    cellDuration: 60,
    firstDayOfWeek: 0,
  });

  const scheduler = new Scheduler(page, '#container');
  const strip = scheduler
    .getAppointment('short')
    .element.locator('.dx-scheduler-appointment-strip');

  await expect(strip).toBeAttached();
  await expect(strip).toHaveCSS('display', 'none');
});
