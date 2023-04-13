import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { dataSource } from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Drag-and-drop appointments in the Scheduler basic views`
  .page(url(__dirname, '../../container.html'));

['day', 'week', 'workWeek'].forEach((view) => test(`Drag-n-drop in the "${view}" view`, async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
    .expect(draggableAppointment.size.height).eql('50px')
    .expect(draggableAppointment.date.time)
    .eql('11:00 AM - 11:30 AM');
}).before(async () => createScheduler({
  views: [view],
  currentView: view,
  dataSource,
})));

test('Drag-n-drop in the "month" view', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
    .expect(draggableAppointment.size.height).eql('23.75px')
    .expect(draggableAppointment.date.time)
    .eql('9:00 AM - 9:30 AM');
}).before(async () => createScheduler({
  views: ['month'],
  currentView: 'month',
  dataSource,
  height: 834,
}));

test('Drag-n-drop when browser has horizontal scroll', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Staff Productivity Report');

  await t
    .drag(draggableAppointment.element, 250, -50, { speed: 0.2 })
    .expect(draggableAppointment.isAllDay).eql(true);
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: [{
    text: 'Staff Productivity Report',
    startDate: new Date(2019, 3, 6, 9, 0),
    endDate: new Date(2019, 3, 6, 10, 30),
    resourceId: 2,
  }],
  width: 1800,
}));

test('Drag-n-drop when browser has vertical scroll', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Staff Productivity Report');

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(25, 0), { speed: 0.5 })
    .expect(draggableAppointment.date.time).eql('9:30 PM - 10:00 PM');
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: [{
    text: 'Staff Productivity Report',
    startDate: new Date(2019, 3, 1, 21, 0),
    endDate: new Date(2019, 3, 1, 21, 30),
    resourceId: 2,
  }],
  height: 1800,
}));

test('Drag recurrent appointment occurrence from collector (T832887)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Recurrence two');
  const collector = scheduler.collectors.find('2');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Recurrence two');
  const popup = Scheduler.getDeleteRecurrenceDialog();

  await t
    .click(collector.element)
    .expect(appointmentTooltip.isVisible()).ok()
    .dragToElement(appointmentTooltipItem.element, scheduler.getDateTableCell(2, 2))
    .expect(appointmentTooltipItem.element.exists)
    .notOk()
    .click(popup.appointment)
    .expect(appointment.element.exists)
    .ok()
    .expect(appointment.date.time)
    .eql('4:00 AM - 6:00 AM')
    .expect(collector.element.exists)
    .notOk();
}).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  firstDayOfWeek: 2,
  startDayHour: 4,
  maxAppointmentsPerCell: 1,
  dataSource: [{
    text: 'Recurrence one',
    startDate: new Date(2019, 2, 26, 8, 0),
    endDate: new Date(2019, 2, 26, 10, 0),
    recurrenceException: '',
    recurrenceRule: 'FREQ=DAILY',
  }, {
    text: 'Non-recurrent appointment',
    startDate: new Date(2019, 2, 26, 7, 0),
    endDate: new Date(2019, 2, 26, 11, 0),
  }, {
    text: 'Recurrence two',
    startDate: new Date(2019, 2, 26, 8, 0),
    endDate: new Date(2019, 2, 26, 10, 0),
    recurrenceException: '',
    recurrenceRule: 'FREQ=DAILY',
  }],
  currentDate: new Date(2019, 2, 26),
}));

test('Drag-n-drop the appointment to the left column to the cell that has the same time', async (t) => {
  const scheduler = new Scheduler('#container');
  const screenshotZone = scheduler.workSpace;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const draggableAppointment = scheduler.getAppointment('Test appointment');

  await t
    .dragToElement(
      draggableAppointment.element,
      scheduler.getDateTableCell(2, 2),
      { speed: 0.5 },
    );

  await takeScreenshot('drag-n-drop-appointment-to-left-column.png', screenshotZone);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createScheduler({
    timeZone: 'Etc/GMT',
    dataSource: [{
      text: 'Test appointment',
      startDate: new Date('2022-09-08T10:00:00.000Z'),
      endDate: new Date('2022-09-08T10:30:00.000Z'),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date('2022-09-09T10:00:00.000Z'),
    startDayHour: 9,
    width: 600,
    height: 600,
  });
});
