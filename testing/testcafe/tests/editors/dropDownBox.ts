import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import DropDownBox from '../../model/dropDownBox';
import DataGrid from '../../model/dataGrid';

const pureClick = async (t, selector): Promise<void> => {
  await t
    .click(selector.element)
    .wait(500);
};

const scrollBy = ClientFunction((x, y) => {
  window.scrollBy(x, y);
});

fixture`DropDownBox`
  .page(url(__dirname, './pages/t942296.html'));

test('DropDownBox should correctly focus nested Grid with lazy dataSource', async (t) => {
  const editor = new DropDownBox('#editor');

  await scrollBy(0, 50);
  await pureClick(t, editor);

  await t
    .wait(1000)
    .expect(await editor.isOpened())
    .ok();

  const dataGrid = new DataGrid('#grid');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t
    .pressKey('tab')
    .pressKey('tab')
    .expect(headers.hasFocusedState)
    .ok()
    .expect(headerRow.getHeaderCell(0).element.focused)
    .ok();
});
