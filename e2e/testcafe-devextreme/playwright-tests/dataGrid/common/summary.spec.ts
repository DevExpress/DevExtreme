import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('Group footer summary should be focusable', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
      ],
      columns: [
        'id',
        {
          dataField: 'value',
          groupIndex: 0,
        },
      ],
      summary: {
        groupItems: [
          {
            column: 'id',
            summaryType: 'count',
            showInGroupFooter: true,
          },
        ],
      },
    });

      await (page.locator('.dx-data-row').nth(4).locator('td').nth(1)).click();
    await page.keyboard.press('tab');

    await testScreenshot(page, 'group-summary-focused.png', { element: page.locator('#container') });
  });

  test('Total summary should be focusable', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
      ],
      summary: {
        totalItems: [
          {
            column: 'id',
            summaryType: 'count',
          },
        ],
      },
    });

    await page.locator('.dx-data-row').nth(3).click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'total-summary-focused.png', { element: page.locator('#container') });
  });

  test('Focused total summary should have right appearance with sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value1: 1, value2: 2 },
        { id: 2, value1: 1, value2: 2 },
        { id: 3, value1: 1, value2: 2 },
        { id: 4, value1: 1, value2: 2 },
      ],
      columns: [
        { dataField: 'value1', fixed: true },
        { dataField: 'value2' },
      ],
      summary: {
        totalItems: [
          { column: 'value1', summaryType: 'count' },
          { column: 'value2', summaryType: 'count' },
        ],
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await page.locator('.dx-data-row').nth(3).click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'total-summary-focused-with-sticky.png', { element: page.locator('#container') });
  });

  test('The group summary should be displayed next to the grouped value when the grouped column has the showWhenGrouped option enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value1: 1, value2: 2, value3: 3 },
        { id: 2, value1: 4, value2: 5, value3: 6 },
        { id: 3, value1: 7, value2: 8, value3: 9 },
        { id: 4, value1: 10, value2: 11, value3: 12 },
      ],
      columns: [
        'id',
        'value1',
        'value2',
        {
          dataField: 'value3',
          groupIndex: 0,
          showWhenGrouped: true,
        },
      ],
      summary: {
        groupItems: [
          {
            column: 'value3',
            summaryType: 'count',
            displayFormat: '{0} VALUE3 GROUP COUNT',
            alignByColumn: true,
          },
        ],
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
    await testScreenshot(page, 'group-summary-when-grouped-column-has-showWhenGrouped.png', { element: page.locator('#container') });
  });

  test('Group footer navigation should work without keyboard trap', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value1: 1, value2: 1 },
        { id: 2, value1: 1, value2: 1 },
        { id: 3, value1: 1, value2: 1 },
        { id: 4, value1: 1, value2: 1 },
      ],
      columns: [
        'id',
        { dataField: 'value1', groupIndex: 0 },
        'value2',
      ],
      summary: {
        groupItems: [
          { column: 'id', summaryType: 'count', showInGroupFooter: true },
        ],
        totalItems: [
          { column: 'id', summaryType: 'count' },
        ],
      },
    });

    await page.locator('.dx-data-row').nth(4).locator('td').nth(1).click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');

    await expect(page.locator('.dx-footer-row')).toBeFocused();
  });
});
