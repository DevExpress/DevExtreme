import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Drag-and-drop behaviour for the appointment tooltip`
  .page(url(__dirname, '../../../container.html'));

test('Drag-n-drop to the cell below should work in month view (T1005115)', async (t) => {
  const scheduler = new Scheduler('#container');
  const collector = scheduler.collectors.find('1 more');
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
  const collector = scheduler.collectors.find('1');
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
