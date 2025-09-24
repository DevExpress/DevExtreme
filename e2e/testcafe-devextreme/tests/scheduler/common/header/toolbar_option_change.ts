import { compareScreenshot, createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: Toolbar options change`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = async () => createWidget('dxScheduler', {
  views: ['day', 'week'],
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
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items[0].location', 'after');
  await t.expect(
    await compareScreenshot(t, 'scheduler-toolbar-location-changed.png', scheduler.toolbar.element),
  ).ok();
}).before(createScheduler);

test('Scheduler should change toolbar', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar', { items: [{ template: 'Custom text' }] });
  await t.expect(
    await compareScreenshot(t, 'scheduler-toolbar-changed.png', scheduler.toolbar.element),
  ).ok();
}).before(createScheduler);

test('Scheduler should hide and show toolbar', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.visible', false);
  await t.expect(scheduler.toolbar.isInvisible()).ok();
  await scheduler.option('toolbar.visible', true);
  await t.expect(scheduler.toolbar.isInvisible()).notOk();
}).before(createScheduler);

test('Scheduler should change toolbar items', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items', buttons);
  await t.expect(
    await compareScreenshot(t, 'scheduler-toolbar-items-changed.png', scheduler.toolbar.element),
  ).ok();
}).before(createScheduler);

test('Scheduler should change toolbar item option', async (t) => {
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items[0].options.text', 'Changed text');
  await t.expect(
    await compareScreenshot(t, 'scheduler-toolbar-item-option-changed.png', scheduler.toolbar.element),
  ).ok();
}).before(createScheduler);

test('Scheduler should change toolbar options / integration', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await scheduler.option('toolbar.items', buttons);
  await scheduler.option('toolbar.multiline', true);
  await t
    .expect(await takeScreenshot('scheduler-toolbar-property-changed.png', scheduler.toolbar.element))
    .ok();

  await scheduler.option('toolbar', { multiline: false });
  await t
    .expect(await takeScreenshot('scheduler-toolbar-changed-2.png', scheduler.toolbar.element))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(createScheduler);
