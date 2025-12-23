import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Toolbar options change`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = async () => createWidget('dxScheduler', {
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 3, 27),
  height: 200,
  width: 500,
});
const buttons = Array.from({ length: 7 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test('Scheduler should change toolbar item location', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items[0].location', 'after');

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar-location-changed.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(createScheduler);

test('Scheduler should change toolbar', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar', { items: [{ template: 'Custom text' }] });

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar-changed.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(createScheduler);

test('Scheduler should hide and show toolbar', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.visible', false);
  await t.expect(scheduler.toolbar.isInvisible()).ok();
  await scheduler.option('toolbar.visible', true);
  await t.expect(scheduler.toolbar.isInvisible()).notOk();
}).before(createScheduler);

test('Scheduler should change toolbar items', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items', buttons);

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar-items-changed.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(createScheduler);

test('Scheduler should change toolbar item option', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items[0].options.text', 'Changed text');

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar-item-option-changed.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(createScheduler);

test('Scheduler should change toolbar options / integration', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items', buttons);
  await scheduler.option('toolbar.multiline', true);

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar-property-changed.png', { element: scheduler.toolbar.element });

  await scheduler.option('toolbar', { multiline: false });

  await testScreenshot(t, takeScreenshot, 'scheduler-toolbar-changed-2.png', { element: scheduler.toolbar.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(createScheduler);
