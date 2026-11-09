import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test.describe('Appointment dependend options', () => {
  test.use({ theme: 'generic.light' });

  test('cellDuration (T1076138)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'test-appt',
        startDate: new Date(2021, 3, 27, 10),
        endDate: new Date(2021, 3, 27, 11, 20),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      endDayHour: 18,
      width: 600,
      height: 600,
      cellDuration: 20,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('test-appt');
    const getClientHeight = () => appointment.element.evaluate((node) => node.clientHeight);

    await scheduler.option('cellDuration', 30);

    await expect.poll(getClientHeight).toBeGreaterThanOrEqual(132);
    await expect.poll(getClientHeight).toBeLessThanOrEqual(133);
  });
});
