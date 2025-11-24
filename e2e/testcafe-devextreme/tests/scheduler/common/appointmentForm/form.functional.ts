import Scheduler from 'devextreme-testcafe-models/scheduler';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Form: functional tests`
  .page(url(__dirname, '../../../container.html'));

test('Appointment popup can be opened by double click', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element());
  await t.expect(scheduler.appointmentPopup.popup.isVisible()).ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Install New Router in Dev Room',
      startDate: new Date('2021-03-29T21:30:00.000Z'),
      endDate: new Date('2021-03-29T22:30:00.000Z'),
      recurrenceRule: 'FREQ=DAILY',
    }],
    recurrenceEditMode: 'series',
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
  });
});

test('Appointment popup is opened if deferRendering is false (T1069753)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointmentByIndex(0);

  await t
    .doubleClick(appointment.element)
    .expect(scheduler.appointmentPopup.popup.isVisible())
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).DevExpress.ui.dxPopup.defaultOptions({
      options: {
        deferRendering: false,
      },
    });
  })();

  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'Test',
      startDate: new Date(2021, 2, 29, 10),
      endDate: new Date(2021, 2, 29, 11),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 29),
    startDayHour: 9,
    endDayHour: 12,
    width: 400,
  });
});
