import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Toasts in DataGrid`.page(
  url(__dirname, '../../container.html'),
);

test('Toast should be visible after calling and should be not visible after default display time', async (t) => {
  await t.expect(Selector('.dx-toast-wrapper').exists).ok();

  await t.expect(Selector('.dx-toast-wrapper').exists).notOk();
}).before(async () => {
  createWidget('dxDataGrid', {
    dataSource: [],
    keyExpr: 'ID',
    columns: ['CompanyName', 'Zipcode', 'City', 'State', 'Phone', 'Fax'],
    showBorders: true,
  });

  await ClientFunction(() => ($('#container') as any).dxDataGrid('instance').isReady())();

  await ClientFunction(() => {
    const dataGrid = ($('#container') as any).dxDataGrid('instance');
    dataGrid.getController('errorHandling').showErrorToast('Error');
  })();
});
