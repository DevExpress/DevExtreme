import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Search Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1046688
  // visual: material.blue.light

  test.skip('searchPanel has correct view inside masterDetail', async ({ page }) => {
    // TODO: Playwright migration - masterRow.getDataGrid() is not a function
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      masterDetail: {
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxDataGrid({
              searchPanel: {
                visible: true,
                width: 240,
                placeholder: 'Search...',
              },
              columns: ['detail1'],
              dataSource: [],
            })
            .appendTo(container);
        },
      },
    });

      // act
    await (page.locator('.dx-data-row').nth(0).locator('.dx-command-edit').nth(0)).click();

    const masterRow = page.locator('.dx-master-detail-row').nth(0);
    const masterGrid = masterRow.getDataGrid();

    // assert
    await testScreenshot(page, 'T1046688.searchPanel.png', { element: masterGrid.element });
  });

  // T1046688 - simplified visual test without masterDetail.getDataGrid()
  test('searchPanel has correct view inside masterDetail (visual)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      masterDetail: {
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxDataGrid({
              searchPanel: {
                visible: true,
                width: 240,
                placeholder: 'Search...',
              },
              columns: ['detail1'],
              dataSource: [],
            })
            .appendTo(container);
        },
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await dataGrid.getDataRow(0).element.locator('.dx-datagrid-expand').click();
    await page.waitForTimeout(100);

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    const searchPanel = masterDetailRow.locator('.dx-searchbox');
    await expect(searchPanel).toBeVisible();

    await testScreenshot(page, 'T1046688.searchPanel.png', { element: masterDetailRow.locator('.dx-datagrid') });
  });

  // T1272535
  test('Base sensitivity search should accept rows with accent letters in lookup columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { id: 1, text: 'tešt', lookup: 1 },
          { id: 2, text: 'test', lookup: 2 },
          { id: 3, text: 'chest', lookup: 3 },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: { sensitivity: 'base' },
        },
      },
      keyExpr: 'id',
      searchPanel: { visible: true },
      columns: ['id', 'text', {
        dataField: 'lookup',
        lookup: {
          dataSource: [
            { id: 1, text: 'another' },
            { id: 2, text: 'ánother' },
            { id: 3, text: 'other' },
          ],
          valueExpr: 'id',
          displayExpr: 'text',
        },
      }],
    });

    const dataGrid = new DataGrid(page, '#container');
    const searchInput = dataGrid.getSearchBox().locator('input');
    await searchInput.click();
    await searchInput.press('a');
    await page.waitForTimeout(300);

    const dataRowCount = await dataGrid.dataRows.count();
    expect(dataRowCount).toBe(2);

    await expect(dataGrid.dataRows.filter({ hasText: 'another' })).toBeVisible();
    await expect(dataGrid.dataRows.filter({ hasText: 'ánother' })).toBeVisible();
  });
});
