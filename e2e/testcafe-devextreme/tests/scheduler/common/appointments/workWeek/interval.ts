import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';

fixture.disablePageReloads`Appointments with adaptive`
  .page(url(__dirname, '../../../container.html'));

safeSizeTest('Should correctly render scheduler in workWeek view with interval, skipping weekends (T1243027)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await takeScreenshot('work_week_interval-2.png', scheduler.workSpace);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [
    {
      startDate: '2024-01-05T01:00:00',
      endDate: '2024-01-07T01:00:00',
      text: 'Ends in weekend',
      color: 'red',
    },
    {
      startDate: '2024-01-07T01:00:00',
      endDate: '2024-01-08T01:00:00',
      text: 'Starts in weekend',
      color: 'blue',
    },
    {
      startDate: '2024-01-05T01:00:00',
      endDate: '2024-01-08T01:00:00',
      text: 'Goes over weekend',
      color: 'green',
    },
  ],
  views: [{
    name: 'myView',
    type: 'workWeek',
    allDayPanelMode: 'allDay',
    intervalCount: 2,
    maxAppointmentsPerCell: 'unlimited',
  }],
  currentView: 'myView',
  currentDate: '2024-01-01',
  height: 600,
  // NOTE: resources are used only to distinguish appts in etalon file
  resources: [{
    fieldExpr: 'color',
    dataSource: [
      { id: 'red', color: 'red' },
      { id: 'blue', color: 'blue' },
      { id: 'green', color: 'green' },
    ],
    label: 'Room',
  }],
}));
