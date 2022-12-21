import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';

fixture.disablePageReloads`Appointment dependend options`
  .page(url(__dirname, '../../container.html'));

test('cellDuration (T1076138)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('test-appt');

  await scheduler.option('cellDuration', 30);

  await t
    .expect(appointment.element.clientHeight)
    .within(132, 133);
}).before(async () => createWidget('dxScheduler', {
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
}));
