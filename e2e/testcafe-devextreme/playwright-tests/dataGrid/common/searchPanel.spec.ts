import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
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
});
