import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('No Data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_CONTAINER = '#container';

  test('The noDataText element should be rendered when a lookup column is filtered (T1293839)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { ID: 1, Name: 'John', Lookup: 1 },
          { ID: 2, Name: 'Jane', Lookup: 2 },
        ],
        keyExpr: 'ID',
        columns: ['Name', {
          dataField: 'Lookup',
          lookup: {
            dataSource: [
              { ID: 1, Text: 'Item 1' },
              { ID: 2, Text: 'Item 2' },
            ],
            valueExpr: 'ID',
            displayExpr: 'Text',
          },
        }],
        showBorders: true,
        filterRow: { visible: true },
        onEditorPreparing(e) {
          e.updateValueTimeout = 0;
        },
      });

    // arrange
      const nameFilterInput = page.locator('.dx-datagrid-filter-row td').nth(0).getEditorInput().element;
    const lookupFilterEditor = dataGrid.getFilterEditor(1, SelectBox);

    // assert
    expect(await page.locator('.dx-datagrid').first().isVisible());
    await t.ok();

    // act
    await (lookupFilterEditor.element).click();

    // assert
    expect(await lookupFilterEditor.isVisible()()).toBeTruthy();

    // act
    const lookupList = await lookupFilterEditor.getList();
    const lookupItem = lookupList.getItem(1);
    await (lookupItem.element).click();
    await (nameFilterInput).fill('test');

    // assert
    expect(await page.locator('.dx-datagrid').first().isVisible());
    await t.ok();

    await testScreenshot(page, 'T1293839-grid-no-data-text-rendered.png', { element: page.locator('#container') });
  });
});
