import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test('Selection should work correctly with all-day panel appointments', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 11, 9),
    dataSource: [{
      startDate: new Date(2021, 11, 9),
      endDate: new Date(2021, 11, 9),
      allDay: true,
      text: 'Appointment',
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.getAppointment('Appointment').element.click();
  await scheduler.getDateTableCell(0, 0).click();

  await expect(scheduler.getSelectedCells()).toHaveCount(1);
});
