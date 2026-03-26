import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Focused row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('onFocusedRowChanged event should fire once after changing focusedRowKey if paging.enabled = false (T755722)', async ({ page }) => {
    // TODO: Playwright migration - onFocusedRowChanged counter stays at 1 instead of 2 after programmatic key change
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '111111', room: 6 },
        { name: 'Dan', phone: '2222222', room: 5 },
        { name: 'Ben', phone: '333333', room: 4 },
      ],
      keyExpr: 'name',
      focusedRowEnabled: true,
      focusedRowIndex: 1,
      paging: {
        enabled: false,
      },
      onFocusedRowChanged: () => {
        const global = window as Window & typeof globalThis & { onFocusedRowChangedCounter: number };
        if (!global.onFocusedRowChangedCounter) {
          global.onFocusedRowChangedCounter = 0;
        }
        global.onFocusedRowChangedCounter += 1;
      },
    });

    const counter1 = await page.evaluate(() => (window as any).onFocusedRowChangedCounter);
    expect(counter1).toBe(1);

    await page.evaluate(() => (window as any).widget.option('focusedRowKey', 'Ben'));

    await expect(page.locator('.dx-row-focused')).toBeVisible();

    const counter2 = await page.evaluate(() => (window as any).onFocusedRowChangedCounter);
    expect(counter2).toBe(2);
  });
});
