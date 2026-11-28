import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const generateData = (rowCount: number) => new Array(rowCount).fill(null).map((_, idx) => ({
  A: `A_${idx}`,
  B: `B_${idx}`,
  C: `C_${idx}`,
}));

test.describe('Grouping Panel - Borders with enabled alternate rows', () => {
  test('Alternate rows should be the same size', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
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
          // @ts-expect-error todo check
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
    }), DEFAULT_SELECTOR, { arg: generateData(10) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T838734_alternate-rows-same-size.png', { element: dataGrid.element });
  });
});
