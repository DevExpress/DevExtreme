import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test('Tooltip\'s date should be equal to date of current appointment(T1037028)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2021, 1, 1, 12),
      endDate: new Date(2021, 1, 1, 13),
      recurrenceRule: 'FREQ=HOURLY;COUNT=5',
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 1, 1),
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');
  const appointmentName = 'Text';

  for (let index = 0; index < 5; index += 1) {
    await scheduler.hideAppointmentTooltip();

    await scheduler.getAppointment(appointmentName, index).element.click();

    const tooltipDate = await scheduler.appointmentTooltip
      .getListItem(appointmentName, 0).date.innerText();
    const expectedDate = await scheduler
      .getAppointment(appointmentName, index).date.time.innerText();

    expect(tooltipDate).toBe(expectedDate);
  }
});
