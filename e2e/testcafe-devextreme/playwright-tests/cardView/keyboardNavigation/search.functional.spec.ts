import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should focus search text box after ctrl+f if card is focused', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      searchPanel: { visible: true },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(1);
    await card.click();
    await card.dispatchEvent('keydown', { key: 'f', ctrlKey: true });

    const searchInput = page.locator('.dx-cardview-search .dx-texteditor-input');
    await expect(searchInput).toBeFocused();
  });
});
