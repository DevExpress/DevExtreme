import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setAttribute, Toolbar } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toolbar_OverflowMenu_Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 400 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const generateItems = (count: number) => {
    const items: { text: string; locateInMenu: string }[] = [];

    for (let i = 0; i <= count; i += 1) {
      items.push({ text: `item${i}`, locateInMenu: 'always' });
    }

    return items;
  };

  test('Popup automatically update its height on window resize', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: generateItems(40),
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    await testScreenshot(page, 'Toolbar menu popup before window resize.png');

    await page.setViewportSize({ width: 300, height: 300 });

    await testScreenshot(page, 'Toolbar menu popup after window resize.png');
  });

  test('Popup should be position correctly with the window border collision', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: generateItems(40),
      width: 50,
    });

    const toolbar = new Toolbar(page);
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    await testScreenshot(page, 'Toolbar menu popup collision with window border.png');
  });

  [true, false].forEach((rtlEnabled) => {
    test(`Popup under container should be limited in height,rtlEnabled=${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxToolbar', {
        items: generateItems(40),
        rtlEnabled,
      });

      const toolbar = new Toolbar(page);
      const overflowMenu = toolbar.getOverflowMenu();

      await overflowMenu.click();

      await testScreenshot(page, `Toolbar menu popup under container rtl=${rtlEnabled}.png`);
    });

    test(`Popup above container should be limited in height,rtlEnabled=${rtlEnabled}`, async ({ page }) => {
      await setAttribute(page, '#container', 'style', 'margin-top: 200px');

      await createWidget(page, 'dxToolbar', {
        items: generateItems(40),
        rtlEnabled,
      });

      const toolbar = new Toolbar(page);
      const overflowMenu = toolbar.getOverflowMenu();

      await overflowMenu.click();

      await testScreenshot(page, `Toolbar menu popup above container rtl=${rtlEnabled}.png`);
    });
  });
});
