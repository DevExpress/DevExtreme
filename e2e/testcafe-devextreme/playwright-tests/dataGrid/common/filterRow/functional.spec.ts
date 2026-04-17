import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FilterRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Filter should reset if the filter row editor text is cleared (T1257261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ],
      keyExpr: 'id',
      filterRow: { visible: true },
      columns: ['id', 'name'],
    });

    const dataGrid = new DataGrid(page);
    const filterEditor = await dataGrid.getFilterEditor(1);

    await filterEditor.click();
    await filterEditor.fill('Alice');
    await page.keyboard.press('Enter');

    await expect(dataGrid.dataRows).toHaveCount(1);

    await filterEditor.click();
    await filterEditor.fill('');
    await page.keyboard.press('Enter');

    await expect(dataGrid.dataRows).toHaveCount(3);
  });

  test('DataGrid - filter row\'s search-box\'s aria-label should be customizable via localization', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.localization.loadMessages({
        en: {
          'dxDataGrid-ariaSearchBox': 'custom text',
        },
      });
    });

    await createWidget(page, 'dxDataGrid', {
      columns: [{
        dataField: 'test',
        dataType: 'string',
      }],
      filterRow: {
        visible: true,
      },
    });

    const ariaLabel = await page.locator('.dx-datagrid-filter-row td').first().locator('.dx-menu-item').first().getAttribute('aria-label');

    expect(ariaLabel).toBe('custom text');
  });

  test('Filter Row\'s Reset button does not work after a custom filter is set in Filter Builder', async ({ page }) => {
    const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
      const items: Record<string, string>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const item: Record<string, string> = {};
        for (let j = 0; j < colCount; j++) item[`field_${j}`] = `${i}_${j}`;
        items.push(item);
      }
      return items;
    };

    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 1),
      height: 400,
      showBorders: true,
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      filterBuilder: {
        customOperations: [
          {
            name: 'custom',
            caption: 'custom',
            dataTypes: ['string'],
            icon: 'check',
            hasValue: false,
            calculateFilterExpression() {
              return [['Field 0', '=', 0]];
            },
          },
        ],
        allowHierarchicalFields: true,
      },
      filterPanel: { visible: true },
      filterValue: [['field_0', 'custom']],
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.dataRows).toHaveCount(0);

    const filterMenuButton = page.locator('.dx-datagrid-filter-row td').first().locator('.dx-menu-item');
    await filterMenuButton.click();

    const resetItem = page.locator('.dx-menu-item').filter({ hasText: 'Reset' });
    await resetItem.click();

    await expect(dataGrid.dataRows).not.toHaveCount(0);
  });
});
