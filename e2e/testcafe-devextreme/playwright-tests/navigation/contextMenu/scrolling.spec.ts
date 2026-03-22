import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ContextMenu_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('ContextMenu items render', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'contextMenu');

    const items: any[] = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

    items[98].items = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

    await createWidget(page, 'dxContextMenu', {
      items,
      target: 'body',
    }, '#contextMenu');

    const contextMenu = page.locator('#contextMenu');

    await contextMenu.show();

    await page.keyboard.press('ArrowDown')
      .pressKey('up')
      .pressKey('right')
      .pressKey('up');

    await testScreenshot(page, 'ContextMenu scrolling.png');

    });
});
