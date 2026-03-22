import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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

test.describe('Column Fixing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: generic.light
  // visual: material.blue
  // visual: fluent.blue

  test('Fixed columns: Check context menu items', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: getData(5, 5),
        width: '100%',
        columnFixing: {
          enabled: true,
        },
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await t.rightClick(page.locator('.dx-header-row').nth(0).element);
    await (dataGrid.getContextMenu().getItemByText('Set Fixed Position')).click();
    await testScreenshot(page, 'sticky_columns_context_menu.png');
  });
});
