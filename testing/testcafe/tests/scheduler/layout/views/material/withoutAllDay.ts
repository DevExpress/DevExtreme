import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';

fixture`Scheduler: Material theme without all-day panel`
  .page(url(__dirname, '../../../../containerMaterial.html'));

test('Week view without all-day panel should be rendered correctly', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('week-without-all-day-panel.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [],
  currentDate: new Date(2020, 6, 15),
  views: ['week'],
  currentView: 'week',
  height: 500,
}, true));
