import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Focus - cell with showEditorAlways', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const SELECTOR = '#container';
  const OVERLAY_SELECTOR = '.dx-overlay-wrapper';

  const createDataGrid = () => createWidget(page, 'dxDataGrid', {
    dataSource: [
      {
        A: 'A_0',
        B: 'B_0',
        C: 0,
        D: 'D_0',
      },
      {
        A: 'A_1',
        B: 'B_1',
        C: 1,
        D: 'D_1',
      },
      {
        A: 'A_2',
        B: 'B_2',
        C: 2,
        D: 'D_2',
      },
    ],
    columns: [
      {
        dataField: 'A',
        showEditorAlways: true,
      },
      {
        dataField: 'B',
        showEditorAlways: true,
      },
      {
        dataField: 'C',
        showEditorAlways: true,
        lookup: {
          dataSource: [
            {
              id: 0,
              name: 'LOOKUP_0',
            },
            {
              id: 1,
              name: 'LOOKUP_1',
            },
            {
              id: 2,
              name: 'LOOKUP_2',
            },
          ],
          displayExpr: 'name',
          valueExpr: 'id',
        },
      },
      {
        dataField: 'D',
        showEditorAlways: true,
      },
    ],
    editing: {
      mode: 'cell',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
    },
  });

  test('Should switch focus after the lookup value change [T1194403]', async ({ page }) => {
    await createDataGrid();

      const editorTextCell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
    const lookupCell = page.locator('.dx-data-row').nth(0).locator('td').nth(2).locator('.dx-editor-cell');

    await (lookupCell.element).click();

    const list = new List(OVERLAY_SELECTOR);
    const item = list.getItem(2);

    await (item.element).click();
    await (editorTextCell.element).click();

    await testScreenshot(page, 'focus-edit-cell_after-lookup-change.png', { element: page.locator('#container') });
  });
});
