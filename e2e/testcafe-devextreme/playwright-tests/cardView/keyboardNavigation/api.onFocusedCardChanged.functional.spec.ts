import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.onFocusedCardChanged', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should be called on each card focus change', async ({ page }) => {
    await page.evaluate(() => { (window as any).onFocusedCardChangedArgs = []; });
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      paging: { pageSize: 9 },
      onFocusedCardChanged: ({ cardIndex }) => {
        (window as any).onFocusedCardChangedArgs.push(cardIndex);
      },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(4);
    await card.click();

    for (const key of ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']) {
      await card.dispatchEvent('keydown', { key });
    }

    const result = await page.evaluate(() => (window as any).onFocusedCardChangedArgs);
    expect(result).toEqual([4, 7, 8, 5, 4]);
  });

  test('Should be called on focus change by click', async ({ page }) => {
    await page.evaluate(() => { (window as any).onFocusedCardChangedArgs = []; });
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      paging: { pageSize: 9 },
      onFocusedCardChanged: ({ cardIndex }) => {
        (window as any).onFocusedCardChangedArgs.push(cardIndex);
      },
      height: 700,
    });

    await page.locator('.dx-cardview-card').nth(5).click();
    await page.locator('.dx-cardview-card').nth(8).click();
    await page.locator('.dx-cardview-card').nth(0).click();

    const result = await page.evaluate(() => (window as any).onFocusedCardChangedArgs);
    expect(result).toEqual([5, 8, 0]);
  });
});
