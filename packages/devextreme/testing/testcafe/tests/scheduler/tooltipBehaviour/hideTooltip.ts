import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Hide tooltip`
  .page(url(__dirname, '../../container.html'));

test('Appointment tooltip should be hidden when drag is started', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Test');

  await t
    .click(appointment.element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();

  await t
    .dragToElement(appointment.element, scheduler.getDateTableCell(4, 0))
    .expect(scheduler.appointmentTooltip.isVisible())
    .notOk();
}).before(async () => createWidget('dxScheduler', {
  views: ['day'],
  currentDate: new Date(2021, 3, 26),
  startDayHour: 9,
  height: 600,
  dataSource: [{
    text: 'Test',
    startDate: new Date(2021, 3, 26, 9),
    endDate: new Date(2021, 3, 26, 9, 30),
  }],
}));
