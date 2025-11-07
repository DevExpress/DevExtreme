import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../../helpers/createWidget';
import url from '../../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Material theme without all-day panel`
  .page(url(__dirname, '../../../../../container.html'));

// visual: material.blue.light
test('Week view without all-day panel should be rendered correctly', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'week-without-all-day-panel.png', {
    element: scheduler.workSpace,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  currentDate: new Date(2020, 6, 15),
  views: ['week'],
  currentView: 'week',
  height: 500,
}));
