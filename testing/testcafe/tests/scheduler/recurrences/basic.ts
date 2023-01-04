import { compareScreenshot } from 'devextreme-screenshot-comparer';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Rendering of the recurrence appointments in  Scheduler `
  .page(url(__dirname, '../../container.html'));

test('Drag-n-drop recurrence appointment between dateTable and allDay panel', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Simple recurrence appointment');

  await t.expect(await compareScreenshot(t, 'basic-recurrence-appointment-init.png')).ok();

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(0))
    .expect(scheduler.getAppointmentCount()).eql(7);

  await t
    .wait(500)
    .expect((await scheduler.getAppointment('Simple recurrence appointment').element.boundingClientRect).width)
    .eql(114)
    .expect(draggableAppointment.isAllDay)
    .ok();

  await t.expect(await compareScreenshot(t, 'basic-recurrence-appointment-after-drag.png')).ok();
}).before(async () => createScheduler({
  dataSource,
  startDayHour: 1,
  recurrenceEditMode: 'series',
}));

test('Appointments in DST should not have offset when '
  + 'recurring appointment timezoine not equal to scheduler timezone', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentByIndex(0).date.time)
    .eql('2:00 PM - 2:30 PM')

    .expect(scheduler.getAppointmentByIndex(1).date.time)
    .eql('2:00 PM - 2:30 PM');

  await scheduler.option('currentDate', new Date(2021, 10, 1));

  await t
    .expect(scheduler.getAppointmentByIndex(0).date.time)
    .eql('2:00 PM - 2:30 PM')

    .expect(scheduler.getAppointmentByIndex(1).date.time)
    .eql('2:00 PM - 2:30 PM');
}).before(async () => createScheduler({
  timeZone: 'America/New_York',
  dataSource: [
    {
      text: 'Recurrence',
      startDate: new Date('2021-03-13T19:00:00.000Z'),
      endDate: new Date('2021-03-13T19:30:00.000Z'),
      recurrenceRule: 'FREQ=DAILY;COUNT=1000',
      startDateTimeZone: 'America/New_York',
      endDateTimeZone: 'America/New_York',
    },
  ],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 2, 13),
  firstDayOfWeek: 1,
}));

test('Appointments in end of DST should have correct offset', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentByIndex(5).date.time)
    .eql('11:00 AM - 11:30 AM')

    .expect(scheduler.getAppointmentByIndex(6).date.time)
    .eql('12:00 PM - 12:30 PM');
}).before(async () => createScheduler({
  timeZone: 'America/Phoenix',
  dataSource: [
    {
      text: 'Recurrence',
      startDate: new Date('2021-03-13T19:00:00.000Z'),
      endDate: new Date('2021-03-13T19:30:00.000Z'),
      recurrenceRule: 'FREQ=DAILY;COUNT=1000',
      startDateTimeZone: 'America/New_York',
      endDateTimeZone: 'America/New_York',
    },
  ],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 10, 1),
  firstDayOfWeek: 1,
}));

test('Appointment displayed without errors if it was only one DST in year(T1037853)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentByIndex(0).element.exists)
    .eql(true);
}).before(async () => createScheduler({
  timeZone: 'America/Los_Angeles',
  dataSource: [{
    text: 'Recurrence',
    startDate: new Date(1942, 3, 29, 0),
    endDate: new Date(1942, 3, 29, 1),
    recurrenceRule: 'FREQ=DAILY;COUNT=2',
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(1942, 3, 29),
  height: 600,
}));
