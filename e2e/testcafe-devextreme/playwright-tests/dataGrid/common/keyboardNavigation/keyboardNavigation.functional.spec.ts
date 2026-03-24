import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Changing keyboardNavigation options should not invalidate the entire content (T1197829)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).invalidateCounter = 0;
      (window as any).renderTableCounter = 0;
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(5)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'text' },
      ],
      focusedRowEnabled: true,
      keyboardNavigation: {
        editOnKeyPress: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'column',
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onFocusedRowChanging(e) {
        if ((e.newRowIndex + 1) % 2 === 0) {
          e.component.option('keyboardNavigation.enterKeyAction', 'moveFocus');
        } else {
          e.component.option('keyboardNavigation.enterKeyAction', 'startEdit');
        }
      },
      onInitialized(e) {
        const dataGrid: any = e.component;
        const rowsView = dataGrid.getView('rowsView');
        // eslint-disable-next-line no-underscore-dangle
        const defaultInvalidate = rowsView._invalidate;
        // eslint-disable-next-line no-underscore-dangle
        dataGrid.getView('rowsView')._invalidate = (...args) => {
          ((window as any).invalidateCounter as number) += 1;
          return defaultInvalidate.apply(rowsView, args);
        };

        // eslint-disable-next-line no-underscore-dangle
        const defaultRenderTable = rowsView._renderTable;
        // eslint-disable-next-line no-underscore-dangle
        dataGrid.getView('rowsView')._renderTable = (...args) => {
          ((window as any).renderTableCounter as number) += 1;
          return defaultRenderTable.apply(rowsView, args);
        };
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    const invalidateCount1 = await page.evaluate(() => (window as any).invalidateCounter);
    expect(invalidateCount1).toBe(0);
    const renderTableCount1 = await page.evaluate(() => (window as any).renderTableCounter);
    expect(renderTableCount1).toBe(2);

    await page.locator('.dx-data-row').nth(1).locator('td').nth(1).click();

    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await page.locator('.dx-data-row').nth(1).locator('td').nth(1).click();

    await page.keyboard.press('Tab');

    const invalidateCount2 = await page.evaluate(() => (window as any).invalidateCounter);
    expect(invalidateCount2).toBe(0);
    const renderTableCount2 = await page.evaluate(() => (window as any).renderTableCounter);
    expect(renderTableCount2).toBe(9);
  });
});
