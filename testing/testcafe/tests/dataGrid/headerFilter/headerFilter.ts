import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';
import HeaderFilter from '../../../model/dataGrid/headers/headerFilter';
import { getData } from '../helpers/generateDataSourceData';

fixture.disablePageReloads`Header Filter`
  .page(url(__dirname, '../../container.html'));

const GRID_CONTAINER = '#container';

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

test('Header filter should be applied correctly with the enabled filterSyncEnabled option (T1168739)', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const customColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
  const headerFilter = new HeaderFilter();
  const buttons = headerFilter.getButtons();
  const list = headerFilter.getList();

  await t
    // act
    .click(customColumnHeaderCell.getFilterIcon())
    .click(list.selectAll.element)
    .click(list.getItem(1).element)
    .click(buttons.nth(0))

    // assert
    .expect(dataGrid.getDataCell(0, 1).element.innerText)
    .eql('Yes')

    .expect(dataGrid.getDataCell(1, 1).element.innerText)
    .eql('Yes');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    text: 'Hello World',
  }, {
    ID: 2,
    text: 'Hello',
  }, {
    ID: 3,
    text: 'World',
  }],
  width: 300,
  keyExpr: 'ID',
  filterSyncEnabled: true,
  headerFilter: {
    visible: true,
  },
  columns: [{
    dataField: 'text',
    caption: 'Invoice Number',
    width: 140,
  }, {
    name: 'Custom',
    caption: 'custom',
    allowHeaderFiltering: true,
    calculateCellValue: (row) => (row.text.includes('World') ? 'Yes' : 'No'),
    alignment: 'right',
    dataType: 'string',
    calculateFilterExpression(filterValue) {
      const filter = ['text', 'contains', 'World'];
      return filterValue ? filter : ['!', filter];
    },
    lookup: {
      dataSource: [{
        text: 'Yes',
        value: 'Yes',
      }, {
        text: 'No',
        value: 'No',
      }],
      valueExpr: 'value',
      displayExpr: 'text',
    },
    headerFilter: {
      dataSource: [{
        text: 'Yes',
        value: true,
      }, {
        text: 'No',
        value: false,
      }],
      allowSearch: false,
    },
  }],
}));
