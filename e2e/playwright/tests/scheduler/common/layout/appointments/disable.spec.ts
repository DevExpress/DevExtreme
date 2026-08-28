import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('Appointment popup should be readOnly if appointment is disabled', async ({ page }) => {
  const dailyRecurrenceRule = 'FREQ=DAILY;UNTIL=20210615T205959Z';
  const weeklyRecurrenceRule = 'FREQ=WEEKLY;UNTIL=20210615T205959Z';

  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      disabled: true,
      text: 'A',
      startDate: new Date(2021, 4, 27, 0, 30),
      endDate: new Date(2021, 4, 27, 1),
      recurrenceRule: dailyRecurrenceRule,
    }, {
      disabled: false,
      text: 'B',
      startDate: new Date(2021, 4, 27, 1),
      endDate: new Date(2021, 4, 27, 1, 30),
      recurrenceRule: dailyRecurrenceRule,
    }, {
      disabled: () => true,
      text: 'C',
      startDate: new Date(2021, 4, 27, 1, 30),
      endDate: new Date(2021, 4, 27, 2),
      recurrenceRule: weeklyRecurrenceRule,
    }, {
      disabled: () => false,
      text: 'D',
      startDate: new Date(2021, 4, 27, 2),
      endDate: new Date(2021, 4, 27, 2, 30),
      recurrenceRule: weeklyRecurrenceRule,
    }],
    recurrenceEditMode: 'series',
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 4, 27),
  });

  const scheduler = new Scheduler(page, '#container');
  const { appointmentPopup } = scheduler;

  await testScreenshot(page, 'disabled-appointments-in-grid.png');

  // The appointment under test is disabled, so Playwright would wait for it to become actionable
  // for ever; TestCafe pressed it regardless, and the point of the test is what happens then.
  await scheduler.getAppointment('A', 0).element.click({ force: true });
  await scheduler.appointmentTooltip.getListItem('A').element.click();

  await testScreenshot(page, 'disabled-appointment.png', { element: appointmentPopup.contentElement });

  await appointmentPopup.cancelButton.element.click();

  await scheduler.getAppointment('B').element.click({ force: true });
  await scheduler.appointmentTooltip.getListItem('B').element.click();

  await testScreenshot(page, 'enabled-appointment.png', { element: appointmentPopup.contentElement });

  await appointmentPopup.cancelButton.element.click();

  await scheduler.getAppointment('C').element.click({ force: true });
  await scheduler.appointmentTooltip.getListItem('C').element.click();

  await testScreenshot(page, 'disabled-by-function-appointment.png', {
    element: appointmentPopup.contentElement,
  });

  await appointmentPopup.cancelButton.element.click();

  await scheduler.getAppointment('D').element.click({ force: true });
  await scheduler.appointmentTooltip.getListItem('D').element.click();

  await testScreenshot(page, 'enabled-by-function-appointment.png', {
    element: appointmentPopup.contentElement,
  });

  await appointmentPopup.cancelButton.element.click();
});
