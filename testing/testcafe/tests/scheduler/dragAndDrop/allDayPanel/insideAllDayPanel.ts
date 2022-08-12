import createWidget, { disposeWidgets } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Drag-and-drop inside All-Day-Panel`
  .page(url(__dirname, '../../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Drag-n-drop appointment with allDay field', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('appt');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(4))
    .expect(Math.floor(await draggableAppointment.element.getBoundingClientRectProperty('height')))
    .eql(24)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 11:59 PM');

  await t
    .doubleClick(draggableAppointment.element)
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .expect(scheduler.appointmentPopup.allDay.on)
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  endDayHour: 3,
  dataSource: [{
    startDate: new Date(2021, 4, 10),
    text: 'appt',
    allDay: true,
  }],
  views: ['week'],
  currentView: 'week',
}));

test('Drag-n-drop appointment without allDay field', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('appt');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(4))
    .expect(Math.floor(await draggableAppointment.element.getBoundingClientRectProperty('height')))
    .eql(24)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:00 AM');

  await t
    .doubleClick(draggableAppointment.element)
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .expect(scheduler.appointmentPopup.allDay.on)
    .notOk();
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  endDayHour: 3,
  dataSource: [{
    startDate: new Date(2021, 4, 10),
    endDate: new Date(2021, 4, 12),
    text: 'appt',
  }],
  views: ['week'],
  currentView: 'week',
}));

test('Drag-n-drop appointment after change allDay field', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('appt');

  await t
    .doubleClick(draggableAppointment.element)
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .click(scheduler.appointmentPopup.allDay.element)
    .expect(scheduler.appointmentPopup.allDay.on)
    .ok()
    .click(scheduler.appointmentPopup.doneButton);

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(4))
    .expect(Math.floor(await draggableAppointment.element.getBoundingClientRectProperty('height')))
    .eql(24)
    .expect(draggableAppointment.date.time)
    .eql('12:00 AM - 12:01 AM');

  await t
    .doubleClick(draggableAppointment.element)
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .expect(scheduler.appointmentPopup.allDay.on)
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 4, 11),
  width: 700,
  height: 500,
  endDayHour: 3,
  dataSource: [{
    startDate: new Date(2021, 4, 10),
    endDate: new Date(2021, 4, 12),
    text: 'appt',
  }],
  views: ['week'],
  currentView: 'week',
}));
