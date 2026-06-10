import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture
  .disablePageReloads`Keyboard Navigation - Group Column Reordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

// Move grouped columns
[true, false].forEach((rtlEnabled) => {
  test(`reorder group column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);
    const shortcut = rtlEnabled ? 'ctrl+left' : 'ctrl+right';

    await t
      .click(firstGroupHeader.element)
      .pressKey(shortcut);

    await testScreenshot(t, takeScreenshot, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
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
      onToolbarPreparing(e): void {
        e.toolbarOptions.allowKeyboardNavigation = false;
      },
    });
  });

  test(`reorder group column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const lastGroupHeader = dataGrid.getGroupPanel().getHeader(1);
    const shortcut = rtlEnabled ? 'ctrl+right' : 'ctrl+left';

    await t
      .click(lastGroupHeader.element)
      .pressKey(shortcut);

    await testScreenshot(t, takeScreenshot, `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
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
      onToolbarPreparing(e): void {
        e.toolbarOptions.allowKeyboardNavigation = false;
      },
    });
  });

  test(`reorder group column to ${rtlEnabled ? 'left' : 'right'} via context menu when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);
    const contextMenuItemText = `Move to the ${rtlEnabled ? 'left' : 'right'}`;

    await t.rightClick(firstGroupHeader.element);

    await testScreenshot(t, takeScreenshot, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

    await t
      .click(contextMenu.getItemByText(contextMenuItemText));

    await testScreenshot(t, takeScreenshot, `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
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
  });

  test(`reorder group column to ${rtlEnabled ? 'right' : 'left'} via context menu when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const lastGroupHeader = dataGrid.getGroupPanel().getHeader(1);
    const contextMenuItemText = `Move to the ${rtlEnabled ? 'right' : 'left'}`;

    await t.rightClick(lastGroupHeader.element);

    await testScreenshot(t, takeScreenshot, `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

    await t
      .click(contextMenu.getItemByText(contextMenuItemText));

    await testScreenshot(t, takeScreenshot, `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
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
  });
});

test('Reordering of grouping column should not work when onKeyDown.args.handled = true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupHeader.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_group_column_when_onKeyDown_args_handled_=_true.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    onKeyDown: (e) => {
      e.handled = true;
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
    onToolbarPreparing(e): void {
      e.toolbarOptions.allowKeyboardNavigation = false;
    },
  });
});

test('The group column should not be reordered when groupPanel.allowColumnDragging = false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupHeader.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_group_column_when_group_panel_allowColumnDragging_is_false.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
    onToolbarPreparing(e): void {
      e.toolbarOptions.allowKeyboardNavigation = false;
    },
  });
});

test('The group column should not be reordered when it has allowGrouping set to false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupHeader.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_group_column_with_allowGrouping_is_false.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
    onToolbarPreparing(e): void {
      e.toolbarOptions.allowKeyboardNavigation = false;
    },
  });
});

test('The context menu should not have items for column reordering when groupPanel.allowColumnDragging = false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t.rightClick(firstGroupHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_group_column_via_context_menu_when_group_panel_allowColumnDragging_is_false.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

// Ungroup columns
test('Ungroup second column when pressing Backspace', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondGroupedHeader = dataGrid.getGroupPanel().getHeader(1);

  await t
    .click(secondGroupedHeader.element)
    .pressKey('backspace');

  await testScreenshot(t, takeScreenshot, 'ungroup_second_column_when_pressing_backspace.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup last column when pressing Backspace', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const lastGroupedHeader = dataGrid.getGroupPanel().getHeader(2);

  await t
    .click(lastGroupedHeader.element)
    .pressKey('backspace');

  await testScreenshot(t, takeScreenshot, 'ungroup_last_column_when_pressing_backspace.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup a single grouped column when pressing Backspace', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const groupedHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(groupedHeader.element)
    .pressKey('backspace');

  await testScreenshot(t, takeScreenshot, 'ungroup_single_column_when_pressing_backspace.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup second column via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const secondGroupedHeader = dataGrid.getGroupPanel().getHeader(1);

  await t.rightClick(secondGroupedHeader.element);

  await testScreenshot(t, takeScreenshot, 'ungroup_second_column_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Ungroup'));

  await testScreenshot(t, takeScreenshot, 'ungroup_second_column_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup last column via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const lastGroupedHeader = dataGrid.getGroupPanel().getHeader(2);

  await t.rightClick(lastGroupedHeader.element);

  await testScreenshot(t, takeScreenshot, 'ungroup_last_column_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Ungroup'));

  await testScreenshot(t, takeScreenshot, 'ungroup_last_column_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup a single grouped column via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const groupedHeader = dataGrid.getGroupPanel().getHeader(0);

  await t.rightClick(groupedHeader.element);

  await testScreenshot(t, takeScreenshot, 'ungroup_single_column_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Ungroup'));

  await testScreenshot(t, takeScreenshot, 'ungroup_single_column_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup column when pressing Delete', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupHeader.element)
    .pressKey('delete');

  await testScreenshot(t, takeScreenshot, 'ungroup_column_when_pressing_delete.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
    onToolbarPreparing(e): void {
      e.toolbarOptions.allowKeyboardNavigation = false;
    },
  });
});

test('Ungroup column when pressing Ctrl + Shift + G', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupedHeader.element)
    .pressKey('ctrl+shift+g');

  await testScreenshot(t, takeScreenshot, 'ungroup_column_when_pressing_Ctrl_+_Shift_+_G.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup a single grouped column when pressing Backspace if there is command column', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const groupedHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(groupedHeader.element)
    .pressKey('backspace');

  await testScreenshot(t, takeScreenshot, 'ungroup_single_column_on_backspace_when_there_is_command_column.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup column via context menu if showWhenGrouped is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t.rightClick(secondHeader.element);

  await testScreenshot(t, takeScreenshot, 'ungroup_column_via_context_menu_when_showWhenGrouped_is_true_1.png');

  await t
    .click(contextMenu.getItemByText('Ungroup'));

  await testScreenshot(t, takeScreenshot, 'ungroup_column_via_context_menu_when_showWhenGrouped_is_true_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
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
});

test('Ungroup column when pressing Ctrl + Shift + G if showWhenGrouped is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(secondHeader.element)
    .pressKey('ctrl+shift+g');

  await testScreenshot(t, takeScreenshot, 'ungroup_column_when_pressing_ctrl_+_shift_+_g_if_showWhenGrouped_is_true.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
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
});

test('Ungroup all columns via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

  await t.rightClick(firstGroupedHeader.element);

  await testScreenshot(t, takeScreenshot, 'ungroup_all_columns_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Ungroup All'));

  await testScreenshot(t, takeScreenshot, 'ungroup_all_columns_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup all columns when pressing Shift + Alt + G', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupedHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupedHeader.element)
    .pressKey('shift+alt+g');

  await testScreenshot(t, takeScreenshot, 'ungroup_all_columns_when_pressing_Shift_+_Alt_+_G.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup all columns via context menu if showWhenGrouped is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const fourthHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t.rightClick(fourthHeader.element);

  await testScreenshot(t, takeScreenshot, 'ungroup_all_columns_via_context_menu_when_showWhenGrouped_is_true_1.png');

  await t
    .click(contextMenu.getItemByText('Ungroup All'));

  await testScreenshot(t, takeScreenshot, 'ungroup_all_columns_via_context_menu_when_showWhenGrouped_is_true_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('Ungroup all columns when pressing Shift + Alt + G on the header', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const fourthHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(fourthHeader.element)
    .pressKey('shift+alt+g');

  await testScreenshot(t, takeScreenshot, 'ungroup_all_columns_when_pressing_Shift_+_Alt_+_G_on_header.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

// Group columns
test('Group second column when pressing ctrl + g', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(secondHeader.element)
    .pressKey('ctrl+g');

  await testScreenshot(t, takeScreenshot, 'group_second_column_via_keyboard.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
  });
});

test('Group last column when pressing ctrl + g', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(lastHeader.element)
    .pressKey('ctrl+g');

  await testScreenshot(t, takeScreenshot, 'group_last_column_via_keyboard.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
  });
});

test('Group a single column when pressing ctrl + g', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(lastHeader.element)
    .pressKey('ctrl+g');

  await testScreenshot(t, takeScreenshot, 'group_single_column_via_keyboard.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

test('Group column when pressing ctrl + g if showWhenGrouped is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(secondHeader.element)
    .pressKey('ctrl+g');

  await testScreenshot(t, takeScreenshot, 'group_column_via_keyboard_when_showWhenGrouped_is_true.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
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
});

test('Group second column via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t.rightClick(secondHeader.element);

  await testScreenshot(t, takeScreenshot, 'group_second_column_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Group by This Column'));

  await testScreenshot(t, takeScreenshot, 'group_second_column_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
  });
});

test('Group last column via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t.rightClick(lastHeader.element);

  await testScreenshot(t, takeScreenshot, 'group_last_column_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Group by This Column'));

  await testScreenshot(t, takeScreenshot, 'group_last_column_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
    grouping: {
      contextMenuEnabled: true,
    },
    groupPanel: {
      visible: true,
    },
  });
});

test('Group a single column via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const lastHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t.rightClick(lastHeader.element);

  await testScreenshot(t, takeScreenshot, 'group_single_column_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Group by This Column'));

  await testScreenshot(t, takeScreenshot, 'group_single_column_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

test('Group column via context menu if showWhenGrouped is enabled', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t.rightClick(secondHeader.element);

  await testScreenshot(t, takeScreenshot, 'group_column_via_context_menu_when_showWhenGrouped_is_true_1.png');

  await t
    .click(contextMenu.getItemByText('Group by This Column'));

  await testScreenshot(t, takeScreenshot, 'group_column_via_context_menu_when_showWhenGrouped_is_true_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
    }],
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
});
