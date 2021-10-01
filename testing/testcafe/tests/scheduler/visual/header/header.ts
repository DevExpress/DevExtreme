import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler: Adaptive material theme layout`
  .page(url(__dirname, '../../containerMaterial.html'));

test('The toolbar should not display if the config is empty', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#container');

  await t
    .expect(await takeScreenshot('scheduler-with-empty-toolbar-config.png'))
    .ok();

  await scheduler.option('toolbar', [{ defaultElement: 'viewSwitcher' }]);

  await t
    .expect(await takeScreenshot('scheduler-with-non-empty-toolbar-config.png'))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2020, 2, 2),
  currentView: 'day',
  views: ['day'],
  height: 580,
  toolbar: [],
}, true));
