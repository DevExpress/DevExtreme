import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { defaultConfig } from '../helpers/data';
import { MouseAction, MouseUpEvents } from '../../../../helpers/mouseUpEvents';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns - Grouping`
  .page(url(__dirname, '../../../container.html'));

[false, true].forEach((rtlEnabled) => {
  test.meta({ browserSize: [900, 800] })(`Sticky columns with grouping & summary (rtl=${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await testScreenshot(t, takeScreenshot, `grouping-scroll-begin-rtl=${rtlEnabled}.png`, { element: dataGrid.element });

    await dataGrid.scrollTo(t, { x: rtlEnabled ? 500 : 100 });
    await testScreenshot(t, takeScreenshot, `grouping-scroll-center=${rtlEnabled}.png`, { element: dataGrid.element });

    await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });
    await testScreenshot(t, takeScreenshot, `grouping-scroll-end=${rtlEnabled}.png`, { element: dataGrid.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    ...defaultConfig,
    rtlEnabled,
    customizeColumns(columns) {
      columns[2].groupIndex = 0;
    },
    summary: {
      groupItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'City',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
        displayFormat: 'Total: {0}',
        showInGroupFooter: true,
      }],
      totalItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'SaleAmount',
        summaryType: 'max',
        valueFormat: 'currency',
      }, {
        column: 'TotalAmount',
        summaryType: 'max',
        valueFormat: 'currency',
      }, {
        column: 'TotalAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
        displayFormat: 'Total: {0}',
      }],
    },
  }));
});

test.meta({ browserSize: [900, 800] })('Sticky columns with grouping & summary (multiple groups)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'grouping-multiple-scroll-begin.png', { element: dataGrid.element });

  await dataGrid.scrollTo(t, { x: 100 });
  await testScreenshot(t, takeScreenshot, 'grouping-multiple-scroll-center.png', { element: dataGrid.element });

  await dataGrid.scrollTo(t, { x: 10000 });
  await testScreenshot(t, takeScreenshot, 'grouping-multiple-scroll-end.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  customizeColumns(columns) {
    columns[2].groupIndex = 0;
    columns[3].groupIndex = 1;
    columns[4].groupIndex = 2;
  },
  summary: {
    groupItems: [{
      column: 'OrderNumber',
      summaryType: 'count',
      displayFormat: '{0} orders',
    }, {
      column: 'City',
      summaryType: 'max',
      valueFormat: 'currency',
      showInGroupFooter: false,
      alignByColumn: true,
    }, {
      column: 'TotalAmount',
      summaryType: 'max',
      valueFormat: 'currency',
      showInGroupFooter: false,
      alignByColumn: true,
    }, {
      column: 'TotalAmount',
      summaryType: 'sum',
      valueFormat: 'currency',
      displayFormat: 'Total: {0}',
      showInGroupFooter: true,
    }],
    totalItems: [{
      column: 'OrderNumber',
      summaryType: 'count',
      displayFormat: '{0} orders',
    }, {
      column: 'SaleAmount',
      summaryType: 'max',
      valueFormat: 'currency',
    }, {
      column: 'TotalAmount',
      summaryType: 'max',
      valueFormat: 'currency',
    }, {
      column: 'TotalAmount',
      summaryType: 'sum',
      valueFormat: 'currency',
      displayFormat: 'Total: {0}',
    }],
  },
}));

test.meta({ browserSize: [900, 800] })('Sticky columns with grouping - overflow of group cell', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'grouping-overflow-cell.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  customizeColumns(columns) {
    columns[2].groupIndex = 0;
  },
  summary: {
    groupItems: [{
      column: 'OrderDate',
      summaryType: 'count',
      alignByColumn: true,
    }],
  },
}));

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
test.meta({ browserSize: [900, 800] })('The header row should be highlighted correctly when dragging column when there are fixed columns and allowColumnReordering=false (generic.light theme)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();
  await t.wait(300);

  await t.drag(dataGrid.getGroupPanel().getHeader(0).element, 200, 35);
  await t.wait(200);

  await testScreenshot(t, takeScreenshot, 'header_row_highlight_with_fixed_columns.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await MouseUpEvents.disable(MouseAction.dragToOffset);

  return createWidget('dxDataGrid', {
    ...defaultConfig,
    customizeColumns(columns) {
      columns[2].groupIndex = 0;
    },
    groupPanel: {
      visible: true,
    },
    allowColumnReordering: false,
    onToolbarPreparing(e): void {
      e.toolbarOptions.allowKeyboardNavigation = false;
    },
  });
}).after(async () => {
  await MouseUpEvents.enable(MouseAction.dragToOffset);
});

test.meta({ browserSize: [900, 800] })('The group separator should be visible when dragging a fixed column into the group panel', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();
  await t.wait(300);

  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element, 100, -50);
  await t.wait(200);

  await testScreenshot(t, takeScreenshot, 'dragging_fixed_column_to_group_panel.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await MouseUpEvents.disable(MouseAction.dragToOffset);

  return createWidget('dxDataGrid', {
    ...defaultConfig,
    customizeColumns(columns) {
      columns[2].groupIndex = 0;
    },
    groupPanel: {
      visible: true,
    },
    allowColumnReordering: false,
  });
}).after(async () => {
  await MouseUpEvents.enable(MouseAction.dragToOffset);
});

test('DataGrid - Group row content is scrolled if repaintChangesOnly is enabled and the grid has a fixed column (T1286077)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const groupRow = dataGrid.getGroupRow(0);
  const groupPanelToggle = groupRow.getCell(0).element;

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t
    .click(groupPanelToggle);

  await t
    .expect(dataGrid.getGroupRow(0).isExpanded)
    .ok();

  await t
    .click(groupPanelToggle);

  await t
    .expect(dataGrid.getGroupRow(0).isExpanded)
    .notOk();

  await dataGrid.scrollBy(t, { x: 1000 });

  await testScreenshot(t, takeScreenshot, 'group_row_scrolling_all_collapsed_fixed_columns.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  columnAutoWidth: false,
  customizeColumns(columns) {
    columns[2].groupIndex = 0;
  },
  columnWidth: 200,
  repaintChangesOnly: true,
  grouping: {
    autoExpandAll: false,
  },
  scrolling: {
    showScrollbar: 'never',
  },
}));

[false, true].forEach((rtlEnabled) => {
  // T1284612
  test(`DataGrid - Group summaries are shown over sticky columns on a horizontal scroll - intersection (rtl=${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await testScreenshot(t, takeScreenshot, `grouping-scroll-total_summary_intersection-rtl=${rtlEnabled}.png`, { element: dataGrid.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    ...defaultConfig,
    rtlEnabled,
    customizeColumns(columns) {
      columns[2].groupIndex = 0;
      columns[1].visible = false;
      columns[3].width = 200;
    },
    summary: {
      groupItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'City',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
        displayFormat: 'Total: {0}',
        showInGroupFooter: true,
      }],
      totalItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'SaleAmount',
        summaryType: 'max',
        valueFormat: 'currency',
      }, {
        column: 'TotalAmount',
        summaryType: 'max',
        valueFormat: 'currency',
      }, {
        column: 'TotalAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
        displayFormat: 'Total: {0}',
      }],
    },
  }));
});

[false, true].forEach((rtlEnabled) => {
  // T1284612
  test(`DataGrid - Group summaries are shown over sticky columns on a horizontal scroll (rtl=${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await testScreenshot(t, takeScreenshot, `grouping-scroll-total_summary-rtl=${rtlEnabled}.png`, { element: dataGrid.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    ...defaultConfig,
    rtlEnabled,
    customizeColumns(columns) {
      columns[2].groupIndex = 0;
      columns[1].visible = false;
      columns[4].width = 150;
    },
    summary: {
      groupItems: [{
        column: 'OrderNumber',
        summaryType: 'count',
        displayFormat: '{0} orders',
      }, {
        column: 'City',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'max',
        valueFormat: 'currency',
        showInGroupFooter: false,
        alignByColumn: true,
      }, {
        column: 'TotalAmount',
        summaryType: 'sum',
        valueFormat: 'currency',
        displayFormat: 'Total: {0}',
        showInGroupFooter: true,
      }],
      totalItems: [{
        column: 'SaleAmount',
        summaryType: 'max',
        valueFormat: 'currency',
        displayFormat: 'MAXMAXMAXMAX: {0}',
      }],
    },
  }));
});
