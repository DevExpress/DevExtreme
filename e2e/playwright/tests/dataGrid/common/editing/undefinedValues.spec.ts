import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.describe('Editing - undefined values', () => {
  test('Should properly set nested undefined values (T1226946)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{
        id: 0,
        value: {
          data: 100,
        },
      }, {
        id: 1,
        value: {
          data: undefined,
        },
      }],
      keyExpr: 'id',
      columns: [{
        dataField: 'value',
        customizeText: (cellInfo) => String(cellInfo.value.data ?? 'undefined'),
      }],
      showBorders: true,
    }));

    const dataGrid = new DataGrid(page, '#container');
    const firstCell = dataGrid.getDataCell(0, 0);
    const secondCell = dataGrid.getDataCell(1, 0);

    await expect(firstCell.element).toHaveText('100');
    await expect(secondCell.element).toHaveText('undefined');

    await dataGrid.apiCellValue(0, 0, { data: undefined });
    await dataGrid.apiSaveEditData();

    await expect(firstCell.element).toHaveText('undefined');
    await expect(secondCell.element).toHaveText('undefined');
  });
});
