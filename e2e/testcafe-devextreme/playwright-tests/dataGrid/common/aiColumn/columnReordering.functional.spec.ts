import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.ColumnReordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Column reordering should work when allowColumnReordering is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      allowColumnReordering: true,
      columnWidth: 100,
      columns: [
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    // arrange
      const headerRow = page.locator('.dx-header-row').nth(0);

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // assert
    expect(await headerRow.getHeaderTexts()).toBe(['AI Column', 'ID', 'Name', 'Value']);

    // act
    await t.drag(headerRow.locator('td').nth(0).element, 150, 0);

    // assert
    expect(await headerRow.getHeaderTexts()).toBe(['ID', 'AI Column', 'Name', 'Value']);
  });
});
