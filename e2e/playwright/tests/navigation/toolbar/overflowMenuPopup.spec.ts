import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Toolbar from '../../../models/toolbar';

const generateItems = (count: number): { text: string; locateInMenu: string }[] => {
  const items: { text: string; locateInMenu: string }[] = [];

  for (let i = 0; i <= count; i += 1) {
    items.push({ text: `item${i}`, locateInMenu: 'always' });
  }

  return items;
};

test.describe('Toolbar_OverflowMenu_Popup', () => {
  test.use({ browserSize: [400, 400] });

  test('Popup automatically update its height on window resize', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: generateItems(40),
    });

    const toolbar = new Toolbar(page, '#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.element.click();

    await testScreenshot(page, 'Toolbar menu popup before window resize.png');

    await page.setViewportSize({ width: 300, height: 300 });

    await testScreenshot(page, 'Toolbar menu popup after window resize.png');
  });

  test('Popup should be position correctly with the window border collision', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: generateItems(40),
      width: 50,
    });

    const toolbar = new Toolbar(page, '#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.element.click();

    await testScreenshot(page, 'Toolbar menu popup collision with window border.png');
  });

  [true, false].forEach((rtlEnabled) => {
    test(`Popup under container should be limited in height,rtlEnabled=${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxToolbar', {
        items: generateItems(40),
        rtlEnabled,
      });

      const toolbar = new Toolbar(page, '#container');
      const overflowMenu = toolbar.getOverflowMenu();

      await overflowMenu.element.click();

      await testScreenshot(page, `Toolbar menu popup under container rtl=${rtlEnabled}.png`);
    });

    test(`Popup above container should be limited in height,rtlEnabled=${rtlEnabled}`, async ({ page }) => {
      await setAttribute(page, '#container', 'style', 'margin-top: 200px');

      await createWidget(page, 'dxToolbar', {
        items: generateItems(40),
        rtlEnabled,
      });

      const toolbar = new Toolbar(page, '#container');
      const overflowMenu = toolbar.getOverflowMenu();

      await overflowMenu.element.click();

      await testScreenshot(page, `Toolbar menu popup above container rtl=${rtlEnabled}.png`);
    });
  });
});
