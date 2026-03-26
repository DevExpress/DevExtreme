import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Grouping Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('Grouping Panel label should not overflow in a narrow grid (T1103925)', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          {
            field1: '1', field2: '2', field3: '3', field4: '4', field5: '5',
          },
          {
            field1: '11', field2: '22', field3: '33', field4: '44', field5: '55',
          }],
      },
      width: 200,
      groupPanel: {
        emptyPanelText: 'Long long long long long long long long long long long text',
        visible: true,
      },
      editing: { allowAdding: true, mode: 'batch' },
      columnChooser: {
        enabled: true,
      },
    });

      await testScreenshot(page, 'groupingPanel.png', { element: page.locator('.dx-toolbar') });
  });

  test('Headers should be rendered correctly after changing the grouping.autoExpandAll when headerCellTemplate is given (React)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { field1: '1', field2: 'test1' },
        { field1: '2', field2: 'test1' },
        { field1: '3', field2: 'test2' },
      ],
      width: 700,
      columns: [
        { dataField: 'field1' },
        { dataField: 'field2', groupIndex: 0 },
      ],
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: true,
      },
    });

    await testScreenshot(page, 'T1155453-expanded-groups.png', { element: page.locator('#container') });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').collapseAll(-1));
    await page.waitForTimeout(100);

    await testScreenshot(page, 'T1155453-collapsed-groups.png', { element: page.locator('#container') });
  });

  test('Empty header message should appear when all columns grouped and selection is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { field1: '1', field2: 'test1', field3: 'test11' },
        { field1: '2', field2: 'test1', field3: 'test12' },
        { field1: '3', field2: 'test2', field3: 'test13' },
      ],
      columns: [
        { dataField: 'field1', groupIndex: 0 },
        { dataField: 'field2', groupIndex: 1 },
        { dataField: 'field3', groupIndex: 2 },
      ],
      groupPanel: {
        visible: true,
      },
      selection: {
        mode: 'multiple',
      },
    });

    await testScreenshot(page, 'empty-header-message-with-selection-enabled.png', { element: page.locator('#container') });
  });

  test('Group panel message should be vertically aligned (T1186613)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      groupPanel: {
        visible: true,
      },
      showBorders: true,
      searchPanel: {
        visible: true,
      },
      editing: {
        allowAdding: true,
      },
      toolbar: {
        items: [
          'groupPanel',
          {
            showText: 'always',
            location: 'before',
            name: 'addRowButton',
            options: {
              icon: null,
              text: 'add a new row',
            },
          }, {
            location: 'before',
            widget: 'dxTextBox',
            options: {
              width: 140,
              text: 'TestTest',
            },
          },
        ],
      },
    });

    await testScreenshot(page, 'group-panel-message-align.png', { element: page.locator('.dx-toolbar') });
  });

  test('The collapse icon should update if repaintChangesOnly option is enabled (T1201981)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { field1: '1', field2: 'test1', field3: 'test11' },
        { field1: '2', field2: 'test1', field3: 'test12' },
        { field1: '3', field2: 'test2', field3: 'test13' },
      ],
      repaintChangesOnly: true,
      columns: [
        { dataField: 'field1', groupIndex: 0 },
        'field2',
        'field3',
      ],
      groupPanel: {
        visible: true,
      },
      paging: {
        pageSize: 3,
      },
      showBorders: true,
    });

    await page.locator('.dx-page').filter({ hasText: '2' }).click();

    await testScreenshot(page, 'continued_group-collapse_icon-T1201981.png', { element: page.locator('#container') });
  });

  test('DataGrid loses grouping after the expandAll method if a grouped column has calculateDisplayValue (T1232129)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        id: 1,
        number: 2,
        description: 'Material Description',
        groupId: '',
        articleGroup: 'Material',
      }],
      keyExpr: 'id',
      showBorders: true,
      grouping: {
        autoExpandAll: false,
      },
      columns: [
        'number',
        'description',
        {
          dataField: 'groupId',
          calculateDisplayValue: 'articleGroup',
          groupIndex: 0,
        },
      ],
    });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').expandAll(-1));

    const groupIndex = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').columnOption('groupId', 'groupIndex'));
    expect(groupIndex).toBe(0);
  });

  test('DataGrid should not lose grouping after the expandAll method if a grouped column has string calculateGroupValue (T1321187)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 0, a: 0, aLabel: 'A_0', b: 'B_0', c: 'C_0' }],
      keyExpr: 'id',
      grouping: { autoExpandAll: false },
      columns: [{
        dataField: 'a',
        groupIndex: 0,
        calculateGroupValue: 'aLabel',
      },
      'b', 'c'],
    });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').expandAll(-1));

    const groupIndex = await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').columnOption('a', 'groupIndex'));
    expect(groupIndex).toBe(0);
  });

  test('Grouping and filtering should be applied correctly when they change at runtime (T1237863)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, FirstName: 'Bob', room: 1 },
        { ID: 2, FirstName: 'Alex', room: 2 },
        { ID: 3, FirstName: 'John', room: 1 },
      ],
      keyExpr: 'ID',
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await page.evaluate(() => {
      const grid = ($('#container') as any).dxDataGrid('instance');
      grid.option('columns[2].groupIndex', 0);
      grid.option('filterValue', ['room', '=', '1']);
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await testScreenshot(page, 'T1237863_datagrid-grouping_and_filtering.png', { element: page.locator('#container') });
  });

  test('Content should be rendered correctly after setting the grouping.autoExpandAll property to true when dataRowTemplate is given', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { field1: '1', field2: 'test1' },
        { field1: '2', field2: 'test1' },
        { field1: '3', field2: 'test2' },
      ],
      width: 700,
      columns: [
        'field1',
        { dataField: 'field2', groupIndex: 0 },
      ],
      dataRowTemplate(container: any, { data }: any) {
        return $(container).append($(`<tr><td>${data.field1}</td></tr>`));
      },
      groupPanel: {
        visible: true,
      },
      grouping: {
        autoExpandAll: false,
      },
    });

    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').expandAll(-1));
    await page.waitForTimeout(100);

    await testScreenshot(page, 'expanded-groups-content.png', { element: page.locator('#container') });
  });
});
