import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

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

    await takeScreenshot(
      `reorder_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}`,
      dataGrid.element,
    );

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

    await takeScreenshot(
      `reorder_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}`,
      dataGrid.element,
    );

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
    });
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

  await takeScreenshot(
    'reorder_fixed_left_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_fixed_left_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_fixed_right_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_fixed_right_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_sticky_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_sticky_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

// Band columns
test('reorder band column to right', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_band_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await takeScreenshot(
    'reorder_band_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await takeScreenshot(
    'reorder_nested_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_nested_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_fixed_nested_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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
  const firstFixedLeftHeader = dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(1);

  await t
    .click(firstFixedLeftHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await takeScreenshot(
    'reorder_fixed_nested_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

// Command columns
test('reorder column to left when there is a command column', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(commandHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await takeScreenshot(
    'reorder_column_to_left_when_there_is_command_column',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);

  await t
    .click(commandHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_column_to_right_when_there_is_command_column',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_custom_command_column_to_right',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

  await takeScreenshot(
    'reorder_custom_command_column_to_left',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columnWidth: 100,
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

// Regular columns when adaptability is enabled
test('reorder column to right when adaptability is enabled and there are hidden columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

  await t
    .click(commandHeader.element)
    .pressKey('ctrl+right')
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_column_to_right_when_there_are_hidden_columns',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
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
  const commandHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(4);

  await t
    .click(commandHeader.element)
    .pressKey('ctrl+left')
    .pressKey('ctrl+left');

  await takeScreenshot(
    'reorder_column_to_left_when_there_are_hidden_columns',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 550,
    columnWidth: 100,
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
