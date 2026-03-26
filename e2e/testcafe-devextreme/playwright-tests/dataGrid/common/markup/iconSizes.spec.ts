import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Icon Sizes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: fluent.blue.light.compact

  test.skip('Correct icon sizes (T1207612)', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(3)].map((_, index) => ({ id: index, text: `item ${index}`, group: `group ${index % 2}` })),
        keyExpr: 'id',
        width: 550,
        columns: [
          { dataField: 'id' },
          { dataField: 'text', sortOrder: 'asc' },
          { dataField: 'group', groupIndex: 0 },
          { dataField: 'hidden', hidingPriority: 0 },
        ],
        editing: {
          allowAdding: true,
          allowUpdating: true,
          allowDeleting: true,
        },
        showBorders: true,
        filterValue: ['Id', '>=', 0],
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        filterRow: { visible: true },
        groupPanel: { visible: true },
        searchPanel: { visible: true },
        selection: { mode: 'multiple' },
        rowDragging: { allowReordering: true },
        columnChooser: { enabled: true },
        columnHidingEnabled: true,
        masterDetail: { enabled: true },
        export: { enabled: true },
        pager: {
          visible: true,
          allowedPageSizes: [5, 10, 'all'],
          showPageSizeSelector: true,
          showInfo: true,
          showNavigationButtons: true,
        },
      });

    await testScreenshot(page, 'icon-sizes.png');
  });
});
