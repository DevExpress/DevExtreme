import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Appointments:disable`
  .page(url(__dirname, '../../../container.html'));

test('Appointment popup should be readOnly if appointment is disabled', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(await takeScreenshot('disabled-appointments-in-grid.png'));

  await t.doubleClick(scheduler.getAppointment('A').element, { speed: 0.1 })
    .expect(await takeScreenshot('enabled-appointment.png'));
  await t.click(scheduler.appointmentPopup.cancelButton);

  await t.doubleClick(scheduler.getAppointment('B').element, { speed: 0.1 })
    .expect(await takeScreenshot('disabled-appointment.png'));
  await t.click(scheduler.appointmentPopup.cancelButton);

  await t.doubleClick(scheduler.getAppointment('C').element, { speed: 0.1 })
    .expect(await takeScreenshot('enabled-by-function-appointment.png'));
  await t.click(scheduler.appointmentPopup.cancelButton);

  await t.doubleClick(scheduler.getAppointment('D').element, { speed: 0.1 })
    .expect(await takeScreenshot('disabled-by-function-appointment.png'));
  await t.click(scheduler.appointmentPopup.cancelButton);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      disabled: true,
      text: 'A',
      startDate: new Date(2021, 4, 27, 0, 30),
      endDate: new Date(2021, 4, 27, 1),
      recurrenceRule: 'FREQ=DAILY',
    }, {
      disabled: false,
      text: 'B',
      startDate: new Date(2021, 4, 27, 1),
      endDate: new Date(2021, 4, 27, 1, 30),
      recurrenceRule: 'FREQ=DAILY',
    }, {
      disabled: () => false,
      text: 'C',
      startDate: new Date(2021, 4, 27, 1, 30),
      endDate: new Date(2021, 4, 27, 2),
      recurrenceRule: 'FREQ=DAILY',
    }, {
      disabled: () => true,
      text: 'D',
      startDate: new Date(2021, 4, 27, 2),
      endDate: new Date(2021, 4, 27, 2, 30),
      recurrenceRule: 'FREQ=DAILY',
    }],
    recurrenceEditMode: 'occurrence',
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 4, 27),
  }, true);
});
