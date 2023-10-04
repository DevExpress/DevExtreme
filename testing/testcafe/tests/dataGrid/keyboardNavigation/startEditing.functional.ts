import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture`Keyboard Navigation - editOnKeyPress`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Editing should start by pressing enter after scrolling content with scrolling.mode=virtual', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await dataGrid.scrollBy({ y: 10000 });

  await t.click(dataGrid.getDataCell(49, 1).element);
  await t.pressKey('enter');

  await t.expect(dataGrid.getDataCell(49, 1).getEditor().element.focused).ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(50)].map((_, i) => ({
      data1: i * 2,
      data2: i * 2 + 1,
    })),
    columns: [
      'data1',
      'data2',
    ],
    editing: {
      allowUpdating: true,
    },
    scrolling: {
      mode: 'virtual',
    },
    height: 300,
  });
});
