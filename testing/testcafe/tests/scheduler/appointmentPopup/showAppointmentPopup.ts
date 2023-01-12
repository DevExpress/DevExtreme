import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Timeline Appointments`
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
}, true));
