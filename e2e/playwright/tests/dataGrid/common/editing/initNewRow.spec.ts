import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.describe('initNewRow', () => {
  // T1274123
  test('No errors should be thrown if inserting new row after cancelling insert on second page', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
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
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getHeaderPanel().getAddRowButton().click();
    await dataGrid.getPopupEditForm().cancelButton.click();

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    await expect(dataGrid.getPopupEditForm().element).toBeAttached();
  });
});
