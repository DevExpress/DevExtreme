import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('appointmentTooltipTemplate layout should be rendered right', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      startDate: new Date(2017, 4, 25, 0, 30),
      endDate: new Date(2017, 4, 25, 2, 30),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2017, 4, 25),
    appointmentTooltipTemplate: (appointment) => {
      const result = $('<div  style=\'display: flex; flex-wrap: wrap;\' />');

      const startDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.startDate,
      });

      const endDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.endDate,
      });

      result.append(startDateBox, endDateBox);

      return result;
    },
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.getAppointmentByIndex().element.click();

  await testScreenshot(
    page,
    'appointment-tooltip-template.png',
    { element: scheduler.element },
  );
});
