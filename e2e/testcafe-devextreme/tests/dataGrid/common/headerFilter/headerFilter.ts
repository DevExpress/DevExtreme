import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getData } from '../../helpers/generateDataSourceData';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Header Filter`
  .page(url(__dirname, '../../../container.html'));

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
  await testScreenshot(t, takeScreenshot, 'header-filter-icon-clear-filter.png', { element: dataGrid.element });
  await t
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
  // @ts-expect-error ts-error
  await dataGrid.scrollBy(t, { x: 100 });
  await t.click(filterIconElement);

  // assert
  await testScreenshot(t, takeScreenshot, 'grid-header-filter-popup-T1156848.png', { element: '#container' });
  await t
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
    .click(filterIconElement);
  // act
  await testScreenshot(t, takeScreenshot, 'header-filter-popup.png', { element: dataGrid.element });

  // assert
  await t
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

  await t.click(filterIconElement);

  await testScreenshot(t, takeScreenshot, 'T1251768-header-filter-double-quotes.png', { element: dataGrid.element });
  await t
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

test('Data should be filtered if True is selected in the header filter when case sensitive is enabled (T1273020)', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
  const filterIconElement = headerCell.getFilterIcon();
  const headerFilter = new HeaderFilter();
  const buttons = headerFilter.getButtons();
  const list = headerFilter.getList();

  // act
  await t
    .click(filterIconElement)
    .click(list.getItem(0).element) // Select first item with value 'true'
    .click(buttons.nth(0)); // Click OK

  await testScreenshot(t, takeScreenshot, 'T1273020-header-filter-with-case-sensitive-1.png', { element: dataGrid.element });

  // act
  await t
    .click(filterIconElement)
    .click(list.getItem(0).element) // Deselect first item with value 'true'
    .click(list.getItem(1).element) // Select second item with value 'True'
    .click(buttons.nth(0)); // Click OK

  await testScreenshot(t, takeScreenshot, 'T1273020-header-filter-with-case-sensitive-2.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: {
    store: [
      { ID: 1, text: 'true' },
      { ID: 2, text: 'True' },
    ],
    langParams: {
      locale: 'en-US',
      collatorOptions: {
        sensitivity: 'case',
      },
    },
  },
  keyExpr: 'ID',
  showBorders: true,
  headerFilter: { visible: true },
}));

test('Header filter search input loses focus on first key in datetime columns (T1284663)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const headerCell = dataGrid.getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();
  const headerFilter = new HeaderFilter();

  await t
    .click(filterIconElement)
    .pressKey('1');

  await t.wait(1500);

  const searchInput = headerFilter.getSearchInput();

  await t
    .expect(searchInput.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    id: 1,
    DeliveryDate: '2017/04/13 9:00',
  }],
  headerFilter: {
    visible: true,
  },
  keyExpr: 'id',
  columns: [{
    dataField: 'DeliveryDate',
    dataType: 'date',
    headerFilter: {
      dataSource: [
        { text: 'March 11, 2025', value: '2025-03-11T00:00:00' },
        { text: 'March 2, 2025', value: '2025-03-02T00:00:00' },
        { text: 'February 3, 2025', value: '2025-02-03T00:00:00' },
      ],
      search: { enabled: true },
    },
  }],
}));

test('DataGrid – Header filters show "No data to display" when "not and" or "not or" operations are used in the filter panel (T1291737)', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const headerFilterButton = dataGrid.getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0)
    .getFilterIcon();
  const headerFilter = new HeaderFilter();
  const listCount = headerFilter.getList().getItems();

  await dataGrid.isReady();
  await t.click(headerFilterButton);

  await t
    .expect(listCount.count)
    .eql(9);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(10, 1),
  keyExpr: 'field_0',
  filterValue: [
    '!',
    [['field_0', '=', 'val_0_0']],
  ],
  filterPanel: {
    visible: true,
  },
  headerFilter: {
    visible: true,
  },
}));
