import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

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
