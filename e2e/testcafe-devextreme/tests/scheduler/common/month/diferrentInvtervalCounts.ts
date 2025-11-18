import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: different intervalCount option's values`
  .page(url(__dirname, '../../../container.html'));

test('Interval count: 1, February of 2021', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await testScreenshot(t, takeScreenshot, 'month-february-2021.png', { element: scheduler.workSpace });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  views: [{
    type: 'month',
    intervalCount: 1,
  }],
  currentView: 'month',
  firstDayOfWeek: 1,
  currentDate: new Date(2021, 1, 1),
}));

test('Interval count: 12', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');
  await scheduler.scrollTo(new Date(2024, 6, 1)); // scroll to last row

  await testScreenshot(t, takeScreenshot, 'month-interval-count-12.png', { element: scheduler.workSpace });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  views: [{
    type: 'month',
    intervalCount: 12,
  }],
  height: 600,
  currentView: 'month',
  currentDate: new Date(2023, 6, 1),
}));
