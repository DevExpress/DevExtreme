import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('initNewRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('No errors should be thrown if inserting new row after cancelling insert on second page', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(40)].map((_, index) => ({ id: index + 1, text: `item ${index + 1}` })),
      keyExpr: 'id',
      paging: {
        pageIndex: 1,
      },
      columns: ['id', 'text'],
      showBorders: true,
      editing: { mode: 'popup', allowAdding: true },
      onInitNewRow(e: any) {
        e.data.id = 0;
        e.data.text = 'test';
      },
      height: 300,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    await dataGrid.getPopupEditForm().cancelButton.click();

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    await expect(dataGrid.getPopupEditForm().element).toBeVisible();
  });

  test('onInitNewRow should set default data for new row in row mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'John', age: 30 }],
      keyExpr: 'id',
      columns: ['name', 'age'],
      editing: { mode: 'row', allowAdding: true },
      onInitNewRow(e: any) {
        e.data.name = 'Default Name';
        e.data.age = 25;
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const newRow = dataGrid.getDataRow(0);
    const nameEditor = newRow.getDataCell(0).element.locator('.dx-texteditor-input');
    const ageEditor = newRow.getDataCell(1).element.locator('.dx-texteditor-input');

    await expect(nameEditor).toHaveValue('Default Name');
    await expect(ageEditor).toHaveValue('25');
  });

  test('onInitNewRow should set default data for new row in popup mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'John' }],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'popup', allowAdding: true },
      onInitNewRow(e: any) {
        e.data.name = 'Preset Value';
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const popup = dataGrid.getPopupEditForm();
    await expect(popup.element).toBeVisible();

    const nameEditor = popup.element.locator('.dx-texteditor-input').first();
    await expect(nameEditor).toHaveValue('Preset Value');
  });

  test('new row should be inserted at the top in row mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' },
      ],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'row', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const firstRow = dataGrid.getDataRow(0);
    const firstRowCell = firstRow.getDataCell(0);
    await expect(firstRowCell.element.locator('.dx-texteditor-input')).toBeVisible();
  });

  test('new row in cell mode should become editable immediately', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'Existing' }],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'cell', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const newRowCell = dataGrid.getDataRow(0).getDataCell(0);
    await expect(newRowCell.element.locator('.dx-texteditor-input')).toBeVisible();
  });

  test('new row in batch mode should appear when clicking add row button', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'Item 1' }],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'batch', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);

    const rowsBefore = await dataGrid.dataRows.count();
    await dataGrid.getHeaderPanel().getAddRowButton().click();
    const rowsAfter = await dataGrid.dataRows.count();

    expect(rowsAfter).toBe(rowsBefore + 1);
  });

  test('canceling new row in row mode should remove the inserted row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'Item 1' }],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'row', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);
    const rowsBefore = await dataGrid.dataRows.count();

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    expect(await dataGrid.dataRows.count()).toBe(rowsBefore + 1);

    const newRow = dataGrid.getDataRow(0);
    await newRow.getDataCell(1).element.locator('.dx-link-cancel').click();

    expect(await dataGrid.dataRows.count()).toBe(rowsBefore);
  });

  test('new row saves data correctly in row mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'id',
      columns: [{ dataField: 'id' }, { dataField: 'name' }],
      editing: { mode: 'row', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const newRow = dataGrid.getDataRow(0);
    await newRow.getDataCell(0).element.locator('.dx-texteditor-input').fill('10');
    await newRow.getDataCell(1).element.locator('.dx-texteditor-input').fill('NewItem');
    await newRow.getDataCell(2).element.locator('.dx-link-save').click();

    await expect(dataGrid.dataRows.nth(0)).toBeVisible();
    const cellValue = await dataGrid.apiGetCellValue(0, 1);
    expect(cellValue).toBe('NewItem');
  });

  test('onInitNewRow should be called each time a new row is added', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'row', allowAdding: true },
      onInitNewRow(e: any) {
        const count = (window as any).initNewRowCallCount || 0;
        (window as any).initNewRowCallCount = count + 1;
        e.data.name = `Row ${count + 1}`;
      },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    const firstEditor = dataGrid.getDataRow(0).getDataCell(0).element.locator('.dx-texteditor-input');
    await expect(firstEditor).toHaveValue('Row 1');
    await dataGrid.getDataRow(0).getDataCell(1).element.locator('.dx-link-cancel').click();

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    const secondEditor = dataGrid.getDataRow(0).getDataCell(0).element.locator('.dx-texteditor-input');
    await expect(secondEditor).toHaveValue('Row 2');

    const callCount = await page.evaluate(() => (window as any).initNewRowCallCount);
    expect(callCount).toBe(2);
  });

  test('new row in popup mode can be cancelled without errors', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'Item 1' }],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'popup', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);
    const rowsBefore = await dataGrid.dataRows.count();

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    await expect(dataGrid.getPopupEditForm().element).toBeVisible();

    await dataGrid.getPopupEditForm().cancelButton.click();
    await expect(dataGrid.getPopupEditForm().element).toBeHidden();

    expect(await dataGrid.dataRows.count()).toBe(rowsBefore);
  });

  test('new row in form mode shows editor with default focus', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'Item 1' }],
      keyExpr: 'id',
      columns: ['name'],
      editing: { mode: 'form', allowAdding: true },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getAddRowButton().click();

    const editForm = dataGrid.getEditForm();
    await expect(editForm.element).toBeVisible();

    const formEditor = editForm.element.locator('.dx-texteditor-input').first();
    await expect(formEditor).toBeVisible();
  });
});
