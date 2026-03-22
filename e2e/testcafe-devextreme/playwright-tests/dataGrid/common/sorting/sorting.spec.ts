import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Filter expression should be valid when sortingMethod, remoteOperations, and autoNavigateToFocusedRow are specified (T1200546)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const sampleData = Array.from({ length: 20 }, (_, i) => ({ ID: i + 1, Name: `Name ${i + 1}` }));
      const sampleAPI = new (window as any).DevExpress.data.ArrayStore(sampleData);
      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        load(o) {
          if (o.filter && typeof o.filter[0] === 'function') {
            return Promise.reject();
          }
          return Promise.all([sampleAPI.load(o), sampleAPI.totalCount(o)]).then((res) => ({
            data: res[0],
            totalCount: res[1],
          }));
        },
      });
      return {
        dataSource: store,
        remoteOperations: true,
        columns: ['ID', {
          dataField: 'Name',
          sortOrder: 'asc',
          sortingMethod() {
            return 1;
          },
        }],
        paging: { pageSize: 5 },
        scrolling: { mode: 'virtual' },
        height: 200,
        showBorders: true,
        focusedRowEnabled: true,
        focusedRowKey: 18,
        autoNavigateToFocusedRow: true,
      };
    });

      // assert
    expect(await dataGrid.dataRows.count);
    await t.eql(6);
    expect(await dataGrid.getErrorRow().exists);
    await t.eql(false);
  });
});
