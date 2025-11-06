import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`Layout:Appointments:disable`
  .page(url(__dirname, '../../../../container.html'));

test('Appointment popup should be readOnly if appointment is disabled', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const { appointmentPopup } = scheduler;

  await testScreenshot(t, takeScreenshot, 'disabled-appointments-in-grid.png');

  await t.click(scheduler.getAppointment('A', 0).element)
    .click(scheduler.appointmentTooltip.getListItem('A').element);

  await testScreenshot(t, takeScreenshot, 'disabled-appointment.png', { element: appointmentPopup.contentElement });

  await t.click(appointmentPopup.cancelButton.element);

  await t.click(scheduler.getAppointment('B').element)
    .click(scheduler.appointmentTooltip.getListItem('B').element);

  await testScreenshot(t, takeScreenshot, 'enabled-appointment.png', { element: appointmentPopup.contentElement });

  await t.click(appointmentPopup.cancelButton.element);

  await t.click(scheduler.getAppointment('C').element)
    .click(scheduler.appointmentTooltip.getListItem('C').element);

  await testScreenshot(t, takeScreenshot, 'disabled-by-function-appointment.png', {
    element: appointmentPopup.contentElement,
  });

  await t.click(appointmentPopup.cancelButton.element);

  await t.click(scheduler.getAppointment('D').element)
    .click(scheduler.appointmentTooltip.getListItem('D').element);

  await testScreenshot(t, takeScreenshot, 'enabled-by-function-appointment.png', {
    element: appointmentPopup.contentElement,
  });

  await t.click(appointmentPopup.cancelButton.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dailyRecurrenceRule = 'FREQ=DAILY;UNTIL=20210615T205959Z';
  const weeklyRecurrenceRule = 'FREQ=WEEKLY;UNTIL=20210615T205959Z';

  await createWidget('dxScheduler', {
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
});
