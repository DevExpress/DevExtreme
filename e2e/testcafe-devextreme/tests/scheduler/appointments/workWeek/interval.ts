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
    },
    {
      startDate: '2024-01-07T01:00:00',
      endDate: '2024-01-08T01:00:00',
      text: 'Starts in weekend',
    },
    {
      startDate: '2024-01-05T01:00:00',
      endDate: '2024-01-08T01:00:00',
      text: 'Goes over weekend',
    },
  ],
  views: [{
    name: 'myView',
    type: 'workWeek',
    allDayPanelMode: 'allDay',
    intervalCount: 2,
  }],
  currentView: 'myView',
  currentDate: '2024-01-01',
  height: 600,
}));
