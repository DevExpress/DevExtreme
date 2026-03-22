import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.OnKeyDown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should be called on header item unhandled event', async ({ page }) => {
    await page.evaluate(() => { (window as any).onKeyDownArgs = []; });
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      onKeyDown: ({ handled, event: { key } }) => {
        (window as any).onKeyDownArgs.push({ handled, key });
      },
      height: 700,
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.dispatchEvent('keydown', { key: 'a' });

    const result = await page.evaluate(() => (window as any).onKeyDownArgs);
    expect(result).toEqual([{ handled: false, key: 'a' }]);
  });

  test('Should be called on card handled event', async ({ page }) => {
    await page.evaluate(() => { (window as any).onKeyDownArgs = []; });
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      onKeyDown: ({ handled, event: { key } }) => {
        (window as any).onKeyDownArgs.push({ handled, key });
      },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').first();
    await card.dispatchEvent('keydown', { key: 'ArrowRight' });

    const result = await page.evaluate(() => (window as any).onKeyDownArgs);
    expect(result).toEqual([{ handled: true, key: 'ArrowRight' }]);
  });
});
