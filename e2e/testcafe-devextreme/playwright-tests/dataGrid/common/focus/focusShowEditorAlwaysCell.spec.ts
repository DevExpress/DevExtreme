import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Focus - cell with showEditorAlways', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const SELECTOR = '#container';

  const createDataGrid = async (page: any) => createWidget(page, 'dxDataGrid', {
    dataSource: [
      { A: 'A_0', B: 'B_0', C: 0, D: 'D_0' },
      { A: 'A_1', B: 'B_1', C: 1, D: 'D_1' },
      { A: 'A_2', B: 'B_2', C: 2, D: 'D_2' },
    ],
    columns: [
      { dataField: 'A', showEditorAlways: true },
      { dataField: 'B', showEditorAlways: true },
      {
        dataField: 'C',
        showEditorAlways: true,
        lookup: {
          dataSource: [
            { id: 0, name: 'LOOKUP_0' },
            { id: 1, name: 'LOOKUP_1' },
            { id: 2, name: 'LOOKUP_2' },
          ],
          displayExpr: 'name',
          valueExpr: 'id',
        },
      },
      { dataField: 'D', showEditorAlways: true },
    ],
    editing: {
      mode: 'cell',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
    },
  });

  test('Should switch focus after the lookup value change [T1194403]', async ({ page }) => {
    await createDataGrid(page);

    const editorTextCell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
    const lookupEditor = page.locator('.dx-data-row').nth(0).locator('td').nth(2).locator('.dx-selectbox');

    await lookupEditor.click();

    const listItem = page.locator('.dx-overlay-wrapper .dx-list-item').nth(2);
    await listItem.click();

    await editorTextCell.click();
    await page.waitForTimeout(100);

    await testScreenshot(page, 'focus-edit-cell_after-lookup-change.png', { element: page.locator('#container') });
  });

  test('Should switch focus after the textBox value change [T1194403]', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, SELECTOR);
    const editorCellOne = dataGrid.getDataCell(0, 1).locator('input');
    const editorCellTwo = dataGrid.getDataCell(0, 0).locator('input');

    await editorCellOne.click();
    await editorCellOne.fill('TEST_TEXT');
    await editorCellTwo.click();
    await page.waitForTimeout(100);

    await testScreenshot(page, 'focus-edit-cell_after-text-editor-change.png', { element: page.locator('#container') });
  });
});
