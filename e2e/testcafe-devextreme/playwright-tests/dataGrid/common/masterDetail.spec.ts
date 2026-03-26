import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Master detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('pageSizeSelector has correct layout inside masterDetail (T1113525)', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      masterDetail: {
        enabled: true,
        template(container: any) {
          ($('<div>') as any)
            .dxDataGrid({
              pager: {
                displayMode: 'compact',
                showPageSizeSelector: true,
                visible: true,
              },
              columns: ['detail1'],
              dataSource: [],
            })
            .appendTo(container);
        },
      },
    });

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').first().click();

    const masterRow = page.locator('.dx-master-detail-row').nth(0);
    const masterGrid = masterRow.locator('.dx-datagrid');

    await testScreenshot(page, 'T1113525.page-size-select.png', { element: masterGrid });
  });

  test('The master detail row should display correctly when renderAsync, virtual scrolling and column fixing features are enabled (T1159578)', async ({ page }) => {
    const dataGrid = new DataGrid(page);
    await page.setViewportSize({ width: 800, height: 800 });
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(40)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      showBorders: true,
      height: 700,
      renderAsync: true,
      masterDetail: {
        enabled: true,
      },
      scrolling: {
        mode: 'virtual',
      },
    });

    await testScreenshot(page, 'T1159578-master-detail-with-renderAsync-1.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ y: 400 });
    await page.waitForTimeout(300);

    await dataGrid.getDataRow(16).element.locator('.dx-command-expand').first().click();

    await testScreenshot(page, 'T1159578-master-detail-with-renderAsync-2.png', { element: page.locator('#container') });
  });

  test.skip('Checkbox align right in masterdetail (T1045321) generic.light', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Prefix: 'Mr.',
      }],
      keyExpr: 'ID',
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'Prefix',
          caption: 'Title',
          width: 400,
        },
      ],
      masterDetail: {
        autoExpandAll: true,
        enabled: true,
        template(container: any) {
          ($('<div>') as any)
            .dxTreeList({
              columnAutoWidth: true,
              showBorders: true,
              selection: {
                mode: 'multiple',
              },
              dataSource: [{
                ID: 1,
                Title: 'CEO',
                Hire_Date: '1995-01-15',
              }],
              rootValue: -1,
              keyExpr: 'ID',
              parentIdExpr: 'Head_ID',
              columns: [
                {
                  dataField: 'Title',
                  caption: 'Position',
                  width: 200,
                },
                {
                  dataField: 'Hire_Date',
                  dataType: 'date',
                  width: 200,
                },
              ],
              showRowLines: true,
            })
            .appendTo(container);
        },
      },
    });

    await testScreenshot(page, 'T1045321.png');
  });
});
