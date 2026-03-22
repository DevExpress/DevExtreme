import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('DataGrid deleted row height consistency T1286265', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const ROW_INDEX = 1;

  // visual: generic.light
  // visual: generic.light.compact
  // visual: material.blue.light
  // visual: material.blue.light.compact
  // visual: fluent.blue.light
  // visual: fluent.blue.light.compact

  test('When DataGrid has fixed column row height should not change when marked as deleted - generic.light', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, name: 'John Smith' },
          { id: 2, name: 'Jane Johnson' },
          { id: 3, name: 'Mike Wilson' },
        ],
        keyExpr: 'id',
        height: 300,
        showBorders: true,
        showRowLines: true,
        columns: [
          { dataField: 'id', width: 50, fixed: true },
          { dataField: 'name', width: 150 },
        ],
        editing: {
          mode: 'batch',
          allowDeleting: true,
        },
      });

    // Arrange
      // Get the initial height of the row at index
    const initialRow = page.locator('.dx-data-row').nth(ROW_INDEX);
    const initialRowHeight = await initialRow.element.clientHeight;

    // Act - mark the row as deleted
    await dataGrid.apiDeleteRow(ROW_INDEX);

    // Assert - check if the row is marked as deleted
    expect(await page.locator('.dx-data-row').nth(ROW_INDEX).isRemoved);
    await t.ok('Row should be marked as deleted');

    // Get the height of the deleted row
    const deletedRow = page.locator('.dx-data-row').nth(ROW_INDEX);
    const deletedRowHeight = await deletedRow.element.clientHeight;

    // Assert - check if the height remains consistent
    expect(await deletedRowHeight);
    await t.eql(initialRowHeight, 'Row height should not change when marked as deleted');

    // Take a screenshot for visual verification
    await testScreenshot(page, 'datagrid-deleted-row-height-row-lines-and-fixed-column.png', { element: page.locator('#container') });
  });
});
