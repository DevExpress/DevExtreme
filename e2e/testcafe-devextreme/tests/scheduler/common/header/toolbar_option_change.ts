import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: Toolbar options change`
  .page(url(__dirname, '../../../container.html'));

const updateWholeToolbar = ClientFunction(() => {
  ($('#container') as any).dxScheduler('instance').option('toolbar', { items: [{ template: 'Custom text' }] });
});
const turnOffMultiline = ClientFunction(() => {
  ($('#container') as any).dxScheduler('instance').option('toolbar', { multiline: false });
});
const turnOnMultiline = ClientFunction(() => {
  ($('#container') as any).dxScheduler('instance').option('toolbar.multiline', true);
});
const setupToolbar = ClientFunction(() => {
  const buttons = Array.from({ length: 7 }).map((_, index) => ({
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    options: { text: `Button ${index}` },
  }));

  ($('#container') as any).dxScheduler('instance').option('toolbar.items', buttons);
});
const changeButtonText = ClientFunction(() => {
  ($('#container') as any).dxScheduler('instance').option('toolbar.items[0].options.text', 'Changed text');
});
const changeFirstItemLocation = ClientFunction(() => {
  ($('#container') as any).dxScheduler('instance').option('toolbar.items[0].location', 'after');
});

test('Scheduler should change nested toolbar options', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await changeFirstItemLocation();
  await t
    .expect(await takeScreenshot('scheduler-toolbar-location-changed.png', scheduler.toolbar.element))
    .ok();

  await updateWholeToolbar();
  await t
    .expect(await takeScreenshot('scheduler-toolbar-changed.png', scheduler.toolbar.element))
    .ok();

  await setupToolbar();
  await t
    .expect(await takeScreenshot('scheduler-toolbar-items-changed.png', scheduler.toolbar.element))
    .ok();

  await turnOnMultiline();
  await t
    .expect(await takeScreenshot('scheduler-toolbar-property-changed.png', scheduler.toolbar.element))
    .ok();

  await changeButtonText();
  await t
    .expect(await takeScreenshot('scheduler-toolbar-item-option-changed.png', scheduler.toolbar.element))
    .ok();

  await turnOffMultiline();
  await t
    .expect(await takeScreenshot('scheduler-toolbar-changed-2.png', scheduler.toolbar.element))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 3, 27),
  height: 200,
  width: 500,
}));
