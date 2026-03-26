import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - custom buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Custom buttons cell should be focused before custom buttons on tab navigation', async ({ page }) => {
    // TODO: Playwright migration - dx-focused class not applied to buttons cell after Tab key press
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      keyExpr: 'id',
      keyboardNavigation: {
        enabled: true,
      },
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        'name',
        {
          type: 'buttons',
          buttons: [
            { name: 'edit', text: 'Edit' },
            { name: 'custom', text: 'Custom' },
          ],
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.focus();

    const firstCell = dataGrid.getDataCell(0, 0);
    await firstCell.element.click();

    await page.keyboard.press('Tab');

    const buttonsCell = dataGrid.getDataCell(0, 1);
    const isFocused = await buttonsCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });
});
