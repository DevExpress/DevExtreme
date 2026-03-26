import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Column chooser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  (['dragAndDrop', 'select'] as const).forEach((mode) => {
    test(`Column chooser screenshot in mode=${mode}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(20, 3),
        height: 400,
        showBorders: true,
        columns: [{
          dataField: 'field_0',
          dataType: 'string',
        }, {
          dataField: 'field_1',
          dataType: 'string',
        }, {
          dataField: 'field_2',
          dataType: 'string',
          visible: false,
        }],
        columnChooser: {
          enabled: true,
          mode,
        },
      });

      await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').showColumnChooser());

      const columnChooser = page.locator('.dx-datagrid-column-chooser').last();
      await expect(columnChooser).toBeVisible();

      await testScreenshot(page, `column-chooser-${mode}-mode.png`, { element: page.locator('#container') });
    });
  });

  test('Empty column chooser', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      columnChooser: { enabled: true },
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getColumnChooserButton().click();

    const columnChooser = dataGrid.getColumnChooser();
    await expect(columnChooser).toBeVisible();

    await testScreenshot(page, 'empty-column-chooser.png');
  });

  test('Column chooser checkboxes should be aligned correctly with plain structure', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: ['field1', 'field2', 'field3'],
      width: 700,
      columnChooser: {
        enabled: true,
        mode: 'select',
        search: { enabled: true },
        selection: { allowSelectAll: true },
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getHeaderPanel().getColumnChooserButton().click();
    await page.waitForTimeout(100);

    const columnChooser = dataGrid.getColumnChooser();
    await expect(columnChooser).toBeVisible();

    await testScreenshot(page, 'column-chooser-checkbox-alignment-plain-structure.png', { element: columnChooser });
  });

  test('Column chooser checkboxes should be aligned correctly with tree structure', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: [
        'field1',
        { caption: 'band1', columns: ['field2', 'field3'] },
      ],
      width: 700,
      columnChooser: {
        enabled: true,
        mode: 'select',
        search: { enabled: true },
        selection: { allowSelectAll: true },
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getHeaderPanel().getColumnChooserButton().click();
    await page.waitForTimeout(100);

    const columnChooser = dataGrid.getColumnChooser();
    await expect(columnChooser).toBeVisible();

    await testScreenshot(page, 'column-chooser-checkbox-alignment-tree-structure.png', { element: columnChooser });
  });

  test('Column chooser should support string height and width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: ['field1', 'field2', 'field3'],
      width: 700,
      columnChooser: {
        enabled: true,
        height: '400px',
        width: '330px',
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getHeaderPanel().getColumnChooserButton().click();
    await page.waitForTimeout(100);

    const columnChooserContent = dataGrid.getColumnChooser().locator('.dx-popup-content');
    const height = await columnChooserContent.evaluate((el) => getComputedStyle(el).height);
    const width = await columnChooserContent.evaluate((el) => getComputedStyle(el).width);

    expect(height).toBe('400px');
    expect(width).toBe('330px');
  });

  test('Should take into account column options change during general option change (T1267471)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0, A: 'A', B: 'B' }],
      keyExpr: 'id',
      columns: ['A', 'B'],
      columnChooser: { enabled: true, mode: 'select' },
      onOptionChanged: ({ component, fullName }: any) => {
        if (!/columns\[\d+\]\.visible/.test(fullName)) return;
        const visibleColumns = component.getVisibleColumns();
        const [{ dataField: lastColumnDataField }] = visibleColumns;
        if (!lastColumnDataField) return;
        component.columnOption(lastColumnDataField, 'allowHiding', false);
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getColumnChooserButton().click();
    await page.waitForTimeout(100);

    const columnChooser = dataGrid.getColumnChooser();
    await expect(columnChooser).toBeVisible();

    const checkboxes = columnChooser.locator('.dx-checkbox');
    const isDisabled0 = await checkboxes.nth(0).evaluate((el) => el.classList.contains('dx-state-disabled'));
    const isDisabled1 = await checkboxes.nth(1).evaluate((el) => el.classList.contains('dx-state-disabled'));

    expect(isDisabled0).toBeFalsy();
    expect(isDisabled1).toBeFalsy();

    await checkboxes.nth(1).click();
    await page.waitForTimeout(100);

    const isDisabled0After = await checkboxes.nth(0).evaluate((el) => el.classList.contains('dx-state-disabled'));
    expect(isDisabled0After).toBeTruthy();
  });

  test('ColumnChooser should receive and render custom texts', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.localization.loadMessages({
        en: {
          'dxDataGrid-columnChooserTitle': 'customTitle',
          'dxDataGrid-columnChooserEmptyText': 'customEmptyText',
        },
      });
    });

    await createWidget(page, 'dxDataGrid', {
      columnChooser: {
        height: '340px',
        enabled: true,
        mode: 'dragAndDrop',
        position: {
          my: 'right top',
          at: 'right bottom',
          of: '.dx-datagrid-column-chooser-button',
        },
      },
      dataSource: [],
      columns: [],
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getColumnChooserButton().click();
    await page.waitForTimeout(100);

    const columnChooser = dataGrid.getColumnChooser();
    await expect(columnChooser).toBeVisible();

    const titleText = await columnChooser.locator('.dx-popup-title').textContent();
    const emptyText = await columnChooser.locator('.dx-datagrid-column-chooser-plain').textContent();

    expect(titleText?.trim()).toBe('customTitle');
    expect(emptyText?.trim()).toBe('customEmptyText');
  });
});
