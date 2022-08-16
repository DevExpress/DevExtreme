import createWidget, { disposeWidgets } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Drag-and-drop between all-day panel and date table`
  .page(url(__dirname, '../../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Drag-n-drop all-day appointment', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('all-day');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 2))
    .expect(scheduler.getAppointmentCount('allDay'))
    .eql(0)
    .expect(scheduler.getAppointmentCount('timeTable'))
    .eql(1)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:30 AM');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(2))
    .expect(scheduler.getAppointmentCount('allDay'))
    .eql(1)
    .expect(scheduler.getAppointmentCount('timeTable'))
    .eql(0)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:30 AM');
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  startDayHour: 0,
  endDayHour: 3,
  dataSource: [{
    startDate: new Date(2021, 4, 10),
    text: 'all-day',
    allDay: true,
  }],
  views: ['week'],
  currentView: 'week',
}));

test('Drag-n-drop multi-day appointment', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('multi-day');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 1))
    .expect(scheduler.getAppointmentCount('allDay'))
    .eql(0)
    .expect(scheduler.getAppointmentCount('timeTable'))
    .eql(1)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:30 AM');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(2))
    .expect(scheduler.getAppointmentCount('allDay'))
    .eql(1)
    .expect(scheduler.getAppointmentCount('timeTable'))
    .eql(0)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:30 AM');
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  startDayHour: 0,
  endDayHour: 3,
  dataSource: [{
    startDate: new Date(2021, 4, 10, 6),
    endDate: new Date(2021, 4, 12, 18),
    text: 'multi-day',
  }],
  views: ['week'],
  currentView: 'week',
}));

// TODO correct
test('Drag-n-drop all-day appointment if allDayPanelMode="allDay"', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('all-day');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 1))
    .expect(scheduler.getAppointmentCount('allDay'))
    .eql(0)
    .expect(scheduler.getAppointmentCount('timeTable'))
    .eql(1)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:30 AM');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(2))
    .expect(scheduler.getAppointmentCount('allDay'))
    .eql(1)
    .expect(scheduler.getAppointmentCount('timeTable'))
    .eql(0)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:30 AM');
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  startDayHour: 0,
  endDayHour: 3,
  dataSource: [{
    startDate: new Date(2021, 4, 10, 6),
    endDate: new Date(2021, 4, 12, 18),
    allDay: true,
    text: 'all-day',
  }],
  allDayPanelMode: 'allDay',
  views: ['week'],
  currentView: 'week',
}));
