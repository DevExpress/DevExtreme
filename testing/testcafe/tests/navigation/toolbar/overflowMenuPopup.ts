import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { setAttribute } from '../helpers/domUtils';

fixture.disablePageReloads`Toolbar_OverflowMenu_Popup`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

const generateItems = (count) => {
  const items: { text: string; locateInMenu: string }[] = [];

  for (let i = 0; i <= count; i += 1) {
    items.push({ text: `item${i}`, locateInMenu: 'always' });
  }

  return items;
};

safeSizeTest('Popup automatically update its height on window resize', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);

  await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar menu popup before window resize.png');

  await t.resizeWindow(300, 300);

  await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar menu popup after window resize.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(400, 400);

  return createWidget('dxToolbar', {
    items: generateItems(40),
  }, true);
}).after(async () => disposeWidgets());

safeSizeTest('Popup should be position correctly with the window border collision', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);

  await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar menu popup collision with window border.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(400, 400);

  return createWidget('dxToolbar', {
    items: generateItems(40),
    width: 50,
  }, true);
}).after(async () => disposeWidgets());

[true, false].forEach((rtlEnabled) => {
  safeSizeTest(`Popup under container should be limited in height,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await t
      .click(overflowMenu.element);

    await takeScreenshotInTheme(t, takeScreenshot, `Toolbar menu popup under container rtlEnabled=${rtlEnabled}.png`, '#container');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(400, 400);

    return createWidget('dxToolbar', {
      items: generateItems(40),
      rtlEnabled,
    }, true);
  }).after(async () => disposeWidgets());

  safeSizeTest(`Popup above container should be limited in height,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await t
      .click(overflowMenu.element);

    await takeScreenshotInTheme(t, takeScreenshot, `Toolbar menu popup above container rtlEnabled=${rtlEnabled}.png`, '#container');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(400, 400);

    await setAttribute('#container', 'style', 'margin-top: 200px');

    return createWidget('dxToolbar', {
      items: generateItems(40),
      rtlEnabled,
    }, true);
  });
});
