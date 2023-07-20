import { RequestMock } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';

fixture`Editing - cell focus`
  .page(url(__dirname, '../../containerAspNet.html'));

const apiRequestMock = RequestMock()
  .onRequestTo(/\/api\/data/)
  .respond(
    {
      data: [
        {
          id: 0,
          data: 'A',
        }, {
          id: 1,
          data: 'B',
        }, {
          id: 2,
          data: 'C',
        },
      ],
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/update/)
  .respond(
    {},
    200,
    {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': '*',
    },
  );

// T1154721
test('Should allow focus next editor in the same column after save changes with local data source', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstCell = dataGrid.getDataCell(0, 0);
  const middleCell = dataGrid.getDataCell(1, 0);
  const secondCell = dataGrid.getDataCell(2, 0);

  await t.typeText(firstCell.getEditor().element, ' AAA');
  await t.typeText(secondCell.getEditor().element, ' CCC');
  await t.click(middleCell.element);

  const firstCellValue = await firstCell.getEditor().element().value;
  const secondCellValue = await secondCell.getEditor().element().value;

  await t.expect(firstCellValue).eql('A AAA');
  await t.expect(secondCellValue).eql('C CCC');
}).before(async () => createWidget('dxDataGrid', {
  keyExpr: 'id',
  dataSource: [{
    id: 0,
    data: 'A',
  }, {
    id: 1,
    data: 'B',
  }, {
    id: 2,
    data: 'C',
  }],
  editing: {
    allowUpdating: true,
    refreshMode: 'repaint',
    mode: 'cell',
  },
  columns: [{
    dataField: 'data',
    showEditorAlways: true,
  }],
  repaintChangesOnly: true,
}));

// T1037019
test('Should allow focus next editor in the same column after save changes with remote data source', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstCell = dataGrid.getDataCell(0, 0);
  const middleCell = dataGrid.getDataCell(1, 0);
  const secondCell = dataGrid.getDataCell(2, 0);

  await t.typeText(firstCell.getEditor().element, ' AAA');
  await t.typeText(secondCell.getEditor().element, ' CCC');
  await t.click(middleCell.element);

  const firstCellValue = await firstCell.getEditor().element().value;
  const secondCellValue = await secondCell.getEditor().element().value;

  await t.expect(firstCellValue).eql('A AAA');
  await t.expect(secondCellValue).eql('C CCC');
}).before(async (t) => {
  await t.addRequestHooks(apiRequestMock);
  await createWidget('dxDataGrid', () => ({
    keyExpr: 'id',
    dataSource: (window as any).DevExpress.data.AspNet.createStore({
      key: 'id',
      loadUrl: 'https://api/data',
      updateUrl: 'https://api/update',
    }),
    editing: {
      allowUpdating: true,
      refreshMode: 'repaint',
      mode: 'cell',
    },
    columns: [{
      dataField: 'data',
      showEditorAlways: true,
    }],
    repaintChangesOnly: true,
  }));
}).after(async (t) => { await t.removeRequestHooks(apiRequestMock); });
