import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Editing - undefined values`
  .disablePageReloads
  .page(url(__dirname, '../../container.html'));

test('Should properly set nested undefined values (T1226946)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstCell = dataGrid.getDataCell(0, 0);
  const secondCell = dataGrid.getDataCell(1, 0);

  await t.expect(firstCell.element().textContent).eql('100');
  await t.expect(secondCell.element().textContent).eql('undefined');

  await dataGrid.apiCellValue(0, 0, { data: undefined });
  await dataGrid.apiSaveEditData();

  await t.expect(firstCell.element().textContent).eql('undefined');
  await t.expect(secondCell.element().textContent).eql('undefined');
}).before(async () => createWidget('dxDataGrid', {
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
