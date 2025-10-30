import { compareScreenshot, createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';
import { Themes } from '../../../../helpers/themes';

fixture`Scheduler header sizes`
  .page(url(__dirname, '../../../container.html'));

const buttons = Array.from({ length: 4 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index}` },
}));

test('items inside toolbar menu should stretch', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await t.click(scheduler.toolbar.menuButton);

  await takeScreenshot('scheduler-toolbar-menu.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('fluent.blue.light');
  return createWidget('dxScheduler', {
    width: 320,
    currentDate: new Date('2025-05-02T07:59:01.167Z'),
    toolbar: {
      items: ['today', 'dateNavigator', ...buttons, {
        location: 'after',
        locateInMenu: 'auto',
        name: 'viewSwitcher',
      }],
    },
  });
}).after(async () => {
  await changeTheme('generic.light');
});

[
  Themes.fluentBlueCompact,
  Themes.fluentBlue,
  Themes.materialBlueCompact,
  Themes.materialBlue,
  Themes.genericLightCompact,
  Themes.genericLight,
].forEach((theme) => {
  test('Scheduler header should have correct sizes', async (t) => {
    const scheduler = new Scheduler('#container');

    await t.expect(await compareScreenshot(t, `scheduler-toolbar-${theme}.png`, scheduler.toolbar.element)).ok();
  }).before(async () => {
    await changeTheme(theme);
    return createWidget('dxScheduler', {
      currentDate: new Date('2025-05-02T07:59:01.167Z'),
      toolbar: { items: ['today', 'dateNavigator', ...buttons, 'viewSwitcher'] },
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
