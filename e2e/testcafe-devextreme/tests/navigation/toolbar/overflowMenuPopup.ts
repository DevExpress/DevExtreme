import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toolbar_OverflowMenu_Popup`
  .page(url(__dirname, '../../container.html'));

const generateItems = (count) => {
  const items: { text: string; locateInMenu: string }[] = [];

  for (let i = 0; i <= count; i += 1) {
    items.push({ text: `item${i}`, locateInMenu: 'always' });
  }

  return items;
};

test.meta({ browserSize: [400, 400] })('Popup automatically update its height on window resize', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t.click(overflowMenu.element);

  await testScreenshot(t, takeScreenshot, 'Toolbar menu popup before window resize.png');

  await t.resizeWindow(300, 300);

  await testScreenshot(t, takeScreenshot, 'Toolbar menu popup after window resize.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxToolbar', {
  items: generateItems(40),
}));

test.meta({ browserSize: [400, 400] })('Popup should be position correctly with the window border collision', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t.click(overflowMenu.element);

  await testScreenshot(t, takeScreenshot, 'Toolbar menu popup collision with window border.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxToolbar', {
  items: generateItems(40),
  width: 50,
}));

[true, false].forEach((rtlEnabled) => {
  test.meta({ browserSize: [400, 400] })(`Popup under container should be limited in height,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await t.click(overflowMenu.element);

    await testScreenshot(t, takeScreenshot, `Toolbar menu popup under container rtl=${rtlEnabled}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxToolbar', {
    items: generateItems(40),
    rtlEnabled,
  }));

  test.meta({ browserSize: [400, 400] })(`Popup above container should be limited in height,rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await t.click(overflowMenu.element);

    await testScreenshot(t, takeScreenshot, `Toolbar menu popup above container rtl=${rtlEnabled}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', 'margin-top: 200px');

    return createWidget('dxToolbar', {
      items: generateItems(40),
      rtlEnabled,
    });
  });
});
