import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`DataGrid - Column resizing`
  .page(url(__dirname, '../../container.html'));

test('Column resizer should be activatable within the 24x24 px minimum target size', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerRow = dataGrid.getHeaders().getHeaderRow(0);
  const firstHeaderCell = headerRow.getHeaderCell(0).element.with({ timeout: 0 });

  // assert
  await t.expect(dataGrid.isReady()).ok();

  const deltaX = 50;
  const minTargetSize = 24;
  const initialWidth = await firstHeaderCell.clientWidth;

  // assert
  await t
    .expect(initialWidth)
    .eql(150);

  // act
  await t.drag(firstHeaderCell, deltaX, 0, { offsetX: initialWidth + (minTargetSize / 2) });

  const resizedWidth = await firstHeaderCell.clientWidth;

  // assert
  await t
    .expect(resizedWidth)
    .eql(initialWidth + deltaX);

  // act
  await t.drag(firstHeaderCell, -deltaX, 0, { offsetX: resizedWidth - (minTargetSize / 2) });

  const revertedWidth = await firstHeaderCell.clientWidth;

  // assert
  await t
    .expect(revertedWidth)
    .eql(initialWidth);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ field_0: 'a', field_1: 'b' }],
  keyExpr: 'field_0',
  allowColumnResizing: true,
  columns: [
    { dataField: 'field_0', width: 150 },
    { dataField: 'field_1', width: 150 },
  ],
}));
