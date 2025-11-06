import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture
  .disablePageReloads`Keyboard Navigation - Column Reordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

// Regular columns
[true, false].forEach((rtlEnabled) => {
  test(`reorder column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const shortcut = rtlEnabled ? 'ctrl+left' : 'ctrl+right';

    await t
      .click(firstHeaderCell.element)
      .pressKey(shortcut);

    await testScreenshot(t, takeScreenshot, `reorder_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });
  });

  test(`reorder column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const lastHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
    const shortcut = rtlEnabled ? 'ctrl+right' : 'ctrl+left';

    await t
      .click(lastHeaderCell.element)
      .pressKey(shortcut);

    await testScreenshot(t, takeScreenshot, `reorder_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      rtlEnabled,
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });
  });

  test(`reorder column to right via context menu when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstHeaderCell = headerRow.getHeaderCell(0);
    const contextMenuItemText = `Move to the ${rtlEnabled ? 'left' : 'right'}`;

    await t.rightClick(firstHeaderCell.element);

    await testScreenshot(t, takeScreenshot, `reorder_column_to_right_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

    await t
      .click(contextMenu.getItemByText(contextMenuItemText));

    await testScreenshot(t, takeScreenshot, `reorder_column_to_right_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      allowColumnReordering: true,
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });
  });

  test(`reorder column to left via context menu when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const lastHeaderCell = headerRow.getHeaderCell(3);
    const contextMenuItemText = `Move to the ${rtlEnabled ? 'right' : 'left'}`;

    await t.rightClick(lastHeaderCell.element);

    await testScreenshot(t, takeScreenshot, `reorder_column_to_left_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1.png`);

    await t
      .click(contextMenu.getItemByText(contextMenuItemText));

    await testScreenshot(t, takeScreenshot, `reorder_column_to_left_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      allowColumnReordering: true,
      rtlEnabled,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
    });
  });
});

test('The column should not be reordered when allowColumnReordering is false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstHeaderCell.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_column_when_allowColumnReordering_is_false.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    allowColumnReordering: false,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

test('The column should not be reordered when it has allowReordering set to false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstHeaderCell.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_column_with_allowReordering_is_false.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('The column should not be reordered when allowColumnReordering is false and group panel is visible', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstHeaderCell.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_column_when_allowColumnReordering_is_false_and_group_panel_is_visible.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    allowColumnReordering: false,
    groupPanel: {
      visible: true,
      allowColumnDragging: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

test('The context menu should not have items for column reordering when allowColumnReordering is false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t.rightClick(firstHeaderCell.element);

  await testScreenshot(t, takeScreenshot, 'reorder_column_via_context_menu_when_allowColumnReordering_is_false.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    allowColumnReordering: false,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

test('The cell focus should be correct after column reordering when previously the data cell was focused', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstDataCell = dataGrid.getDataCell(0, 0);

  await t
    .click(firstDataCell.element)
    .pressKey('shift+tab')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'cell_focus_after_column_reordering_when_data_cell_was_focused.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
  });
});

// Fixed columns
test('reorder fixed left column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_left_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[7].fixed = true;
    },
  });
});

test('reorder fixed left column to left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(secondFixedLeftHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_left_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[7].fixed = true;
    },
  });
});

test('reorder fixed right column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstFixedRightHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(6);

  await t
    .click(firstFixedRightHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'right';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
    },
  });
});

test('reorder fixed right column to left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondFixedRightHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(7);

  await t
    .click(secondFixedRightHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'right';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
    },
  });
});

test('reorder sticky column to left when there are fixed columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const stickyHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(stickyHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_sticky_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
    }],
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
  });
});

test('reorder sticky column to right when there are fixed columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const stickyHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(stickyHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_sticky_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
    }],
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
  });
});

test('reorder fixed right column to right when there is a command column on the right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstFixedRightHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(6);

  await t
    .click(firstFixedRightHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_right_when_there_is_command_column_on_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    editing: {
      mode: 'row',
      allowUpdating: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'right';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
    },
  });
});

test('reorder fixed right column to right when there is a custom command column on the right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstFixedRightHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(6);

  await t
    .click(firstFixedRightHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_right_when_there_is_custom_command_column_on_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    editing: {
      mode: 'row',
      allowUpdating: true,
    },
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
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
  });
});

test('reorder fixed left column to right via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t.rightClick(firstFixedLeftHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_left_column_to_right_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the right'));

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_left_column_to_right_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[7].fixed = true;
    },
  });
});

test('reorder fixed left column to left via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const secondFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t.rightClick(secondFixedLeftHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_left_column_to_left_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the left'));

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_left_column_to_left_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[7].fixed = true;
    },
  });
});

test('reorder fixed right column to right via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const firstFixedRightHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(6);

  await t.rightClick(firstFixedRightHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_right_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the right'));

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_right_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'right';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
    },
  });
});

test('reorder fixed right column to left via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const secondFixedRightHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(7);

  await t.rightClick(secondFixedRightHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_left_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the left'));

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_right_column_to_left_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].fixed = true;
      columns[0].fixedPosition = 'right';
      columns[7].fixed = true;
      columns[7].fixedPosition = 'right';
    },
  });
});

// Band columns
test('reorder band column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(secondHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_band_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3'],
      },
      'field4',
    ],
  });
});

test('reorder band column to left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(secondHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_band_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3'],
      },
      'field4',
    ],
  });
});

test('reorder nested column to left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const nestedSecondHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

  await t
    .click(nestedSecondHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_nested_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3'],
      },
      'field4',
    ],
  });
});

test('reorder nested column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const nestedFirstHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

  await t
    .click(nestedFirstHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_nested_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3'],
      },
      'field4',
    ],
  });
});

test('reorder fixed nested column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_nested_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('reorder fixed nested column to left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const secondFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

  await t
    .click(secondFixedLeftHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_fixed_nested_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
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
});

test('reorder nested column to left via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const nestedSecondHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

  await t.rightClick(nestedSecondHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_nested_column_to_left_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the left'));

  await testScreenshot(t, takeScreenshot, 'reorder_nested_column_to_left_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3'],
      },
      'field4',
    ],
  });
});

test('reorder nested column to right via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const nestedFirstHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

  await t.rightClick(nestedFirstHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_nested_column_to_right_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the right'));

  await testScreenshot(t, takeScreenshot, 'reorder_nested_column_to_right_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
    }],
    columns: [
      'field1',
      {
        caption: 'Band Column',
        columns: ['field2', 'field3'],
      },
      'field4',
    ],
  });
});

// Command columns
test('reorder column to left when there is a command column', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const thirdHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(thirdHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_column_to_left_when_there_is_command_column.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

test('reorder column to right when there is a command column', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const thirdHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(thirdHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_column_to_right_when_there_is_command_column.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

test('reorder a custom command column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t
    .click(commandHeader.element)
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_custom_command_column_to_right.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

test('reorder a custom command column to left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(4);

  await t
    .click(commandHeader.element)
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_custom_command_column_to_left.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

test('reorder a custom command column to right via context menu', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const contextMenu = dataGrid.getContextMenu();
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

  await t.rightClick(commandHeader.element);

  await testScreenshot(t, takeScreenshot, 'reorder_custom_command_column_to_right_via_context_menu_1.png');

  await t
    .click(contextMenu.getItemByText('Move to the right'));

  await testScreenshot(t, takeScreenshot, 'reorder_custom_command_column_to_right_via_context_menu_2.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
});

// Regular columns when adaptability is enabled
test('reorder column to right when adaptability is enabled and there are hidden columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const fourthHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(fourthHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await testScreenshot(t, takeScreenshot, 'reorder_column_to_right_when_there_are_hidden_columns.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[4].hidingPriority = 0;
      columns[5].hidingPriority = 1;
      columns[7].hidingPriority = 2;
    },
  });
});

test('reorder column to left when adaptability is enabled and there are hidden columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const fifthHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(4);

  await t
    .click(fifthHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await testScreenshot(t, takeScreenshot, 'reorder_column_to_left_when_there_are_hidden_columns.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
    allowColumnReordering: true,
    dataSource: [{
      field1: 'test1',
      field2: 'test2',
      field3: 'test3',
      field4: 'test4',
      field5: 'test5',
      field6: 'test6',
      field7: 'test7',
      field8: 'test8',
    }],
    customizeColumns: (columns) => {
      columns[0].hidingPriority = 0;
      columns[2].hidingPriority = 1;
      columns[3].hidingPriority = 2;
    },
  });
});

// Regular columns with async templates
[true, false].forEach((renderAsync) => {
  test(`reorder column when there are async templates and renderAsync = ${renderAsync}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();
    await t.wait(500); // wait for async templates to be rendered

    const firstHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await t
      .expect(firstHeader.element.textContent)
      .contains('Field');

    await t
      .click(firstHeader.element)
      .pressKey('ctrl+right')
      .wait(1000);

    await t
      .expect(firstHeader.element.textContent)
      .contains('Field');

    await t.debug();
    await testScreenshot(t, takeScreenshot, `reorder_column_when_there_are_async_templates_and_renderAsync_=_${renderAsync}.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      columnWidth: 100,
      allowColumnReordering: true,
      dataSource: [{
        field1: 'test1',
        field2: 'test2',
        field3: 'test3',
        field4: 'test4',
      }],
      columns: [
        'field1',
        {
          dataField: 'field2',
          headerCellTemplate: 'testHeaderCellTemplate',
        },
        'field3',
        'field4',
      ],
      renderAsync,
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
      integrationOptions: {
        templates: {
          testHeaderCellTemplate: {
            render({ model, container, onRendered }) {
              setTimeout(() => {
                container.append($('<b/>').text(model.column.caption));
                onRendered();
              }, 100);
            },
          },
        },
      },
    });
  });
});

// Autoscroll
[true, false].forEach((useNative) => {
  test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the right when column reordering via keyboard`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await t
      .click(firstHeaderCell.element)
      .pressKey('ctrl+right')
      .pressKey('ctrl+right')
      .pressKey('ctrl+right')
      .pressKey('ctrl+right');

    await testScreenshot(t, takeScreenshot, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_right_when_column_reordering.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      allowColumnReordering: true,
      columnWidth: 200,
      width: 800,
      dataSource: [{
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
      }],
      scrolling: {
        useNative,
      },
    });
  });

  test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the left when column reordering via keyboard`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const lastHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(9);

    await dataGrid.scrollTo(t, { x: 1200 });

    await t
      .expect(dataGrid.getScrollLeft())
      .eql(1200);

    await t
      .click(lastHeaderCell.element)
      .pressKey('ctrl+left')
      .pressKey('ctrl+left')
      .pressKey('ctrl+left')
      .pressKey('ctrl+left');

    await testScreenshot(t, takeScreenshot, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_left_when_column_reordering.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      allowColumnReordering: true,
      columnWidth: 200,
      width: 800,
      dataSource: [{
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
      }],
      scrolling: {
        useNative,
      },
    });
  });

  test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the right when column reordering via keyboard when virtual columns are enabled`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const firstHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await t.click(firstHeaderCell.element);

    for (let i = 0; i < 30; i += 1) {
      await t.pressKey('ctrl+right');
    }

    await testScreenshot(t, takeScreenshot, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_right_when_virtual_columns_are_enabled.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      allowColumnReordering: true,
      columnWidth: 100,
      width: 800,
      dataSource: getData(1, 30),
      scrolling: {
        useNative,
        columnRenderingMode: 'virtual',
      },
    });
  });

  test(`${useNative ? 'Native' : 'Simulated'} scrolling: Auto scroll to the left when column reordering via keyboard when virtual columns are enabled`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const lastHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(29);

    await dataGrid.scrollTo(t, { x: 2200 });

    await t
      .expect(dataGrid.getScrollLeft())
      .eql(2200);

    await t
      .click(lastHeaderCell.element);

    for (let i = 0; i < 30; i += 1) {
      await t.pressKey('ctrl+left');
    }

    await testScreenshot(t, takeScreenshot, `${useNative ? 'native' : 'simulated'}_scrolling_-_auto_scroll_to_left_when_virtual_columns_are_enabled.png`, { element: dataGrid.element });

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      allowColumnReordering: true,
      columnWidth: 100,
      width: 800,
      dataSource: getData(1, 30),
      scrolling: {
        useNative,
        columnRenderingMode: 'virtual',
      },
    });
  });
});
