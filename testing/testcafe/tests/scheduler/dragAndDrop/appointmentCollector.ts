import { appointmentCollectorData } from './init/widget.data';
import createScheduler from './init/widget.setup';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { createScreenshotsComparer } from '../../../helpers/screenshot-comparer';

fixture`Drag-and-drop behaviour for the appointment tooltip`
  .page(url(__dirname, '../../container.html'));

test('Drag-n-drop between a scheduler table cell and the appointment tooltip', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Approve Personal Computer Upgrade Plan');
  const collector = scheduler.getAppointmentCollector('2');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

  await t
    .click(collector.element)
    .expect(appointmentTooltip.isVisible()).ok()
    .dragToElement(appointmentTooltipItem.element, scheduler.getDateTableCell(2, 5))
    .expect(appointmentTooltipItem.element.exists)
    .notOk()
    .expect(appointment.element.exists)
    .ok()
    .expect(appointment.size.height)
    .eql('100px')
    .expect(appointment.date.time)
    .eql('10:00 AM - 11:00 AM')
    .dragToElement(appointment.element, scheduler.getDateTableCell(2, 2))
    .click(collector.element)
    .expect(appointmentTooltip.isVisible())
    .ok()
    .expect(appointment.element.exists)
    .notOk();
}).before(() => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: appointmentCollectorData,
  maxAppointmentsPerCell: 2,
  width: 1000,
}));

test('Drag-n-drop in same table cell', async (t) => {
  const scheduler = new Scheduler('#container');
  const collector = scheduler.getAppointmentCollector('2');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

  await t
    .click(collector.element)
    .expect(appointmentTooltip.isVisible()).ok()
    .drag(appointmentTooltipItem.element, 0, -50)
    .click(collector.element)
    .expect(appointmentTooltip.isVisible())
    .ok();
}).before(() => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource: appointmentCollectorData,
  maxAppointmentsPerCell: 2,
  width: 1000,
}));

test('Drag-n-drop to the cell below should work in month view (T1005115)', async (t) => {
  const scheduler = new Scheduler('#container');
  const collector = scheduler.getAppointmentCollector('1 more');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(collector.element)
    .dragToElement(
      appointmentTooltipItem.element,
      scheduler.getDateTableCell(1, 3),
      { speed: 0.1 },
    )

    .expect(await takeScreenshot('drag-n-drop-from-tooltip-to-cell-below-in-month.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2019, 3, 1),
  views: ['month'],
  currentView: 'month',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2019, 3, 3, 9, 30),
    endDate: new Date(2019, 3, 3, 11, 30),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2019, 3, 3, 10, 0),
    endDate: new Date(2019, 3, 3, 11, 0),
  }, {
    text: 'Install New Database',
    startDate: new Date(2019, 3, 3, 9, 45),
    endDate: new Date(2019, 3, 3, 11, 15),
  }],
  maxAppointmentsPerCell: 2,
  height: 800,
}));

test('Drag-n-drop to the cell on the left should work in week view (T1005115)', async (t) => {
  const scheduler = new Scheduler('#container');
  const collector = scheduler.getAppointmentCollector('1');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(collector.element)
    .dragToElement(
      appointmentTooltipItem.element,
      scheduler.getDateTableCell(2, 2),
      { speed: 0.1 },
    )

    .expect(await takeScreenshot('drag-n-drop-from-tooltip-to-left-cell-in-week.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2019, 3, 1),
  views: ['week'],
  currentView: 'week',
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2019, 3, 3, 9, 30),
    endDate: new Date(2019, 3, 3, 11, 30),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date(2019, 3, 3, 10, 0),
    endDate: new Date(2019, 3, 3, 10, 30),
  }, {
    text: 'Install New Database',
    startDate: new Date(2019, 3, 3, 9, 45),
    endDate: new Date(2019, 3, 3, 11, 15),
  }],
  maxAppointmentsPerCell: 2,
  height: 800,
  startDayHour: 9,
}));
