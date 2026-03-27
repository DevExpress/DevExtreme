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
    { caseName: 'arrows -> same first item', keys: ['ArrowRight', 'ArrowLeft'], resultIndex: 4 },
    { caseName: 'arrows -> left item', keys: ['ArrowLeft'], resultIndex: 3 },
    { caseName: 'arrows -> right item', keys: ['ArrowRight'], resultIndex: 5 },
    { caseName: 'arrows -> top item', keys: ['ArrowUp'], resultIndex: 1 },
    { caseName: 'arrows -> bottom item', keys: ['ArrowDown'], resultIndex: 7 },
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
      for (const key of keys) {
        await page.keyboard.press(key);
      }

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

  [
    { caseName: 'arrows -> no left overflow', keys: ['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft'], resultIndex: 3 },
    { caseName: 'arrows -> no right overflow', keys: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight'], resultIndex: 5 },
    { caseName: 'arrows -> no top overflow', keys: ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowUp'], resultIndex: 1 },
    { caseName: 'arrows -> no bottom overflow', keys: ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown'], resultIndex: 7 },
    { caseName: 'first in same row', keys: ['Home'], resultIndex: 3 },
    { caseName: 'last in same row', keys: ['End'], resultIndex: 5 },
    { caseName: 'first in first row', keys: ['Control+Home'], resultIndex: 0 },
    { caseName: 'last in last row', keys: ['Control+End'], resultIndex: 8 },
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

      for (const key of keys) {
        await page.keyboard.press(key);
      }

      const targetCard = page.locator('.dx-cardview-card').nth(resultIndex);
      await expect(targetCard).toBeFocused();
    });
  });

  test('Should do nothing if pageup pressed on first page', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      paging: { pageSize: 3, pageIndex: 0 },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(2);
    await card.click();
    await page.keyboard.press('PageUp');

    await expect(card).toBeFocused();
  });

  test('Should do nothing if pagedown pressed on last page', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      paging: { pageSize: 3, pageIndex: 2 },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(2);
    await card.click();
    await page.keyboard.press('PageDown');

    await expect(card).toBeFocused();
  });
});
