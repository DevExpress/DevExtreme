import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget, { disposeWidgets } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture.disablePageReloads`Scheduler: Material theme without all-day panel`
  .page(url(__dirname, '../../../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Week view without all-day panel should be rendered correctly', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('week-without-all-day-panel.png', scheduler.workSpace))
    .ok()

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
  }, true);
}).after(async () => {
  await disposeWidgets();
  await changeTheme('generic.light');
});
