/* eslint-disable @typescript-eslint/no-misused-promises */
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`initNewRow`
  .page(url(__dirname, '../../container.html'));

// T1274123
test('No errors should be thrown if inserting new row after cancelling insert on second page', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(
      dataGrid.getHeaderPanel().getAddRowButton(),
    )
    .click(
      dataGrid.getPopupEditForm().cancelButton,
    );

  await t.click(
    dataGrid.getHeaderPanel().getAddRowButton(),
  );

  await t.expect(
    dataGrid.getPopupEditForm().element.exists,
  ).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(40)].map((_, index) => ({ id: index + 1, text: `item ${index + 1}` })),
    keyExpr: 'id',
    paging: {
      pageIndex: 1,
    },
    columns: ['id', 'text'],
    showBorders: true,
    editing: { mode: 'popup', allowAdding: true },
    onInitNewRow(e) {
      e.data.id = 0;
      e.data.text = 'test';
    },
    height: 300,
  });
});
