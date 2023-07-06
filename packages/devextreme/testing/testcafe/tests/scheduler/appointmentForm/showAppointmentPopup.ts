import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Form`
  .page(url(__dirname, '../../container.html'));

const showAppointmentPopup = ClientFunction(() => {
  const instance = ($('#container') as any).dxScheduler('instance');
  instance.showAppointmentPopup();
});

test('Invoke showAppointmentPopup method shouldn\'t raise error if value of currentDate property as a string', async (t) => {
  const scheduler = new Scheduler('#container');

  await showAppointmentPopup();

  await t.expect(scheduler.appointmentPopup.startDateElement.value)
    .eql('3/25/2021, 12:00 AM');

  await t.expect(scheduler.appointmentPopup.endDateElement.value)
    .eql('3/25/2021, 12:30 AM');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 25).toISOString(),
  height: 600,
}));

test('Show appointment popup if deffereRendering is false (T1069753)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointmentByIndex(0);

  await t
    .doubleClick(appointment.element)
    .expect(scheduler.appointmentPopup.isVisible)
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
