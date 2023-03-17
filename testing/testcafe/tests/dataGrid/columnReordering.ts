import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { ClassNames } from '../../model/dataGrid/classNames';

const CLASS = ClassNames;

const getVisibleColumns = (dataGrid: DataGrid): Promise<string[]> => {
  const { getInstance } = dataGrid;

  return ClientFunction(
    () => (getInstance() as any)
      .getVisibleColumns()
      .map((column: any) => column.dataField || column.name),
    { dependencies: { getInstance } },
  )();
};
const getColumnsSeparatorOffset = ClientFunction(() => $(`.${CLASS.columnsSeparator}`).offset(), { dependencies: { CLASS } });

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
}).before(async () => createWidget('dxDataGrid', {
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

// T1038094
test('The separator should display correctly when dragging column', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.moveHeader(0, 200, 5, true);

  await t
    .expect(getColumnsSeparatorOffset())
    .eql({
      left: 8,
      top: 8,
    });

  await dataGrid.moveHeader(0, 400, 5);

  await t
    .expect(getColumnsSeparatorOffset())
    .eql({
      left: 405,
      top: 8,
    });

  await dataGrid.moveHeader(0, 600, 5);

  await t
    .expect(getColumnsSeparatorOffset())
    .eql({
      left: 605,
      top: 8,
    });

  await dataGrid.moveHeader(0, 800, 5);

  await t
    .expect(getColumnsSeparatorOffset())
    .eql({
      left: 805,
      top: 8,
    });
}).before(async () => createWidget('dxDataGrid', {
  width: 800,
  dataSource: [
    {
      field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
    },
  ],
  columns: [
    {
      dataField: 'field1',
      width: 200,
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
  allowColumnResizing: true,
}));
