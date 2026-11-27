import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('Accessibility bugs', () => {
  test('T1187314 - DataGrid displays an incorrect row count in "aria-label" if there is no data after filtering', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'A',
      }],
      filterRow: { visible: true },
      scrolling: { mode: 'infinite' },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiFilter(['id', '=', '1']);
    await expect(dataGrid.getContainer())
      .toHaveAttribute('aria-label', 'Data grid with 0 rows and 2 columns');
  });

  test('DataGrid - The \'aria-label\' attribute value is "Show filter options for column \'undefined\' for the header filter icon in grouped fields (T1205784)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'A',
      }],
      groupPanel: {
        visible: true,
      },
      headerFilter: {
        visible: true,
      },
      columns: [
        'data',
        {
          dataField: 'id',
          groupIndex: 0,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getGroupPanel().getHeader(0).getFilterButton())
      .toHaveAttribute('aria-label', 'Show filter options for column \'Id\'');
  });

  test('DataGrid - NVDA reads column information twice (T1286287)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 5),
      keyExpr: 'field_0',
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const dataCell = dataGrid.getDataCell(1, 1).element;

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataCell).not.toHaveAttribute('aria-describedby');
  });
});
