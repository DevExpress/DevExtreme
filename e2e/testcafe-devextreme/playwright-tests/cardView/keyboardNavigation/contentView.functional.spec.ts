import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.ContentView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [
    { caseName: 'arrows -> left item', keys: 'ArrowLeft', resultIndex: 3 },
    { caseName: 'arrows -> right item', keys: 'ArrowRight', resultIndex: 5 },
    { caseName: 'arrows -> top item', keys: 'ArrowUp', resultIndex: 1 },
    { caseName: 'arrows -> bottom item', keys: 'ArrowDown', resultIndex: 7 },
  ].forEach(({ caseName, keys, resultIndex }) => {
    test(`Should move between cards: ${caseName}`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
        columns: ['id'],
        keyExpr: 'id',
        paging: { pageSize: 9 },
        height: 700,
      });

      const card4 = page.locator('.dx-cardview-card').nth(4);
      await card4.click();
      await page.keyboard.press(keys);

      const targetCard = page.locator('.dx-cardview-card').nth(resultIndex);
      await expect(targetCard).toBeFocused();
    });
  });

  test('Should change page to the next one and focus first card', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      paging: { pageSize: 3, pageIndex: 1 },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(1);
    await card.click();
    await page.keyboard.press('PageDown');

    const firstCard = page.locator('.dx-cardview-card').first();
    await expect(firstCard).toBeFocused();
  });

  test('Should change page to the previous one and focus first card', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      paging: { pageSize: 3, pageIndex: 1 },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(1);
    await card.click();
    await page.keyboard.press('PageUp');

    const firstCard = page.locator('.dx-cardview-card').first();
    await expect(firstCard).toBeFocused();
  });
});
