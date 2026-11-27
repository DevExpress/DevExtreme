import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const FOUR_FIELDS = [{
  field1: 'test1',
  field2: 'test2',
  field3: 'test3',
  field4: 'test4',
}];

const THREE_FIELDS = [{
  field1: 'test1',
  field2: 'test2',
  field3: 'test3',
}];

// Reordering, grouping and ungrouping render the group panel and the headers again. The focus is
// on the body until the grid gives it to the item it lands on, a moment later.
const expectFocusedAt = async (element: Locator, text: string): Promise<void> => {
  await expect(element).toHaveText(text);
  await expect(element).toBeFocused();
};

test.describe('Keyboard Navigation - Group Column Reordering', () => {
  // Move grouped columns
  [true, false].forEach((rtlEnabled) => {
    test(`reorder group column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        dataSource: FOUR_FIELDS,
        groupPanel: {
          visible: true,
        },
        columns: [
          {
            dataField: 'field1',
            groupIndex: 1,
          },
          'field2',
          'field3',
          {
            dataField: 'field4',
            groupIndex: 0,
          },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const groupPanel = dataGrid.getGroupPanel();
      const firstGroupHeader = groupPanel.getHeader(0);

      // A click on a group panel item sorts its column.
      await dataGrid.waitForContentReady(() => firstGroupHeader.element.click());
      await expect(firstGroupHeader.element).toBeFocused();
      await page.keyboard.press(rtlEnabled ? 'Control+ArrowLeft' : 'Control+ArrowRight');

      await expectFocusedAt(groupPanel.getHeader(1).element, 'Field 4');
      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });
    });

    test(`reorder group column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        dataSource: FOUR_FIELDS,
        groupPanel: {
          visible: true,
        },
        columns: [
          {
            dataField: 'field1',
            groupIndex: 1,
          },
          'field2',
          'field3',
          {
            dataField: 'field4',
            groupIndex: 0,
          },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const groupPanel = dataGrid.getGroupPanel();
      const lastGroupHeader = groupPanel.getHeader(1);

      await dataGrid.waitForContentReady(() => lastGroupHeader.element.click());
      await expect(lastGroupHeader.element).toBeFocused();
      await page.keyboard.press(rtlEnabled ? 'Control+ArrowRight' : 'Control+ArrowLeft');

      await expectFocusedAt(groupPanel.getHeader(0).element, 'Field 1');
      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });
    });

    test(`reorder group column to ${rtlEnabled ? 'left' : 'right'} via context menu when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        dataSource: FOUR_FIELDS,
        groupPanel: {
          visible: true,
        },
        columns: [
          {
            dataField: 'field1',
            groupIndex: 1,
          },
          'field2',
          'field3',
          {
            dataField: 'field4',
            groupIndex: 0,
          },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const groupPanel = dataGrid.getGroupPanel();
      const contextMenuItem = dataGrid.getContextMenu().getItemByText(`Move to the ${rtlEnabled ? 'left' : 'right'}`);

      await groupPanel.getHeader(0).element.click({ button: 'right' });

      await expect(contextMenuItem).toBeVisible();
      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

      await contextMenuItem.click();

      await expectFocusedAt(groupPanel.getHeader(1).element, 'Field 4');
      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);
    });

    test(`reorder group column to ${rtlEnabled ? 'right' : 'left'} via context menu when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        rtlEnabled,
        dataSource: FOUR_FIELDS,
        groupPanel: {
          visible: true,
        },
        columns: [
          {
            dataField: 'field1',
            groupIndex: 1,
          },
          'field2',
          'field3',
          {
            dataField: 'field4',
            groupIndex: 0,
          },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const groupPanel = dataGrid.getGroupPanel();
      const contextMenuItem = dataGrid.getContextMenu().getItemByText(`Move to the ${rtlEnabled ? 'right' : 'left'}`);

      await groupPanel.getHeader(1).element.click({ button: 'right' });

      await expect(contextMenuItem).toBeVisible();
      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

      await contextMenuItem.click();

      await expectFocusedAt(groupPanel.getHeader(0).element, 'Field 1');
      await testScreenshot(page, `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);
    });
  });

  test('Reordering of grouping column should not work when onKeyDown.args.handled = true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      onKeyDown: (e) => {
        e.handled = true;
      },
      dataSource: data,
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    }), DEFAULT_SELECTOR, { arg: FOUR_FIELDS });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => firstGroupHeader.element.click());
    await expect(firstGroupHeader.element).toBeFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(firstGroupHeader.element, 'Field 4');
    await testScreenshot(page, 'reorder_group_column_when_onKeyDown_args_handled_=_true.png', { element: dataGrid.element });
  });

  test('The group column should not be reordered when groupPanel.allowColumnDragging = false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      allowColumnReordering: true,
      groupPanel: {
        visible: true,
        allowColumnDragging: false,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => firstGroupHeader.element.click());
    await expect(firstGroupHeader.element).toBeFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(firstGroupHeader.element, 'Field 4');
    await testScreenshot(page, 'reorder_group_column_when_group_panel_allowColumnDragging_is_false.png', { element: dataGrid.element });
  });

  test('The group column should not be reordered when it has allowGrouping set to false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      allowColumnReordering: true,
      groupPanel: {
        visible: true,
        allowColumnDragging: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
          allowGrouping: false,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => firstGroupHeader.element.click());
    await expect(firstGroupHeader.element).toBeFocused();
    await page.keyboard.press('Control+ArrowRight');

    await expectFocusedAt(firstGroupHeader.element, 'Field 4');
    await testScreenshot(page, 'reorder_group_column_with_allowGrouping_is_false.png', { element: dataGrid.element });
  });

  test('The context menu should not have items for column reordering when groupPanel.allowColumnDragging = false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      allowColumnReordering: true,
      groupPanel: {
        visible: true,
        allowColumnDragging: false,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getGroupPanel().getHeader(0).element.click({ button: 'right' });

    await expect(dataGrid.getContextMenu().getItemByText('Ungroup All')).toBeVisible();
    await testScreenshot(page, 'reorder_group_column_via_context_menu_when_group_panel_allowColumnDragging_is_false.png');
  });

  // Ungroup columns
  test('Ungroup second column when pressing Backspace', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const secondGroupedHeader = dataGrid.getGroupPanel().getHeader(1);

    await dataGrid.waitForContentReady(() => secondGroupedHeader.element.click());
    await expect(secondGroupedHeader.element).toBeFocused();
    await page.keyboard.press('Backspace');

    await expectFocusedAt(secondGroupedHeader.element, 'Field 2');
    await testScreenshot(page, 'ungroup_second_column_when_pressing_backspace.png', { element: dataGrid.element });
  });

  test('Ungroup last column when pressing Backspace', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const groupPanel = dataGrid.getGroupPanel();
    const lastGroupedHeader = groupPanel.getHeader(2);

    await dataGrid.waitForContentReady(() => lastGroupedHeader.element.click());
    await expect(lastGroupedHeader.element).toBeFocused();
    await page.keyboard.press('Backspace');

    await expectFocusedAt(groupPanel.getHeader(1).element, 'Field 1');
    await testScreenshot(page, 'ungroup_last_column_when_pressing_backspace.png', { element: dataGrid.element });
  });

  test('Ungroup a single grouped column when pressing Backspace', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const groupedHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => groupedHeader.element.click());
    await expect(groupedHeader.element).toBeFocused();
    await page.keyboard.press('Backspace');

    await expectFocusedAt(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element, 'Field 1');
    await testScreenshot(page, 'ungroup_single_column_when_pressing_backspace.png', { element: dataGrid.element });
  });

  test('Ungroup second column via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Ungroup');
    const secondGroupedHeader = dataGrid.getGroupPanel().getHeader(1);

    await secondGroupedHeader.element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'ungroup_second_column_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(secondGroupedHeader.element, 'Field 2');
    await testScreenshot(page, 'ungroup_second_column_via_context_menu_2.png');
  });

  test('Ungroup last column via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const groupPanel = dataGrid.getGroupPanel();
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Ungroup');

    await groupPanel.getHeader(2).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'ungroup_last_column_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(groupPanel.getHeader(1).element, 'Field 1');
    await testScreenshot(page, 'ungroup_last_column_via_context_menu_2.png');
  });

  test('Ungroup a single grouped column via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Ungroup');

    await dataGrid.getGroupPanel().getHeader(0).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'ungroup_single_column_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element, 'Field 1');
    await testScreenshot(page, 'ungroup_single_column_via_context_menu_2.png');
  });

  test('Ungroup column when pressing Delete', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => firstGroupHeader.element.click());
    await expect(firstGroupHeader.element).toBeFocused();
    await page.keyboard.press('Delete');

    await expectFocusedAt(firstGroupHeader.element, 'Field 1');
    await testScreenshot(page, 'ungroup_column_when_pressing_delete.png', { element: dataGrid.element });
  });

  test('Ungroup column when pressing Ctrl + Shift + G', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => firstGroupedHeader.element.click());
    await expect(firstGroupedHeader.element).toBeFocused();
    await page.keyboard.press('Control+Shift+g');

    await expectFocusedAt(firstGroupedHeader.element, 'Field 1');
    await testScreenshot(page, 'ungroup_column_when_pressing_Ctrl_+_Shift_+_G.png', { element: dataGrid.element });
  });

  test('Ungroup a single grouped column when pressing Backspace if there is command column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      selection: {
        mode: 'multiple',
      },
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        'field1',
        'field2',
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const groupedHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => groupedHeader.element.click());
    await expect(groupedHeader.element).toBeFocused();
    await page.keyboard.press('Backspace');

    await expectFocusedAt(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element, 'Field 1');
    await testScreenshot(page, 'ungroup_single_column_on_backspace_when_there_is_command_column.png', { element: dataGrid.element });
  });

  test('Ungroup column via context menu if showWhenGrouped is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      columns: [
        'field1',
        {
          dataField: 'field2',
          showWhenGrouped: true,
          groupIndex: 0,
        },
        'field2',
      ],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Ungroup');

    await headerRow.getHeaderCell(2).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'ungroup_column_via_context_menu_when_showWhenGrouped_is_true_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'ungroup_column_via_context_menu_when_showWhenGrouped_is_true_2.png');
  });

  test('Ungroup column when pressing Ctrl + Shift + G if showWhenGrouped is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      columns: [
        'field1',
        {
          dataField: 'field2',
          showWhenGrouped: true,
          groupIndex: 0,
        },
        'field2',
      ],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondHeader = headerRow.getHeaderCell(2);

    // The header of the grouped column doesn't sort.
    await secondHeader.element.click();
    await expect(secondHeader.element).toBeFocused();
    await page.keyboard.press('Control+Shift+g');

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'ungroup_column_when_pressing_ctrl_+_shift_+_g_if_showWhenGrouped_is_true.png', { element: dataGrid.element });
  });

  test('Ungroup all columns via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Ungroup All');

    await dataGrid.getGroupPanel().getHeader(0).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'ungroup_all_columns_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element, 'Field 1');
    await testScreenshot(page, 'ungroup_all_columns_via_context_menu_2.png');
  });

  test('Ungroup all columns when pressing Shift + Alt + G', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

    await dataGrid.waitForContentReady(() => firstGroupedHeader.element.click());
    await expect(firstGroupedHeader.element).toBeFocused();
    await page.keyboard.press('Shift+Alt+g');

    await expectFocusedAt(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element, 'Field 1');
    await testScreenshot(page, 'ungroup_all_columns_when_pressing_Shift_+_Alt_+_G.png', { element: dataGrid.element });
  });

  test('Ungroup all columns via context menu if showWhenGrouped is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
          showWhenGrouped: true,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Ungroup All');

    await headerRow.getHeaderCell(3).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'ungroup_all_columns_via_context_menu_when_showWhenGrouped_is_true_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(1).element, 'Field 2');
    await testScreenshot(page, 'ungroup_all_columns_via_context_menu_when_showWhenGrouped_is_true_2.png');
  });

  test('Ungroup all columns when pressing Shift + Alt + G on the header', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: FOUR_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          groupIndex: 1,
        },
        {
          dataField: 'field2',
          groupIndex: 2,
        },
        'field3',
        {
          dataField: 'field4',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const fourthHeader = headerRow.getHeaderCell(3);

    await dataGrid.waitForContentReady(() => fourthHeader.element.click());
    await expect(fourthHeader.element).toBeFocused();
    await page.keyboard.press('Shift+Alt+g');

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 3');
    await testScreenshot(page, 'ungroup_all_columns_when_pressing_Shift_+_Alt_+_G_on_header.png', { element: dataGrid.element });
  });

  // Group columns
  test('Group second column when pressing ctrl + g', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondHeader = headerRow.getHeaderCell(1);

    await dataGrid.waitForContentReady(() => secondHeader.element.click());
    await expect(secondHeader.element).toBeFocused();
    await page.keyboard.press('Control+g');

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 3');
    await testScreenshot(page, 'group_second_column_via_keyboard.png', { element: dataGrid.element });
  });

  test('Group last column when pressing ctrl + g', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

    await dataGrid.waitForContentReady(() => lastHeader.element.click());
    await expect(lastHeader.element).toBeFocused();
    await page.keyboard.press('Control+g');

    await expectFocusedAt(lastHeader.element, 'Field 2');
    await testScreenshot(page, 'group_last_column_via_keyboard.png', { element: dataGrid.element });
  });

  test('Group a single column when pressing ctrl + g', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
      }],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await dataGrid.waitForContentReady(() => lastHeader.element.click());
    await expect(lastHeader.element).toBeFocused();
    await page.keyboard.press('Control+g');

    await expectFocusedAt(dataGrid.getGroupPanel().getHeader(0).element, 'Field 1');
    await testScreenshot(page, 'group_single_column_via_keyboard.png', { element: dataGrid.element });
  });

  test('Group column when pressing ctrl + g if showWhenGrouped is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      columns: [
        'field1',
        {
          dataField: 'field2',
          showWhenGrouped: true,
        },
        'field2',
      ],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const secondHeader = headerRow.getHeaderCell(1);

    await dataGrid.waitForContentReady(() => secondHeader.element.click());
    await expect(secondHeader.element).toBeFocused();
    await page.keyboard.press('Control+g');

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 2');
    await testScreenshot(page, 'group_column_via_keyboard_when_showWhenGrouped_is_true.png', { element: dataGrid.element });
  });

  test('Group second column via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Group by This Column');

    await headerRow.getHeaderCell(1).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'group_second_column_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 3');
    await testScreenshot(page, 'group_second_column_via_context_menu_2.png');
  });

  test('Group last column via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Group by This Column');

    await lastHeader.element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'group_last_column_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(lastHeader.element, 'Field 2');
    await testScreenshot(page, 'group_last_column_via_context_menu_2.png');
  });

  test('Group a single column via context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        field1: 'test1',
      }],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Group by This Column');

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'group_single_column_via_context_menu_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(dataGrid.getGroupPanel().getHeader(0).element, 'Field 1');
    await testScreenshot(page, 'group_single_column_via_context_menu_2.png');
  });

  test('Group column via context menu if showWhenGrouped is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: THREE_FIELDS,
      columns: [
        'field1',
        {
          dataField: 'field2',
          showWhenGrouped: true,
        },
        'field2',
      ],
      grouping: {
        contextMenuEnabled: true,
      },
      groupPanel: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const contextMenuItem = dataGrid.getContextMenu().getItemByText('Group by This Column');

    await headerRow.getHeaderCell(1).element.click({ button: 'right' });

    await expect(contextMenuItem).toBeVisible();
    await testScreenshot(page, 'group_column_via_context_menu_when_showWhenGrouped_is_true_1.png');

    await contextMenuItem.click();

    await expectFocusedAt(headerRow.getHeaderCell(2).element, 'Field 2');
    await testScreenshot(page, 'group_column_via_context_menu_when_showWhenGrouped_is_true_2.png');
  });
});
