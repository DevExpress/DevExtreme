import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

const getVisibleColumns = (gridInstance: DataGrid): Promise<string[]> => {
  const { getGridInstance } = gridInstance;

  return ClientFunction(
    () => (getGridInstance() as any)
      .getVisibleColumns()
      .map((column: any) => column.dataField || column.name),
    { dependencies: { getGridInstance } },
  )();
};

fixture`Column reordering`
  .page(url(__dirname, '../container.html'));

// T975549
test('The column reordering should work correctly when there is a fixed column with zero width', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t
    .expect(headerRow.getHeaderCell(2).element.textContent)
    .eql('Field 2')
    .drag(headerRow.getHeaderCell(3).element, -400, 0)
    .expect(headerRow.getHeaderCell(2).element.textContent)
    .eql('Field 3')
    .expect(getVisibleColumns(dataGrid))
    .eql(['field1', 'fake', 'field3', 'field2', 'field4']);
}).before(() => createWidget('dxDataGrid', {
  width: 800,
  dataSource: [
    {
      field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
    },
  ],
  columns: [
    {
      dataField: 'field1',
      fixed: true,
      width: 200,
    }, {
      name: 'fake',
      fixed: true,
      width: 0.01,
    }, {
      dataField: 'field2',
      width: 200,
    }, {
      dataField: 'field3',
      width: 200,
    }, {
      dataField: 'field4',
      width: 200,
    },
  ],
  allowColumnReordering: true,
}));
