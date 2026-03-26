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
  test.skip('selectAll state should be correct after unselect item if refresh(true) is called inside onSelectionChanged (T1048081)', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (new CheckBox, checkBox.option, firstRowSelectionCheckBox.element)
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
      onSelectionChanged(e) {
        e.component.refresh(true);
      },
    });

      const firstRowSelectionCheckBox = new CheckBox(page.locator('.dx-data-row').nth(0).locator('td').nth(0).locator('.dx-editor-cell'));
    const selectAllCheckBox = new CheckBox(
      page.locator('.dx-header-row').nth(0).locator('td').nth(0).locator('.dx-editor-cell'),
    );

    // act
    await (firstRowSelectionCheckBox.element).click();
    // assert
    expect(await selectAllCheckBox.option('value')).toBe(undefined);
    expect(await firstRowSelectionCheckBox.option('value')).toBe(false);
  });

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
});
