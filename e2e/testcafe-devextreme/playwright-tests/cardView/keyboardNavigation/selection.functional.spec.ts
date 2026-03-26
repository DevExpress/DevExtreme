import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [
    { caseName: 'card selection', keys: ['Space'], result: [false, true, false] },
    { caseName: 'card cannot be deselected', keys: ['Space', 'Space'], result: [false, true, false] },
    { caseName: 'the next card selection', keys: ['Space', 'ArrowRight', 'Space'], result: [false, false, true] },
  ].forEach(({ caseName, keys, result }) => {
    test(`Should handle selection in single mode: ${caseName}`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        dataSource: new Array(3).fill(undefined).map((_, idx) => ({ id: idx })),
        columns: ['id'],
        keyExpr: 'id',
        selection: { mode: 'single' },
        height: 700,
      });

      const card = page.locator('.dx-cardview-card').nth(1);
      await card.click();

      for (const key of keys) {
        await page.keyboard.press(key);
      }

      for (let i = 0; i < 3; i++) {
        const isSelected = await page.locator('.dx-cardview-card').nth(i).evaluate(
          el => el.classList.contains('dx-cardview-card-selection')
        );
        expect(isSelected).toBe(result[i]);
      }
    });
  });

  test('Should select all cards after ctrl+a with selection multiple mode', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: new Array(3).fill(undefined).map((_, idx) => ({ id: idx })),
      columns: ['id'],
      keyExpr: 'id',
      selection: { mode: 'multiple' },
      height: 700,
    });

    const card = page.locator('.dx-cardview-card').nth(1);
    await card.dispatchEvent('keydown', { key: 'a', ctrlKey: true });

    for (let i = 0; i < 3; i++) {
      const isSelected = await page.locator('.dx-cardview-card').nth(i).evaluate(
        el => el.classList.contains('dx-cardview-card-selection')
      );
      expect(isSelected).toBe(true);
    }
  });
});
