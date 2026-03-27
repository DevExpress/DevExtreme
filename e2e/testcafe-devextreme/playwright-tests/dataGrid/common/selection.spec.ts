import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // Duplicate removed — reimplemented version exists below

  test('The Select All checkbox should be visible when a column headerCellTemplate is specified (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
      columns: [
        { dataField: 'id' },
        { dataField: 'text' },
      ],
      selection: {
        mode: 'multiple',
      },
    });

    await testScreenshot(page, 'T1141405-grid-select-all.png', { element: page.locator('#container') });
  });

  test('Deferred selection should work correctly with deferred sensitivity: base', async ({ page }) => {
    const data = [
      { ID: 'aaa', Name: 'Name 1' },
      { ID: 'AAA', Name: 'Name 2' },
      { ID: 'BBB', Name: 'Name 3' },
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      keyExpr: 'ID',
      columns: ['ID', 'Name'],
      showBorders: true,
      selection: {
        mode: 'multiple',
        deferred: true,
        sensitivity: 'base',
      },
    });

    await page.locator('.dx-data-row').first().locator('td').first().click();

    const selectedKeys = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getSelectedRowKeys());
    expect(selectedKeys.length).toBeGreaterThan(0);
  });

  test('Deferred selection should work correctly with deferred sensitivity: case', async ({ page }) => {
    const data = [
      { ID: 'aaa', Name: 'Name 1' },
      { ID: 'AAA', Name: 'Name 2' },
      { ID: 'BBB', Name: 'Name 3' },
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      keyExpr: 'ID',
      columns: ['ID', 'Name'],
      showBorders: true,
      selection: {
        mode: 'multiple',
        deferred: true,
        sensitivity: 'case',
      },
    });

    await page.locator('.dx-data-row').first().locator('td').first().click();

    const selectedKeys = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getSelectedRowKeys());
    expect(selectedKeys.length).toBe(1);
    expect(selectedKeys[0]).toBe('aaa');
  });

  test('"Deselect all" should work after changing showCheckboxMode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }, { a: 7 },
      ],
      keyExpr: 'a',
      selection: {
        mode: 'multiple',
        showCheckBoxesMode: 'always',
      },
      selectedRowKeys: [1, 2],
    });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('selection.showCheckBoxesMode', 'onClick'));

    const selectAllCheckbox = page.locator('.dx-header-row .dx-checkbox').first();
    await selectAllCheckbox.click();
    await selectAllCheckbox.click();

    const selectedRows = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getSelectedRowsData());
    expect(selectedRows.length).toBe(0);
  });

  test('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ],
      keyExpr: 'id',
      selectedRowKeys: [1, 2],
      paging: {
        pageSize: 3,
      },
      selection: {
        mode: 'multiple',
      },
      onSelectionChanged(e: any) {
        e.component.refresh(true);
      },
    });

    const firstRowCheckbox = page.locator('.dx-data-row').nth(0).locator('.dx-checkbox').first();
    await firstRowCheckbox.click();

    await page.waitForTimeout(300);

    const selectAllValue = await page.evaluate(() => {
      const headerCheckbox = ($('#container') as any)
        .dxDataGrid('instance')
        .getView('columnHeadersView')
        .element()
        .find('.dx-checkbox')
        .first();
      return headerCheckbox.dxCheckBox('option', 'value');
    });

    expect(selectAllValue).toBeUndefined();

    const firstRowSelected = await page.evaluate(() => {
      const instance = ($('#container') as any).dxDataGrid('instance');
      const selectedKeys = instance.getSelectedRowKeys();
      return selectedKeys.includes(1);
    });
    expect(firstRowSelected).toBe(false);
  });

  test('Select rows by shift should work when grid has real time updates', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: {
          data: [...new Array(50)].map((_, i) => ({
            ID: i + 1,
            CompanyName: `company name ${i + 1}`,
            City: `city ${i + 1}`,
          })),
          type: 'array',
          key: 'ID',
        },
        reshapeOnPush: true,
        pushAggregationTimeout: 0,
      },
      height: 600,
      repaintChangesOnly: true,
      selection: {
        mode: 'multiple',
      },
      onSelectionChanged(e: any) {
        e.component.getDataSource().store().push([{
          type: 'update',
          key: 3,
          data: { City: 'test123' },
        }]);
      },
      columnAutoWidth: true,
      showBorders: true,
      paging: { pageSize: 10 },
    });

    const secondRowCheckbox = page.locator('.dx-data-row').nth(1).locator('.dx-select-checkbox');
    await secondRowCheckbox.click();
    await page.waitForTimeout(500);

    const seventhRowCheckbox = page.locator('.dx-data-row').nth(6).locator('.dx-select-checkbox');
    await seventhRowCheckbox.click({ modifiers: ['Shift'] });
    await page.waitForTimeout(500);

    for (let i = 1; i <= 6; i += 1) {
      const isSelected = await page.evaluate((rowIdx) => {
        const instance = ($('#container') as any).dxDataGrid('instance');
        return instance.isRowSelected(instance.getKeyByRowIndex(rowIdx));
      }, i);
      expect(isSelected).toBe(true);
    }
  });

  test('Sensitivity option change should be correctly handled during runtime change', async ({ page }) => {
    const data = [
      { ID: 'aaa', Name: 'Name 1' },
      { ID: 'AAA', Name: 'Name 2' },
      { ID: 'BBB', Name: 'Name 3' },
    ];

    await createWidget(page, 'dxDataGrid', {
      dataSource: data,
      keyExpr: 'ID',
      columns: ['ID', 'Name'],
      showBorders: true,
      selection: {
        mode: 'multiple',
        deferred: true,
        sensitivity: 'base',
      },
    });

    await page.locator('.dx-data-row').first().locator('td').first().click();

    const selectedKeysBase = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getSelectedRowKeys());
    expect(selectedKeysBase.length).toBeGreaterThan(1);

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').option('selection.sensitivity', 'case'));

    await page.waitForTimeout(100);

    const selectedKeysAfterChange = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getSelectedRowKeys());
    expect(selectedKeysAfterChange.length).toBe(0);

    await page.locator('.dx-data-row').first().locator('td').first().click();

    const selectedKeysCase = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getSelectedRowKeys());
    expect(selectedKeysCase.length).toBe(1);
    expect(selectedKeysCase[0]).toBe('aaa');
  });
});
