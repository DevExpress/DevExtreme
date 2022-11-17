import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { setAttribute } from '../helpers/domUtils';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Toolbar_OverflowMenu_Popup`
  .page(url(__dirname, '../../container.html'));

const generateItems = (count) => {
  const items: { text: string; locateInMenu: string }[] = [];

  for (let i = 0; i <= count; i += 1) {
    items.push({ text: `item${i}`, locateInMenu: 'always' });
  }

  return items;
};

test('Popup automatically update its height on window resize', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);

  await t
    .expect(await takeScreenshot('Popup_before_window_resize.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  await t.resizeWindow(300, 300);

  await t
    .expect(await takeScreenshot('Popup_after_window_resize.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(400, 400);

  return createWidget('dxToolbar', {
    items: generateItems(40),
  });
}).after(async (t) => {
  await restoreBrowserSize(t);
});

test('Popup should be position correctly with the window border collision', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);

  await t
    .expect(await takeScreenshot('Popup_collision_with_window_border.png'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(400, 400);

  return createWidget('dxToolbar', {
    items: generateItems(40),
    width: 50,
  });
}).after(async (t) => {
  await restoreBrowserSize(t);
});

[true, false].forEach((rtlEnabled) => {
  test(`Popup under container should be limited in height,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await t
      .click(overflowMenu.element);

    await t
      .expect(await takeScreenshot(`Popup_under_container,rtlEnabled=${rtlEnabled}${getThemePostfix()}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(400, 400);

    return createWidget('dxToolbar', {
      items: generateItems(40),
      rtlEnabled,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });

  test(`Popup above container should be limited in height,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await t
      .click(overflowMenu.element);

    await t
      .expect(await takeScreenshot(`Popup_above_container,rtlEnabled=${rtlEnabled}${getThemePostfix()}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(400, 400);

    await setAttribute('#container', 'style', 'margin-top: 200px');

    return createWidget('dxToolbar', {
      items: generateItems(40),
      rtlEnabled,
    });
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
