import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture
  .disablePageReloads`Keyboard Navigation - Group Column Reordering`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

// Group columns
[true, false].forEach((rtlEnabled) => {
  test(`reorder group column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);
    const shortcut = rtlEnabled ? 'ctrl+left' : 'ctrl+right';

    await t
      .click(firstGroupHeader.element)
      .pressKey(shortcut);

    await takeScreenshot(
      `reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}`,
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

  test(`reorder group column when ${rtlEnabled ? 'right' : 'left'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const lastGroupHeader = dataGrid.getGroupPanel().getHeader(1);
    const shortcut = rtlEnabled ? 'ctrl+right' : 'ctrl+left';

    await t
      .click(lastGroupHeader.element)
      .pressKey(shortcut);

    await takeScreenshot(
      `reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_when_rtlEnabled_=_${rtlEnabled}`,
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

  test(`reorder group column to ${rtlEnabled ? 'left' : 'right'} via context menu when rtlEnabled = ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();
    const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

    await t.rightClick(firstGroupHeader.element);

    await takeScreenshot(`reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1`);

    await t
      .click(contextMenu.getItemByText('Move as next'));

    await takeScreenshot(`reorder_group_column_to_${rtlEnabled ? 'left' : 'right'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2`);

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

    await t.rightClick(lastGroupHeader.element);

    await takeScreenshot(`reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_1`);

    await t
      .click(contextMenu.getItemByText('Move as previous'));

    await takeScreenshot(`reorder_group_column_to_${rtlEnabled ? 'right' : 'left'}_via_context_menu_when_rtlEnabled_=_${rtlEnabled}_2`);

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

  await takeScreenshot(
    'reorder_group_column_when_onKeyDown_args_handled_=_true',
    dataGrid.element,
  );

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
  });
});

test('The group column should not be reordered when groupPanel.allowColumnDragging = false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupHeader.element)
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_group_column_when_group_panel_allowColumnDragging_is_false',
    dataGrid.element,
  );

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

test('The group column should not be reordered when it has allowGrouping set to false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t
    .click(firstGroupHeader.element)
    .pressKey('ctrl+right');

  await takeScreenshot(
    'reorder_group_column_with_allowGrouping_is_false',
    dataGrid.element,
  );

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
  });
});

test('The context menu should not have items for column reordering when groupPanel.allowColumnDragging = false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstGroupHeader = dataGrid.getGroupPanel().getHeader(0);

  await t.rightClick(firstGroupHeader.element);

  await takeScreenshot('reorder_group_column_via_context_menu_when_group_panel_allowColumnDragging_is_false');

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
