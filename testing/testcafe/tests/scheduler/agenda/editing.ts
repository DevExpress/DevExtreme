import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture`Agenda:Editing`
  .page(url(__dirname, '../../container.html'));

test('It should be possible to delete an appointment', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.getAppointment('App 1').element, { speed: 0.1 })
    .click(scheduler.appointmentTooltip.deleteButton, { speed: 0.1 })
    .expect(scheduler.getAppointmentCount())
    .eql(3);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'App 1',
      startDate: new Date(2021, 1, 1, 12),
      endDate: new Date(2021, 1, 1, 13),
    }, {
      text: 'App 2',
      startDate: new Date(2021, 1, 2, 12),
      endDate: new Date(2021, 1, 2, 13),
    }, {
      text: 'App 3',
      startDate: new Date(2021, 1, 3, 12),
      endDate: new Date(2021, 1, 3, 13),
    }, {
      text: 'App 4',
      startDate: new Date(2021, 1, 4, 12),
      endDate: new Date(2021, 1, 4, 13),
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 1, 1),
    height: 600,
  }, true);
});
