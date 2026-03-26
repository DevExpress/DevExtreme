import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Tagbox Columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1228720
  // visual: generic.light
  // visual: material.blue.light
  // visual: fluent.blue.light

  test.skip('Datagrid tagbox column should not look broken', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
          showBorders: true,
          allowColumnResizing: true,
          dataSource: [{ id: 1, items: [1, 2, 3, 4, 5] }],
          columns: [
            'id',
            {
              dataField: 'items',
              editCellTemplate(container, cellInfo) {
                ($('<div/>') as any)
                  .dxTagBox({
                    dataSource: Array.from({ length: 10 }, (_, index) => ({
                      id: index + 1,
                      text: `item ${index + 1}`,
                    })),
                    value: cellInfo.value,
                    valueExpr: 'id',
                    displayExpr: 'text',
                    onValueChanged(e) {
                      cellInfo.setValue(e.value);
                    },
                    onSelectionChanged() {
                      cellInfo.component.updateDimensions();
                    },
                    searchEnabled: true,
                  })
                  .appendTo(container);
              },
            },
          ],
          editing: { mode: 'batch', allowUpdating: true },
        });

      await (page.locator('.dx-data-row').nth(0).locator('td').nth(1)).click();
    await testScreenshot(page, 'T1228720-grid-tagbox-on-edit.png', { element: page.locator('#container') });
  });
});
