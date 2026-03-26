import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - Column Reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((rtlEnabled) => {
    test(`reorder column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field1: 'test1', field2: 'test2', field3: 'test3',
          },
        ],
        rtlEnabled,
        allowColumnReordering: true,
        columns: [
          { dataField: 'field1' },
          { dataField: 'field2' },
          { dataField: 'field3' },
        ],
      });

      const dataGrid = new DataGrid(page);
      const headerRow = dataGrid.getHeaderRow();
      const firstHeaderCell = headerRow.locator('td').nth(0);

      await firstHeaderCell.click();

      const arrowKey = rtlEnabled ? 'ArrowLeft' : 'ArrowRight';
      await page.keyboard.press(arrowKey);

      await testScreenshot(page, `column-reorder-keyboard-rtl-${rtlEnabled}.png`, {
        element: '#container',
      });
    });

    test(`reorder column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        allowColumnReordering: true,
        dataSource: [{
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        }],
      });

      const dataGrid = new DataGrid(page);
      const lastHeaderCell = dataGrid.getHeaderRow().locator('td').nth(3);

      await lastHeaderCell.click();

      const shortcut = rtlEnabled ? 'Control+ArrowRight' : 'Control+ArrowLeft';
      await page.keyboard.press(shortcut);

      await testScreenshot(page, `reorder_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: page.locator('#container') });
    });
  });

  test('The column should not be reordered when allowColumnReordering is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: false,
      dataSource: [{
        field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
      }],
    });

    const dataGrid = new DataGrid(page);
    const firstHeaderCell = dataGrid.getHeaderRow().locator('td').nth(0);

    await firstHeaderCell.click();
    await page.keyboard.press('Control+ArrowRight');

    await testScreenshot(page, 'reorder_column_when_allowColumnReordering_is_false.png', { element: page.locator('#container') });
  });

  test('The column should not be reordered when it has allowReordering set to false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
      }],
      columns: [
        { dataField: 'field1', allowReordering: false },
        'field2',
        'field3',
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page);
    const firstHeaderCell = dataGrid.getHeaderRow().locator('td').nth(0);

    await firstHeaderCell.click();
    await page.keyboard.press('Control+ArrowRight');

    await testScreenshot(page, 'reorder_column_with_allowReordering_is_false.png', { element: page.locator('#container') });
  });

  test('The column should not be reordered when allowColumnReordering is false and group panel is visible', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: false,
      groupPanel: {
        visible: true,
        allowColumnDragging: true,
      },
      dataSource: [{
        field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
      }],
    });

    const dataGrid = new DataGrid(page);
    const firstHeaderCell = dataGrid.getHeaderRow().locator('td').nth(0);

    await firstHeaderCell.click();
    await page.keyboard.press('Control+ArrowRight');

    await testScreenshot(page, 'reorder_column_when_allowColumnReordering_is_false_and_group_panel_is_visible.png', { element: page.locator('#container') });
  });

  test('The cell focus should be correct after column reordering when previously the data cell was focused', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
      }],
    });

    const dataGrid = new DataGrid(page);
    const firstDataCell = dataGrid.getDataCell(0, 0);

    await firstDataCell.click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Control+ArrowLeft');

    await testScreenshot(page, 'cell_focus_after_column_reordering_when_data_cell_was_focused.png', { element: page.locator('#container') });
  });

  test('reorder fixed left column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        field5: 'test5', field6: 'test6', field7: 'test7', field8: 'test8',
      }],
      customizeColumns: (columns: any[]) => {
        columns[0].fixed = true;
        columns[7].fixed = true;
      },
    });

    const dataGrid = new DataGrid(page);
    const firstFixedLeftHeader = dataGrid.getHeaderRow().locator('td').nth(0);

    await firstFixedLeftHeader.click();
    await page.keyboard.press('Control+ArrowRight');
    await page.keyboard.press('Control+ArrowRight');

    await testScreenshot(page, 'reorder_fixed_left_column_to_right.png', { element: page.locator('#container') });
  });

  test('reorder fixed left column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        field5: 'test5', field6: 'test6', field7: 'test7', field8: 'test8',
      }],
      customizeColumns: (columns: any[]) => {
        columns[0].fixed = true;
        columns[1].fixed = true;
        columns[7].fixed = true;
      },
    });

    const dataGrid = new DataGrid(page);
    const secondFixedLeftHeader = dataGrid.getHeaderRow().locator('td').nth(1);

    await secondFixedLeftHeader.click();
    await page.keyboard.press('Control+ArrowLeft');
    await page.keyboard.press('Control+ArrowLeft');

    await testScreenshot(page, 'reorder_fixed_left_column_to_left.png', { element: page.locator('#container') });
  });
});
