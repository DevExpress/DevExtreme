import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - skip drag cell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The drag cell should be skipped when navigating from the header cell by tab keypress', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      keyExpr: 'id',
      keyboardNavigation: {
        enabled: true,
      },
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
      columns: ['name'],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.focus();

    const headerCell = dataGrid.getHeaderRow().locator('td').first();
    await headerCell.click();

    await page.keyboard.press('Tab');

    const firstDataCell = dataGrid.getDataCell(0, 0);
    const activeElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.className : '';
    });

    expect(activeElement).not.toContain('dx-command-drag');
  });
});
