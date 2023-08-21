import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

fixture.disablePageReloads`filterPanel`
  .page(url(__dirname, '../container.html'));

const POPUP_CLASS = '.dx-popup';
const INVISIBLE_CLASS = '.dx-state-invisible';

function getVisiblePopups(): Selector {
  return Selector(`${POPUP_CLASS}:not(${INVISIBLE_CLASS})`);
}

// T1182854
test('editor\'s popup inside filterBuilder is opening & closing right (T1182854)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const filterBuilder = (
    await dataGrid.getFilterPanel().openFilterBuilderPopup(t)
  ).getFilterBuilder();

  await t.expect(getVisiblePopups().count).eql(1); // only filterPanel popup

  await t.click(filterBuilder.getField().getValueText());
  await t.expect(getVisiblePopups().count).eql(2); // filterPanel popup + editor popup

  await t.click(filterBuilder.getField().getValueText());
  await t.expect(getVisiblePopups().count).eql(1); // only filterPanel popup

  await t.click(filterBuilder.getField().getValueText());
  await t.expect(getVisiblePopups().count).eql(2); // filterPanel popup + editor popup
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ column1: 'first' }],
  columns: ['column1'],
  filterValue: ['column1', 'anyof', []],
  filterPanel: {
    visible: true,
  },
}));
