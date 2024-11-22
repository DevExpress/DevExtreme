import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import { changeTheme } from '../../../helpers/changeTheme';
import { Themes } from '../../../helpers/themes';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns - Grouping`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  safeSizeTest(`Sticky columns with grouping & summary (rtl=${rtlEnabled})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await takeScreenshot(`grouping-scroll-begin-rtl=${rtlEnabled}.png`, dataGrid.element);

    await dataGrid.scrollTo(t, { x: rtlEnabled ? 500 : 100 });
    await takeScreenshot(`grouping-scroll-center=${rtlEnabled}.png.png`, dataGrid.element);

    await dataGrid.scrollTo(t, { x: rtlEnabled ? 0 : 10000 });
    await takeScreenshot(`grouping-scroll-end=${rtlEnabled}.png.png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Sticky columns with grouping & summary (multiple groups)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('grouping-multiple-scroll-begin.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 100 });
  await takeScreenshot('grouping-multiple-scroll-center.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });
  await takeScreenshot('grouping-multiple-scroll-end.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
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

safeSizeTest('Sticky columns with grouping - overflow of group cell', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  await takeScreenshot('grouping-overflow-cell.png', dataGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
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

[Themes.genericLight, Themes.materialBlue, Themes.fluentBlue].forEach((theme) => {
  safeSizeTest(`The header row should be highlighted correctly when dragging column when there are fixed columns and allowColumnReordering=false (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid('#container');

    await t.drag(dataGrid.getGroupPanel().getHeader(0).element, 200, 35);

    await t
      .expect(await takeScreenshot(`header_row_highlight_with_fixed_columns_(${theme}).png`, dataGrid.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 800]).before(async () => {
    await changeTheme(theme);
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
    await changeTheme(Themes.genericLight);
  });
});

safeSizeTest('The group separator should be visible when dragging a fixed column into the group panel', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element, 100, -50);

  await t
    .expect(await takeScreenshot('dragging_fixed_column_to_group_panel.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => {
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
