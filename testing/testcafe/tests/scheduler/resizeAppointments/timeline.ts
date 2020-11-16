import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Resize appointments in the Scheduler basic views`
  .page(url(__dirname, '../../container.html'));

['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => test(`Resize in the "${view}" view`, async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .drag(resizableAppointment.resizableHandle.right, 400, 0)
    .expect(resizableAppointment.size.width).eql('800px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 12:00 PM')

    .drag(resizableAppointment.resizableHandle.left, 400, 0)
    .expect(resizableAppointment.size.width)
    .eql('400px')
    .expect(resizableAppointment.date.time)
    .eql('11:00 AM - 12:00 PM')

    .drag(resizableAppointment.resizableHandle.left, -400, 0)
    .expect(resizableAppointment.size.width)
    .eql('800px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 12:00 PM')

    .drag(resizableAppointment.resizableHandle.right, -400, 0)
    .expect(resizableAppointment.size.width)
    .eql('400px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 11:00 AM');
}).before(() => createScheduler({
  views: [view],
  currentView: view,
  dataSource,
})));

test('Resize in the "timelineMonth" view', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .drag(resizableAppointment.resizableHandle.right, 400, 0)
    .expect(resizableAppointment.size.width).eql('600px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 11:00 AM')

    .drag(resizableAppointment.resizableHandle.left, 400, 0)
    .expect(resizableAppointment.size.width)
    .eql('200px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 11:00 AM')

    .drag(resizableAppointment.resizableHandle.left, -400, 0)
    .expect(resizableAppointment.size.width)
    .eql('600px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 11:00 AM')

    .drag(resizableAppointment.resizableHandle.right, -400, 0)
    .expect(resizableAppointment.size.width)
    .eql('200px')
    .expect(resizableAppointment.date.time)
    .eql('10:00 AM - 11:00 AM');
}).before(() => createScheduler({
  views: ['timelineMonth'],
  currentView: 'timelineMonth',
  dataSource,
}));

test('Resize appointment on timelineWeek view with custom startDayHour & endDayHour (T804779)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Appointment');

  await t
    .resizeWindow(1400, 800)
    .drag(appointment.resizableHandle.right, -400, 0)
    .expect(appointment.size.width).eql('200px')
    .expect(appointment.date.time)
    .eql('2:00 PM - 3:00 PM');
}).before(() => createScheduler({
  views: [{
    type: 'timelineWeek', startDayHour: 10, endDayHour: 16, cellDuration: 60,
  }],
  currentView: 'timelineWeek',
  currentDate: new Date(2019, 8, 1),
  firstDayOfWeek: 0,
  dataSource: [{
    text: 'Appointment',
    startDate: new Date(2019, 8, 1, 14),
    endDate: new Date(2019, 8, 2, 11),
  }],
}));

// T948164
test('Resize should work correctly when cell\'s width is not an integer', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Appointment');

  await t
    .drag(appointment.resizableHandle.right, 100, 0)
    .expect(appointment.date.time)
    .eql('12:00 AM - 4:00 AM');
}).before(() => createScheduler({
  views: [{
    type: 'timelineDay',
    cellDuration: 120,
  }],
  currentView: 'timelineDay',
  currentDate: new Date(2020, 10, 13),
  dataSource: [{
    text: 'Appointment',
    startDate: new Date(2020, 10, 13, 0, 0),
    endDate: new Date(2020, 10, 13, 2, 0),
  }],
  width: 2999, // Cell's width in this case will not be an integer
  startDayHour: 0,
  endDayHour: 24,
}));
