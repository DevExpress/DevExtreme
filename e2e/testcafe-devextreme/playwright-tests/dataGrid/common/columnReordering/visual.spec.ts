import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Column reordering.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // TODO: needs DataGrid page object for getGroupPanel, MouseUpEvents, drag
  test.skip('column separator should work properly with expand columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          width: 200,
          groupIndex: 0,
        }, {
          dataField: 'field2',
          width: 200,
          groupIndex: 1,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: true,
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });
});
