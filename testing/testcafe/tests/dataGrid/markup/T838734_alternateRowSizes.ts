import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';

fixture.disablePageReloads`Grouping Panel - Borders with enabled alternate rows`
  .page(url(__dirname, '../../container.html'));

const GRID_SELECTOR = '#container';

const generateData = (rowCount) => new Array(rowCount).fill(null).map((_, idx) => ({
  A: `A_${idx}`,
  B: `B_${idx}`,
  C: `C_${idx}`,
}));

test('Alternate rows should be the same size', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await takeScreenshot(
    'T838734_alternate-rows-same-size.png',
    dataGrid.element,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: generateData(10),
  columns: ['A', 'B', {
    dataField: 'C',
    cellTemplate: ($container, { value }) => {
      const $root = $('<div>');
      $('<div>')
        .text('C template')
        .appendTo($root);
      $('<div>')
        .text(value)
        .appendTo($root);
      $root.appendTo($container);
    },
  }],
  onCellPrepared: ({ cellElement, value }) => {
    if (typeof value === 'string' && value.startsWith('B')) {
      cellElement.html(`
      <div>
        <div>B template:</div>
        <div>${value}</div>
      </div>
      `);
    }
  },
  showRowLines: false,
  rowAlternationEnabled: true,
}));
