import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { getData } from './helpers/generateDataSourceData';

fixture.disablePageReloads`Validation`
  .page(url(__dirname, '../container.html'));

test('Validation popup screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+a backspace enter')
    .expect(Selector('.dx-datagrid-revert-tooltip').exists)
    .ok()
    .expect(Selector('.dx-invalid-message.dx-invalid-message-always.dx-datagrid-invalid-message').exists)
    .ok()
    // act
    .expect(await takeScreenshot('validation-popup', dataGrid.element))
    .ok()
    // assert
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  columns: [{
    dataField: 'field_0',
    validationRules: [{ type: 'required' }],
  }, {
    dataField: 'field_1',
    validationRules: [{ type: 'required' }],
  }],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
  },
}));
