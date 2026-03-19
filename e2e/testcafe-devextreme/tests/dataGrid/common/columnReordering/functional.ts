import { ClientFunction } from 'testcafe';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClassNames } from 'devextreme-testcafe-models/dataGrid/classNames';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

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

fixture.disablePageReloads`Column reordering`
  .page(url(__dirname, '../../../container.html'));

// T975549
test('The column reordering should work correctly when there is a fixed column with zero width', async (t) => {
  const dataGrid = new DataGrid('#container');
  await t.expect(dataGrid.isReady()).ok();

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
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
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
  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.moveHeader(0, 200, 5, true);

  await t
    .expect(getColumnsSeparatorOffset())
    .eql({
      left: 8,
      top: 8,
    });

  await dataGrid.moveHeader(0, 400, 5);

  const offset2 = await getColumnsSeparatorOffset();
  await t
    .expect(offset2!.left).within(405, 406.5)
    .expect(offset2!.top).eql(8);

  await dataGrid.moveHeader(0, 600, 5);

  const offset3 = await getColumnsSeparatorOffset();

  await t
    .expect(offset3!.left).within(605, 606.5)
    .expect(offset3!.top).eql(8);

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

test('Column without allowReordering should have same position after dragging to groupPanel and back', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await t.drag(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).element, -100, -50);

  await t.expect(dataGrid.getGroupPanel().getHeadersCount()).eql(1);

  await t.drag(dataGrid.getGroupPanel().getHeader(0).element, 0, 50);

  const headers = await Promise.all([0, 1, 2, 3].map(
    (i) => dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(i).element.textContent,
  ));

  await t.expect(headers).eql(['Field 1', 'Field 2', 'Field 3', 'Field 4']);
}).before(async () => createWidget('dxDataGrid', {
  width: 800,
  dataSource: [
    {
      field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
    },
  ],
  groupPanel: {
    visible: true,
  },
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
  allowColumnReordering: false,
}));

// T1316881
test('Column reordering should work correctly with fixed columns on the right and columnRenderingMode is virtual', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  const lastHeader = headerRow.getDataHeaderCells().nth(11);

  // assert
  await t
    .expect(lastHeader.textContent)
    .eql('19');

  // act
  await t.drag(lastHeader, -200, 0);

  // assert
  await t
    .expect(headerRow.getDataHeaderCells().nth(11).textContent)
    .eql('18');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{}],
  width: 800,
  allowColumnReordering: true,
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  columns: [
    { dataField: '1' },
    { dataField: '2' },
    { dataField: '3' },
    { dataField: '4' },
    { dataField: '5' },
    { dataField: '6' },
    { dataField: '7' },
    { dataField: '8' },
    { dataField: '9' },
    { dataField: '10' },
    { dataField: '11' },
    { dataField: '12' },
    { dataField: '13' },
    { dataField: '14' },
    { dataField: '15' },
    { dataField: '16' },
    { dataField: '17' },
    { dataField: '18', fixed: true, fixedPosition: 'right' },
    { dataField: '19', fixed: true, fixedPosition: 'right' },
  ],
}));

// T1316881
test('Column reordering should work correctly after scrolling right with fixed columns on the left and columnRenderingMode is virtual', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.scrollTo(t, { x: 10000 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1100)
    .expect(headerRow.getHeaderCell(16).element.exists) // last non-fixed column
    .ok()
    .expect(headerRow.getDataHeaderCells().nth(0).textContent)
    .eql('1');

  // act
  await t.drag(headerRow.getDataHeaderCells().nth(1), -200, 0);

  // assert
  await t
    .expect(headerRow.getDataHeaderCells().nth(0).textContent)
    .eql('2');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{}],
  width: 800,
  allowColumnReordering: true,
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  columns: [
    { dataField: '1', fixed: true, fixedPosition: 'left' },
    { dataField: '2', fixed: true, fixedPosition: 'left' },
    { dataField: '3' },
    { dataField: '4' },
    { dataField: '5' },
    { dataField: '6' },
    { dataField: '7' },
    { dataField: '8' },
    { dataField: '9' },
    { dataField: '10' },
    { dataField: '11' },
    { dataField: '12' },
    { dataField: '13' },
    { dataField: '14' },
    { dataField: '15' },
    { dataField: '16' },
    { dataField: '17' },
    { dataField: '18' },
    { dataField: '19' },
  ],
}));

// T1316881
test('Dragging a fixed column to a group panel should work correctly when columnRenderingMode is virtual', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  const fixedHeader = headerRow.getDataHeaderCells().nth(10);

  // assert
  await t
    .expect(fixedHeader.textContent)
    .eql('18');

  // act
  await t.drag(fixedHeader, -600, -50);

  // assert
  await t
    .expect(dataGrid.getGroupPanel().getHeader(0).element.textContent)
    .eql('18');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{}],
  width: 800,
  allowColumnReordering: true,
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  groupPanel: {
    visible: true,
  },
  columns: [
    { dataField: '1' },
    { dataField: '2' },
    { dataField: '3' },
    { dataField: '4' },
    { dataField: '5' },
    { dataField: '6' },
    { dataField: '7' },
    { dataField: '8' },
    { dataField: '9' },
    { dataField: '10' },
    { dataField: '11' },
    { dataField: '12' },
    { dataField: '13' },
    { dataField: '14' },
    { dataField: '15' },
    { dataField: '16' },
    { dataField: '17' },
    { dataField: '18', fixed: true, fixedPosition: 'right' },
    { dataField: '19', fixed: true, fixedPosition: 'right' },
  ],
}));

// T1316881
test('Dragging a fixed column to a column chooser should work correctly when columnRenderingMode is virtual', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // act - open column chooser
  await t.click(dataGrid.getColumnChooserButton());

  // assert
  await t
    .expect(dataGrid.getColumnChooser().isOpened)
    .ok();

  const fixedHeader = headerRow.getDataHeaderCells().nth(10);

  // assert
  await t
    .expect(fixedHeader.textContent)
    .eql('18');

  // act
  await t.drag(fixedHeader, 20, 300);

  // assert
  await t
    .expect(await dataGrid.getColumnChooser().getColumnTexts())
    .eql(['18']);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{}],
  width: 800,
  height: 500,
  allowColumnReordering: true,
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  columnChooser: {
    enabled: true,
  },
  columns: [
    { dataField: '1' },
    { dataField: '2' },
    { dataField: '3' },
    { dataField: '4' },
    { dataField: '5' },
    { dataField: '6' },
    { dataField: '7' },
    { dataField: '8' },
    { dataField: '9' },
    { dataField: '10' },
    { dataField: '11' },
    { dataField: '12' },
    { dataField: '13' },
    { dataField: '14' },
    { dataField: '15' },
    { dataField: '16' },
    { dataField: '17' },
    { dataField: '18', fixed: true, fixedPosition: 'right' },
    { dataField: '19', fixed: true, fixedPosition: 'right' },
  ],
}));
