import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../../helpers/createWidget';
import url from '../../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../../helpers/themeUtils';
import { changeTheme } from '../../../../../../helpers/changeTheme';

fixture.disablePageReloads`Scheduler: Material theme without all-day panel`
  .page(url(__dirname, '../../../../../container.html'));

test('Week view without all-day panel should be rendered correctly', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'week-without-all-day-panel.png', {
    element: scheduler.workSpace,
    theme: 'material.blue.light',
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('material.blue.light');

  return createWidget('dxScheduler', {
    dataSource: [],
    currentDate: new Date(2020, 6, 15),
    views: ['week'],
    currentView: 'week',
    height: 500,
  });
}).after(async () => {
  await changeTheme('generic.light');
});
