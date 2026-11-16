import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

test.describe('Hide tooltip', () => {
  test('Appointment tooltip should be hidden when drag is started', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['day'],
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      height: 600,
      dataSource: [{
        text: 'Test',
        startDate: new Date(2021, 3, 26, 9),
        endDate: new Date(2021, 3, 26, 9, 30),
      }],
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Test');

    await appointment.element.click();
    await scheduler.appointmentTooltip.expectVisible(true);

    await dragToElement(page, appointment.element, scheduler.getDateTableCell(4, 0));
    await scheduler.appointmentTooltip.expectVisible(false);
  });
});
