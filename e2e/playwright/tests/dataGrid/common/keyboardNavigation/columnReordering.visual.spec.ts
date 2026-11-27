/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

const FOUR_FIELDS = [{
  field1: 'test1',
  field2: 'test2',
  field3: 'test3',
  field4: 'test4',
}];

const EIGHT_FIELDS = [{
  field1: 'test1',
  field2: 'test2',
  field3: 'test3',
  field4: 'test4',
  field5: 'test5',
  field6: 'test6',
  field7: 'test7',
  field8: 'test8',
}];

const TEN_FIELDS = [{
  field1: 'test1',
  field2: 'test2',
  field3: 'test3',
  field4: 'test4',
  field5: 'test5',
  field6: 'test6',
  field7: 'test7',
  field8: 'test8',
  field9: 'test9',
  field10: 'test10',
}];

// A reorder renders the headers again. The focus is on the body until the grid gives it to the
// moved header a moment later, and a key pressed before that is lost.
const expectFocusedAt = async (element: Locator, text: string): Promise<void> => {
  await expect(element).toHaveText(text);
  await expect(element).toBeFocused();
};

test.describe('Keyboard Navigation - Column Reordering', () => {
  // Regular columns
  [true, false].forEach((rtlEnabled) => {
    test(`reorder column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        allowColumnReordering: true,
        dataSource: FOUR_FIELDS,
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const firstHeaderCell = headerRow.getHeaderCell(0);

      await dataGrid.waitForContentReady(() => firstHeaderCell.element.click());
      await firstHeaderCell.expectFocused();
      await page.keyboard.press(rtlEnabled ? 'Control+ArrowLeft' : 'Control+ArrowRight');

      await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 1');
      await testScreenshot(page, `reorder_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });
    });

    test(`reorder column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        allowColumnReordering: true,
        dataSource: FOUR_FIELDS,
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const lastHeaderCell = headerRow.getHeaderCell(3);

      await dataGrid.waitForContentReady(() => lastHeaderCell.element.click());
      await lastHeaderCell.expectFocused();
      await page.keyboard.press(rtlEnabled ? 'Control+ArrowRight' : 'Control+ArrowLeft');

      await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 4');
      await testScreenshot(page, `reorder_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });
    });

    test(`reorder column to right via context menu when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        allowColumnReordering: true,
        rtlEnabled,
        dataSource: FOUR_FIELDS,
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const contextMenuItem = dataGrid.getContextMenu().getItemByText(`Move to the ${rtlEnabled ? 'left' : 'right'}`);

      await headerRow.getHeaderCell(0).element.click({ button: 'right' });

      await expect(contextMenuItem).toBeVisible();
      await testScreenshot(page, `reorder_column_to_right_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

      await contextMenuItem.click();

      await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 1');
      await testScreenshot(page, `reorder_column_to_right_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);
    });

    test(`reorder column to left via context menu when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        allowColumnReordering: true,
        rtlEnabled,
        dataSource: FOUR_FIELDS,
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const contextMenuItem = dataGrid.getContextMenu().getItemByText(`Move to the ${rtlEnabled ? 'right' : 'left'}`);

      await headerRow.getHeaderCell(3).element.click({ button: 'right' });

      await expect(contextMenuItem).toBeVisible();
      await testScreenshot(page, `reorder_column_to_left_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

      await contextMenuItem.click();

      await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 4');
      await testScreenshot(page, `reorder_column_to_left_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);
    });
  });

  test('The column should not be reordered when allowColumnReordering is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: false,
      dataSource: FOUR_FIELDS,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await dataGrid.waitForContentReady(() => firstHeaderCell.element.click());
    await firstHeaderCell.expectFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(firstHeaderCell.element, 'Field 1');
    await testScreenshot(page, 'reorder_column_when_allowColumnReordering_is_false.png', { element: dataGrid.element });
  });

  test('The column should not be reordered when it has allowReordering set to false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        {
          dataField: 'field1',
          allowReordering: false,
        },
        'field2',
        'field3',
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await dataGrid.waitForContentReady(() => firstHeaderCell.element.click());
    await firstHeaderCell.expectFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(firstHeaderCell.element, 'Field 1');
    await testScreenshot(page, 'reorder_column_with_allowReordering_is_false.png', { element: dataGrid.element });
  });

  test('The column should not be reordered when allowColumnReordering is false and group panel is visible', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: false,
      groupPanel: {
        visible: true,
        allowColumnDragging: true,
      },
      dataSource: FOUR_FIELDS,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await dataGrid.waitForContentReady(() => firstHeaderCell.element.click());
    await firstHeaderCell.expectFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(firstHeaderCell.element, 'Field 1');
    await testScreenshot(page, 'reorder_column_when_allowColumnReordering_is_false_and_group_panel_is_visible.png', { element: dataGrid.element });
  });

  test('The context menu should not have items for column reordering when allowColumnReordering is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: false,
      dataSource: FOUR_FIELDS,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.click({ button: 'right' });

    await expect(dataGrid.getContextMenu().getItemByText('Sort Ascending')).toBeVisible();
    await testScreenshot(page, 'reorder_column_via_context_menu_when_allowColumnReordering_is_false.png');
  });

  test('The cell focus should be correct after column reordering when previously the data cell was focused', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstDataCell = dataGrid.getDataCell(0, 0);

    await firstDataCell.element.click();
    await firstDataCell.expectFocusHidden();
    await page.keyboard.press('Shift+Tab');
    await headerRow.getHeaderCell(3).expectFocused();
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 4');
    await testScreenshot(page, 'cell_focus_after_column_reordering_when_data_cell_was_focused.png', { element: dataGrid.element });
  });

  // Fixed columns
  test('reorder fixed left column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[7].fixed = true;
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstFixedLeftHeader = headerRow.getHeaderCell(0);

    await dataGrid.waitForContentReady(() => firstFixedLeftHeader.element.click());
    await firstFixedLeftHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 1');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 1');
    await testScreenshot(page, 'reorder_fixed_left_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder fixed left column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[7].fixed = true;
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondFixedLeftHeader = headerRow.getHeaderCell(1);

    await dataGrid.waitForContentReady(() => secondFixedLeftHeader.element.click());
    await secondFixedLeftHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(headerRow.getHeaderCell(0).element, 'Field 8');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(0).element, 'Field 8');
    await testScreenshot(page, 'reorder_fixed_left_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder fixed right column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstFixedRightHeader = headerRow.getHeaderCell(6);

    await dataGrid.waitForContentReady(() => firstFixedRightHeader.element.click());
    await firstFixedRightHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(7).element, 'Field 1');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(7).element, 'Field 1');
    await testScreenshot(page, 'reorder_fixed_right_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder fixed right column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondFixedRightHeader = headerRow.getHeaderCell(7);

    await dataGrid.waitForContentReady(() => secondFixedRightHeader.element.click());
    await secondFixedRightHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(headerRow.getHeaderCell(6).element, 'Field 8');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(6).element, 'Field 8');
    await testScreenshot(page, 'reorder_fixed_right_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder sticky column to left when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[1].fixed = true;

        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';

        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, {
      arg: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
        field7: 'test7',
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const stickyHeader = headerRow.getHeaderCell(3);

    await dataGrid.waitForContentReady(() => stickyHeader.element.click());
    await stickyHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 4');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 4');
    await testScreenshot(page, 'reorder_sticky_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder sticky column to right when there are fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[1].fixed = true;

        columns[3].fixed = true;
        columns[3].fixedPosition = 'sticky';

        columns[5].fixed = true;
        columns[5].fixedPosition = 'right';
        columns[6].fixed = true;
        columns[6].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, {
      arg: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
        field5: 'test5',
        field6: 'test6',
        field7: 'test7',
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const stickyHeader = headerRow.getHeaderCell(3);

    await dataGrid.waitForContentReady(() => stickyHeader.element.click());
    await stickyHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(4).element, 'Field 4');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(4).element, 'Field 4');
    await testScreenshot(page, 'reorder_sticky_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder fixed right column to right when there is a command column on the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstFixedRightHeader = headerRow.getHeaderCell(6);

    await dataGrid.waitForContentReady(() => firstFixedRightHeader.element.click());
    await firstFixedRightHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(7).element, 'Field 1');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(7).element, 'Field 1');
    await testScreenshot(page, 'reorder_fixed_right_column_to_right_when_there_is_command_column_on_right.png', { element: dataGrid.element });
  });

  test('reorder fixed right column to right when there is a custom command column on the right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      dataSource: data,
      columns: [
        {
          dataField: 'field1',
          fixed: true,
          fixedPosition: 'right',
        },
        'field2',
        'field3',
        'field4',
        'field5',
        'field6',
        'field7',
        {
          dataField: 'field8',
          fixed: true,
          fixedPosition: 'right',
        },
        {
          type: 'buttons',
          fixed: true,
          fixedPosition: 'right',
        },
      ],
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstFixedRightHeader = headerRow.getHeaderCell(6);

    await dataGrid.waitForContentReady(() => firstFixedRightHeader.element.click());
    await firstFixedRightHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(7).element, 'Field 1');
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(8).element, 'Field 1');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(8).element, 'Field 1');
    await testScreenshot(page, 'reorder_fixed_right_column_to_right_when_there_is_custom_command_column_on_right.png', { element: dataGrid.element });
  });

  test('reorder fixed left column to right via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[7].fixed = true;
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the right');

    await headerRow.getHeaderCell(0).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_fixed_left_column_to_right_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 1');
    await testScreenshot(page, 'reorder_fixed_left_column_to_right_via_context_menu_2.png');
  });

  test('reorder fixed left column to left via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[7].fixed = true;
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the left');

    await headerRow.getHeaderCell(1).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_fixed_left_column_to_left_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(0).element, 'Field 8');
    await testScreenshot(page, 'reorder_fixed_left_column_to_left_via_context_menu_2.png');
  });

  test('reorder fixed right column to right via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the right');

    await headerRow.getHeaderCell(6).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_fixed_right_column_to_right_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(7).element, 'Field 1');
    await testScreenshot(page, 'reorder_fixed_right_column_to_right_via_context_menu_2.png');
  });

  test('reorder fixed right column to left via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].fixed = true;
        columns[0].fixedPosition = 'right';
        columns[7].fixed = true;
        columns[7].fixedPosition = 'right';
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the left');

    await headerRow.getHeaderCell(7).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_fixed_right_column_to_left_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(6).element, 'Field 8');
    await testScreenshot(page, 'reorder_fixed_right_column_to_left_via_context_menu_2.png');
  });

  // Band columns
  test('reorder band column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondHeader = headerRow.getHeaderCell(1);

    // A band column doesn't sort.
    await secondHeader.element.click();
    await secondHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Band Column');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Band Column');
    await testScreenshot(page, 'reorder_band_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder band column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondHeader = headerRow.getHeaderCell(1);

    // A band column doesn't sort.
    await secondHeader.element.click();
    await secondHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(headerRow.getHeaderCell(0).element, 'Band Column');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(0).element, 'Band Column');
    await testScreenshot(page, 'reorder_band_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder nested column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nestedRow = dataGrid.getHeaders().getHeaderRow(1);
    const nestedSecondHeader = nestedRow.getHeaderCell(1);

    await dataGrid.waitForContentReady(() => nestedSecondHeader.element.click());
    await nestedSecondHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(nestedRow.getHeaderCell(0).element, 'Field 3');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(nestedRow.getHeaderCell(0).element, 'Field 3');
    await testScreenshot(page, 'reorder_nested_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder nested column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nestedRow = dataGrid.getHeaders().getHeaderRow(1);
    const nestedFirstHeader = nestedRow.getHeaderCell(0);

    await dataGrid.waitForContentReady(() => nestedFirstHeader.element.click());
    await nestedFirstHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(nestedRow.getHeaderCell(1).element, 'Field 2');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(nestedRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'reorder_nested_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder fixed nested column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          fixed: true,
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nestedRow = dataGrid.getHeaders().getHeaderRow(1);
    const firstFixedLeftHeader = nestedRow.getHeaderCell(0);

    await dataGrid.waitForContentReady(() => firstFixedLeftHeader.element.click());
    await firstFixedLeftHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(nestedRow.getHeaderCell(1).element, 'Field 2');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(nestedRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'reorder_fixed_nested_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder fixed nested column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          fixed: true,
          fixedPosition: 'right',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nestedRow = dataGrid.getHeaders().getHeaderRow(1);
    const secondFixedLeftHeader = nestedRow.getHeaderCell(1);

    await dataGrid.waitForContentReady(() => secondFixedLeftHeader.element.click());
    await secondFixedLeftHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(nestedRow.getHeaderCell(0).element, 'Field 3');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(nestedRow.getHeaderCell(0).element, 'Field 3');
    await testScreenshot(page, 'reorder_fixed_nested_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder nested column to left via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nestedRow = dataGrid.getHeaders().getHeaderRow(1);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the left');

    await nestedRow.getHeaderCell(1).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_nested_column_to_left_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(nestedRow.getHeaderCell(0).element, 'Field 3');
    await testScreenshot(page, 'reorder_nested_column_to_left_via_context_menu_2.png');
  });

  test('reorder nested column to right via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: FOUR_FIELDS,
      columns: [
        'field1',
        {
          caption: 'Band Column',
          columns: ['field2', 'field3'],
        },
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nestedRow = dataGrid.getHeaders().getHeaderRow(1);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the right');

    await nestedRow.getHeaderCell(0).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_nested_column_to_right_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(nestedRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'reorder_nested_column_to_right_via_context_menu_2.png');
  });

  // Command columns
  test('reorder column to left when there is a command column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      selection: {
        mode: 'multiple',
        showCheckBoxesMode: 'always',
      },
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      columns: [
        'field1',
        'field2',
        'field3',
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const thirdHeader = headerRow.getHeaderCell(2);

    await dataGrid.waitForContentReady(() => thirdHeader.element.click());
    await thirdHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 2');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'reorder_column_to_left_when_there_is_command_column.png', { element: dataGrid.element });
  });

  test('reorder column to right when there is a command column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      columns: [
        'field1',
        'field2',
        'field3',
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const thirdHeader = headerRow.getHeaderCell(2);

    await dataGrid.waitForContentReady(() => thirdHeader.element.click());
    await thirdHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    await expectFocusedAt(headerRow.getHeaderCell(3).element, 'Field 3');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(3).element, 'Field 3');
    await testScreenshot(page, 'reorder_column_to_right_when_there_is_command_column.png', { element: dataGrid.element });
  });

  test('reorder a custom command column to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      selection: {
        mode: 'multiple',
        allowSelectAll: false,
        showCheckBoxesMode: 'always',
      },
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      columns: [
        { type: 'selection' },
        'field1',
        'field2',
        'field3',
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const commandHeader = headerRow.getHeaderCell(0);

    // A command column doesn't sort.
    await commandHeader.element.click();
    await commandHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(1).element, '');
    await testScreenshot(page, 'reorder_custom_command_column_to_right.png', { element: dataGrid.element });
  });

  test('reorder a custom command column to left', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      selection: {
        mode: 'multiple',
        allowSelectAll: false,
        showCheckBoxesMode: 'always',
      },
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      columns: [
        'field1',
        'field2',
        'field3',
        'field4',
        { type: 'selection' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const commandHeader = headerRow.getHeaderCell(4);

    // A command column doesn't sort.
    await commandHeader.element.click();
    await commandHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(3).element, '');
    await testScreenshot(page, 'reorder_custom_command_column_to_left.png', { element: dataGrid.element });
  });

  test('reorder a custom command column to right via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      selection: {
        mode: 'multiple',
        allowSelectAll: false,
        showCheckBoxesMode: 'always',
      },
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      columns: [
        { type: 'selection' },
        'field1',
        'field2',
        'field3',
        'field4',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Move to the right');

    await headerRow.getHeaderCell(0).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'reorder_custom_command_column_to_right_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(1).element, '');
    await testScreenshot(page, 'reorder_custom_command_column_to_right_via_context_menu_2.png');
  });

  // Regular columns when adaptability is enabled
  test('reorder column to right when adaptability is enabled and there are hidden columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      width: 550,
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[4].hidingPriority = 0;
        columns[5].hidingPriority = 1;
        columns[7].hidingPriority = 2;
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const fourthHeader = headerRow.getHeaderCell(3);

    await dataGrid.waitForContentReady(() => fourthHeader.element.click());
    await fourthHeader.expectFocused();
    await page.keyboard.press('Control+ArrowRight');
    // The column moves past the hidden ones.
    await expectFocusedAt(headerRow.getHeaderCell(6).element, 'Field 4');
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(headerRow.getHeaderCell(6).element, 'Field 4');
    await testScreenshot(page, 'reorder_column_to_right_when_there_are_hidden_columns.png', { element: dataGrid.element });
  });

  test('reorder column to left when adaptability is enabled and there are hidden columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      width: 550,
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: data,
      customizeColumns: (columns) => {
        columns[0].hidingPriority = 0;
        columns[2].hidingPriority = 1;
        columns[3].hidingPriority = 2;
      },
    }), DEFAULT_SELECTOR, { arg: EIGHT_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const fifthHeader = headerRow.getHeaderCell(4);

    await dataGrid.waitForContentReady(() => fifthHeader.element.click());
    await fifthHeader.expectFocused();
    await page.keyboard.press('Control+ArrowLeft');
    // The column moves past the hidden ones.
    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 5');
    await page.keyboard.press('Control+ArrowLeft');

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 5');
    await testScreenshot(page, 'reorder_column_to_left_when_there_are_hidden_columns.png', { element: dataGrid.element });
  });

  // Regular columns with async templates
  [true, false].forEach((renderAsync) => {
    test(`reorder column when there are async templates and renderAsync = ${renderAsync}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, isRenderAsync }) => ({
        columnWidth: 100,
        allowColumnReordering: true,
        dataSource: data,
        columns: [
          'field1',
          {
            dataField: 'field2',
            headerCellTemplate: 'testHeaderCellTemplate',
          },
          'field3',
          'field4',
        ],
        renderAsync: isRenderAsync,
        templatesRenderAsynchronously: true,
        integrationOptions: {
          templates: {
            testHeaderCellTemplate: {
              render({ model, container, onRendered }) {
                // The template renders after the grid, like a framework's asynchronous template.
                // eslint-disable-next-line no-restricted-syntax
                setTimeout(() => {
                  container.append($('<b/>').text(model.column.caption));
                  onRendered();
                }, 100);
              },
            },
          },
        },
      }), DEFAULT_SELECTOR, { arg: { data: FOUR_FIELDS, isRenderAsync: renderAsync } });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const firstHeader = headerRow.getHeaderCell(0);

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect(headerRow.getHeaderCell(1).element).toHaveText('Field 2');

      await expect(firstHeader.element).toContainText('Field');

      await dataGrid.waitForContentReady(() => firstHeader.element.click());
      await firstHeader.expectFocused();
      await page.keyboard.press('Control+ArrowRight');

      await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 1');
      await expect(firstHeader.element).toHaveText('Field 2');

      await testScreenshot(page, `reorder_column_when_there_are_async_templates_and_renderAsync_=_${renderAsync}.png`, { element: dataGrid.element });
    });
  });

  // Autoscroll
  [true, false].forEach((useNative) => {
    test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the right when column reordering via keyboard`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        allowColumnReordering: true,
        columnWidth: 200,
        width: 800,
        dataSource: TEN_FIELDS,
        scrolling: {
          useNative,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const firstHeaderCell = headerRow.getHeaderCell(0);

      await dataGrid.waitForContentReady(() => firstHeaderCell.element.click());
      await firstHeaderCell.expectFocused();

      for (let i = 1; i <= 4; i += 1) {
        await page.keyboard.press('Control+ArrowRight');
        await expectFocusedAt(headerRow.getHeaderCell(i).element, 'Field 1');
      }

      await testScreenshot(page, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_right_when_column_reordering.png`, { element: dataGrid.element });
    });

    test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the left when column reordering via keyboard`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        allowColumnReordering: true,
        columnWidth: 200,
        width: 800,
        dataSource: TEN_FIELDS,
        scrolling: {
          useNative,
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const lastHeaderCell = headerRow.getHeaderCell(9);

      await dataGrid.scrollTo({ left: 1200 });

      await expect.poll(() => dataGrid.getScrollLeft()).toBe(1200);

      await dataGrid.waitForContentReady(() => lastHeaderCell.element.click());
      await lastHeaderCell.expectFocused();

      for (let i = 1; i <= 4; i += 1) {
        await page.keyboard.press('Control+ArrowLeft');
        await expectFocusedAt(headerRow.getHeaderCell(9 - i).element, 'Field 10');
      }

      await testScreenshot(page, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_left_when_column_reordering.png`, { element: dataGrid.element });
    });

    test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the right when column reordering via keyboard when virtual columns are enabled`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        allowColumnReordering: true,
        columnWidth: 100,
        width: 800,
        dataSource: getData(1, 30),
        scrolling: {
          useNative,
          columnRenderingMode: 'virtual',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const firstHeaderCell = headerRow.getHeaderCell(0);

      await dataGrid.waitForContentReady(() => firstHeaderCell.element.click());
      await firstHeaderCell.expectFocused();

      // The last key finds the column at the end already.
      for (let i = 1; i <= 30; i += 1) {
        await page.keyboard.press('Control+ArrowRight');
        await expectFocusedAt(headerRow.getHeaderCell(Math.min(i, 29)).element, 'Field 0');
      }

      await testScreenshot(page, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_right_when_virtual_columns_are_enabled.png`, { element: dataGrid.element });
    });

    test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the left when column reordering via keyboard when virtual columns are enabled`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        allowColumnReordering: true,
        columnWidth: 100,
        width: 800,
        dataSource: getData(1, 30),
        scrolling: {
          useNative,
          columnRenderingMode: 'virtual',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const lastHeaderCell = headerRow.getHeaderCell(29);

      await dataGrid.scrollTo({ left: 2200 });

      await expect.poll(() => dataGrid.getScrollLeft()).toBe(2200);

      await dataGrid.waitForContentReady(() => lastHeaderCell.element.click());
      await lastHeaderCell.expectFocused();

      // The last key finds the column at the start already.
      for (let i = 1; i <= 30; i += 1) {
        await page.keyboard.press('Control+ArrowLeft');
        await expectFocusedAt(headerRow.getHeaderCell(Math.max(29 - i, 0)).element, 'Field 29');
      }

      await testScreenshot(page, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_left_when_virtual_columns_are_enabled.png`, { element: dataGrid.element });
    });
  });
});
