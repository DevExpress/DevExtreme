import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - tileView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTileView', { items: [{ text: 'test 1' }], focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('tile view with multiple tiles and focus', async ({ page }) => {
    await createWidget(page, 'dxTileView', {
      items: [{ text: 'Tile 1' }, { text: 'Tile 2' }, { text: 'Tile 3' }],
      focusStateEnabled: true,
    });
    await page.keyboard.press('Tab');
    await a11yCheck(page, {}, '#container');
  });

  test('tile view with custom tile sizes', async ({ page }) => {
    await createWidget(page, 'dxTileView', {
      items: [
        { text: 'Wide Tile', widthRatio: 2 },
        { text: 'Normal Tile' },
        { text: 'Tall Tile', heightRatio: 2 },
      ],
      focusStateEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('tile view focused via keyboard', async ({ page }) => {
    await createWidget(page, 'dxTileView', { items: [{ text: 'test 1' }], focusStateEnabled: true });
    await page.keyboard.press('Tab');
    await a11yCheck(page, {}, '#container');
  });
});
