import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';

fixture`Appointment Overflow Indicator`
  .page(url(__dirname, '../../container.html'));

test('Many grouped allDay dropDown appts should be grouped correctly (T489535)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.collectors.get(0).element)
    .expect(scheduler.appointmentTooltip.isVisible)
    .ok()
    .expect(scheduler.appointmentTooltip.getAppointmentCount())
    .eql(3);

  await t
    .click(scheduler.collectors.get(1).element)
    .expect(scheduler.appointmentTooltip.isVisible)
    .ok()
    .expect(scheduler.appointmentTooltip.getAppointmentCount())
    .eql(3);
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2015, 4, 25),
  views: ['week'],
  currentView: 'week',
  groups: ['ownerId'],
  dataSource: [
    {
      text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1,
    },
    {
      text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1,
    },
    {
      text: '3', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1,
    },
    {
      text: '4', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1,
    },
    {
      text: '5', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 1,
    },
    {
      text: '6', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2,
    },
    {
      text: '7', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2,
    },
    {
      text: '8', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2,
    },
    {
      text: '9', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2,
    },
    {
      text: '10', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 25, 1), allDay: true, ownerId: 2,
    },
  ],
  resources: [
    {
      field: 'ownerId',
      dataSource: [
        { id: 1, text: 'one' },
        { id: 2, text: 'two' },
      ],
    },
  ],
}));
