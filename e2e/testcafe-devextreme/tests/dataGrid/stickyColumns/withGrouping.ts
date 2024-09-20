import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns - Grouping`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Sticky columns with grouping & summary', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await takeScreenshot('grouping-scroll-begin.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 100 });
  await takeScreenshot('grouping-scroll-center.png', dataGrid.element);

  await dataGrid.scrollTo(t, { x: 10000 });
  await takeScreenshot('grouping-scroll-end.png', dataGrid.element);

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
