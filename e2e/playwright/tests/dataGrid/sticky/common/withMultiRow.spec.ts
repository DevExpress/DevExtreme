import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { defaultConfig } from '../helpers/data';

test.describe('Sticky columns - Multi Row Header Columns', () => {
  test.use({ browserSize: [800, 800] });

  test('The multi row header columns should have vertical borders when a column is fixed (T1282595)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      columns: [
        {
          dataField: 'ID',
          fixed: true,
        },
        {
          caption: 'Order',
          columns: [
            'OrderNumber',
            'OrderDate',
          ],
        },
        'SaleAmount',
        'Terms',
      ],
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'multi_row_header_columns.png', { element: dataGrid.element });
  });
});
