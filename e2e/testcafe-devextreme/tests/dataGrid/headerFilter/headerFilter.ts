import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { getData } from '../helpers/generateDataSourceData';

fixture.disablePageReloads`Header Filter`
  .page(url(__dirname, '../../container.html'));

const GRID_CONTAINER = '#container';

test('Data should be filtered if (Blank) is selected in the header filter (T1257261)', async (t) => {
  const result: string[] = [];
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
  const dataCell = dataGrid.getDataRow(0).getDataCell(0);
  const filterIconElement = headerCell.getFilterIcon();
  const headerFilter = new HeaderFilter();
  const buttons = headerFilter.getButtons();
  const list = headerFilter.getList();

  await t
    .click(filterIconElement)
    .click(list.getItem(1).element) // Select second item with value 'Item 1'
    .click(buttons.nth(0)); // Click OK

  result[0] = await dataCell.element().innerText;

  await t
    .click(filterIconElement)
    .click(list.getItem(1).element) // Deselect second item with value 'Item 1'
    .click(list.getItem(0).element) // Select second item with value '(Blanks)'
    .click(buttons.nth(0)); // Click OK

  result[1] = await dataCell.element().innerText;

  await t.expect(result[0]).eql('1')
    .expect(result[1]).eql('2');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Text: 'Item 1' },
    { ID: 2, Text: '' },
    { ID: 3, Text: 'Item 3' },
  ],
  keyExpr: 'ID',
  showBorders: true,
  remoteOperations: true,
  headerFilter: { visible: true },
  filterRow: { visible: true },
  filterPanel: { visible: true },
}));

test('HeaderFilter icon should be grayed out after the clearFilter call (T1193648)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  // act
  await dataGrid.apiClearFilter();

  // assert
  await t
    .expect(await takeScreenshot('header-filter-icon-clear-filter.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    Name: 'A',
  }, {
    ID: 2,
    Name: 'B',
  }],
  keyExpr: 'ID',
  showBorders: true,
  headerFilter: { visible: true },
  filterRow: { visible: true },
  columns: [{
    dataField: 'Name',
    filterValues: ['A'],
    filterValue: 'A',
  }],
  height: 140,
}));

test('The header filter should fit inside the viewport if the grid is scrolled horizontally (T1156848)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const filterIconElement = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getFilterIcon();

  // act
  await dataGrid.scrollBy({ x: 100 });
  await t.click(filterIconElement);

  // assert
  await t
    .expect(await takeScreenshot('grid-header-filter-popup-T1156848', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  columns: ['Column1', 'Column2'],
  columnWidth: 250,
  width: 400,
  height: 400,
  headerFilter: { visible: true },
}));

test('HeaderFilter popup screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();

  await t
    .click(filterIconElement)
    // act
    .expect(await takeScreenshot('header-filter-popup.png', dataGrid.element))
    .ok()
    // assert
    .expect(new HeaderFilter().element.exists)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(20, 2),
  height: 400,
  showBorders: true,
  headerFilter: {
    visible: true,
  },
}));

test('Should correctly change values (T1161941)', async (t) => {
  const result: string[] = [];
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
  const dataCell = dataGrid.getDataRow(0).getDataCell(1);
  const filterIconElement = headerCell.getFilterIcon();
  const headerFilter = new HeaderFilter();
  const buttons = headerFilter.getButtons();
  const list = headerFilter.getList();

  await t.click(filterIconElement)
    .click(list.getItem(0).element)
    .click(buttons.nth(0));

  result[0] = await dataCell.element().innerText;

  await t.click(filterIconElement)
    .click(filterIconElement)
    .click(list.getItem(0).element)
    .click(list.getItem(1).element)
    .click(buttons.nth(0));

  result[1] = await dataCell.element().innerText;

  await t.expect(result[0]).eql('1000')
    .expect(result[1]).eql('5000');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      Name: 'A',
      Amount: 1000,
    },
    {
      Name: 'B',
      Amount: 5000,
    },
  ],
  headerFilter: {
    visible: true,
  },
  columns: ['Name', 'Amount'],
}));

test('Header filter should support string height and width', async (t) => {
  const dataGrid = new DataGrid('#container');
  const firstFilterIcon = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getFilterIcon();
  const thirdFilterIcon = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).getFilterIcon();

  await t
    .click(firstFilterIcon)
    .expect(new HeaderFilter().getContent().getStyleProperty('height'))
    .eql('400px')
    .expect(new HeaderFilter().getContent().getStyleProperty('width'))
    .eql('330px')
    .click(thirdFilterIcon)
    .expect(new HeaderFilter().getContent().getStyleProperty('height'))
    .eql('450px')
    .expect(new HeaderFilter().getContent().getStyleProperty('width'))
    .eql('380px');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [],
  columns: [
    'field1', 'field2', {
      dataField: 'field3',
      headerFilter: {
        height: '450px',
        width: '380px',
      },
    },
  ],
  width: 700,
  headerFilter: {
    visible: true,
    height: '400px',
    width: '330px',
  },
}));

test('DataGrid - Column Header filter does not properly work if the column caption contains double quotes (T1251768)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const filterIconElement = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getFilterIcon();

  await t
    .click(filterIconElement)
    .expect(await takeScreenshot('T1251768-header-filter-double-quotes.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(5, 1),
  headerFilter: {
    visible: true,
  },
  columns: [
    {
      dataField: 'Position',
      caption: '"סה"כ שולם"',
    },
    'FirstName',
  ],
}));
