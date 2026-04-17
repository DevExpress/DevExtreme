import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('HoveringRows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Hover over rows in the middle', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 3),
      hoverStateEnabled: true,
    });

    const firstRow = page.locator('.dx-data-row').nth(10);
    const secondRow = page.locator('.dx-data-row').nth(11);

    await firstRow.hover();
    await expect(firstRow).toHaveClass(/dx-state-hover/);

    await secondRow.hover();
    await expect(firstRow).not.toHaveClass(/dx-state-hover/);
    await expect(secondRow).toHaveClass(/dx-state-hover/);
  });

  test('Hover over first and last rows', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 3),
      hoverStateEnabled: true,
    });

    const firstRow = page.locator('.dx-data-row').first();
    const lastRow = page.locator('.dx-data-row').last();

    await firstRow.hover();
    await expect(firstRow).toHaveClass(/dx-state-hover/);

    await lastRow.hover();
    await expect(firstRow).not.toHaveClass(/dx-state-hover/);
    await expect(lastRow).toHaveClass(/dx-state-hover/);
  });
});
