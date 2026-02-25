import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { makeRowsViewTemplatesAsync } from '../../helpers/asyncTemplates';
import { testScreenshot } from '../../../../helpers/themeUtils';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`FixedColumns`
  .page(url(__dirname, '../../../container.html'));

// T1148937
test('Hovering over a row should work correctly when there is a fixed column and a column with a cellTemplate (React)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const firstDataRow = dataGrid.getDataRow(0);
  const firstFixedDataRow = dataGrid.getFixedDataRow(0);
  const secondDataRow = dataGrid.getDataRow(1);
  const secondFixedDataRow = dataGrid.getFixedDataRow(1);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // act
  await t.hover(firstDataRow.element);

  // assert
  await testScreenshot(t, takeScreenshot, 'T1148937-grid-hover-row-1.png', { element: dataGrid.element });

  await t
    .expect(firstDataRow.isHovered)
    .ok()
    .expect(firstFixedDataRow.isHovered)
    .ok();

  // act
  await t.hover(secondFixedDataRow.element);

  // assert
  await testScreenshot(t, takeScreenshot, 'T1148937-grid-hover-row-2.png', { element: dataGrid.element });

  await t
    .expect(secondDataRow.isHovered)
    .ok()
    .expect(secondFixedDataRow.isHovered)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
    keyExpr: 'id',
    renderAsync: false,
    hoverStateEnabled: true,
    templatesRenderAsynchronously: true,
    columns: [
      { dataField: 'id', fixed: true },
      { dataField: 'text', cellTemplate: '#test' },
    ],
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
    showBorders: true,
  });

  await t.wait(100);

  // simulating async rendering in React
  await ClientFunction(() => {
    const dataGrid = ($('#container') as any).dxDataGrid('instance');

    // eslint-disable-next-line no-underscore-dangle
    dataGrid.getView('rowsView')._templatesCache = {};

    // eslint-disable-next-line no-underscore-dangle
    dataGrid._getTemplate = () => ({
      render(options) {
        setTimeout(() => {
          ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
          options.deferred?.resolve();
        }, 100);
      },
    });

    dataGrid.repaint();
  })();

  await t.wait(200);
});

// T1177143
test.meta({ browserSize: [800, 800] })('Fixed to the right columns should appear when any column has undefined or 0 width', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await testScreenshot(t, takeScreenshot, 'T1177143-right-fixed-column-with-no-width-columns-1.png', { element: dataGrid.element });

  await dataGrid.scrollTo(t, { x: 5000 });

  await testScreenshot(t, takeScreenshot, 'T1177143-right-fixed-column-with-no-width-columns-2.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  columnAutoWidth: false,
  dataSource: [{
    Column1: 'a',
    Column2: 'b',
    Column3: 'b',
    Column4: 'c',
    Column5: 'd',
    Column6: 'e',
    Column7: 'f',
    Column8: 'g',
  }],
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
  columns: [
    {
      dataField: 'Column1', fixed: true, fixedPosition: 'right', width: 100,
    },
    { dataField: 'Column2', width: undefined },
    { dataField: 'Column3', width: 0 },
    { dataField: 'Column4', width: 220 },
    { dataField: 'Column5', width: 240 },
    { dataField: 'Column6', width: 240 },
    { dataField: 'Column7', width: 0 },
    { dataField: 'Column8', width: 270 },
  ],
}));

// T1180834
test('Hovering over a row should work correctly after scrolling when there is a fixed column with a cellTemplate and virtual scrolling is used (React)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  let dataRow = dataGrid.getDataRow(1);
  let fixedDataRow = dataGrid.getDataRow(1);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.hover(dataRow.element);

  // assert
  await testScreenshot(t, takeScreenshot, 'T1180834-grid-hover-row-after-scrolling-1.png', { element: dataGrid.element });

  await t
    .expect(dataRow.isHovered)
    .ok()
    .expect(fixedDataRow.isHovered)
    .ok();

  // act
  await dataGrid.scrollTo(t, { y: 300 });
  dataRow = dataGrid.getDataRow(10);
  await t.hover(dataRow.element);

  // assert
  fixedDataRow = dataGrid.getDataRow(10);

  await testScreenshot(t, takeScreenshot, 'T1180834-grid-hover-row-after-scrolling-2.png', { element: dataGrid.element });

  await t
    .expect(dataRow.isHovered)
    .ok()
    .expect(fixedDataRow.isHovered)
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...new Array(60)].map((_, index) => ({ id: index, text1: `item1 ${index}`, text2: `item2 ${index}` })),
    height: 500,
    keyExpr: 'id',
    renderAsync: false,
    hoverStateEnabled: true,
    templatesRenderAsynchronously: true,
    columns: [
      'id',
      {
        dataField: 'text1',
        cellTemplate: (_, { value }) => ($('<div/>') as any).text(value),
        fixed: true,
      },
      'text2',
    ],
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
    paging: {
      enabled: false,
    },
    scrolling: {
      useNative: false,
      showScrollbar: 'never',
      rowRenderingMode: 'virtual',
    },
    showBorders: true,
  });

  await makeRowsViewTemplatesAsync(DATA_GRID_SELECTOR, 100);
});

// T1193153
test.meta({ browserSize: [800, 800] })('The grid layout should be correct after resizing the window when there are fixed and band columns', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await testScreenshot(t, takeScreenshot, 'T1193153-layout-with-fixed-and-band-columns-1.png', { element: dataGrid.element });
  await t.resizeWindow(400, 400);
  await testScreenshot(t, takeScreenshot, 'T1193153-layout-with-fixed-and-band-columns-2.png', { element: dataGrid.element });

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  columnAutoWidth: true,
  dataSource: [{}],
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
  columns: [{
    caption: 'Fixed column',
    fixed: true,
    columns: [{
      caption: 'Banded column',
      width: 150,
    }],
  }, {
    caption: 'Default column',
  }, {
    type: 'buttons',
    width: 50,
  }],
}));

// T1322380
test('The grid layout should be correct after unfixing a column via the context menu', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const contextMenu = dataGrid.getContextMenu();

  await t.expect(dataGrid.isReady()).ok();

  // act: fix the first 4 columns (Employee, Position, Address, City)
  await ClientFunction(() => {
    const grid = ($(DATA_GRID_SELECTOR) as any).dxDataGrid('instance');
    const columns = grid.option('columns');
    const newColumns = [
      ...columns.slice(0, 4).map((column) => ({ ...column, fixed: true, fixedPosition: 'left' })),
      ...columns.slice(4),
    ];
    grid.option('columns', newColumns);
  }, { dependencies: { DATA_GRID_SELECTOR } })();

  // act: unfix City column via context menu
  const cityHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
  await t
    .rightClick(cityHeader.element)
    .click(contextMenu.getItemByText('Unfix'));

  // assert
  await testScreenshot(t, takeScreenshot, 'T1322380-unfix-column-via-context-menu.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    FirstName: 'John',
    LastName: 'Heart',
    Position: 'CEO',
    BirthDate: '1964/03/16',
    HireDate: '1995/01/15',
    Title: 'Mr.',
    Address: '351 S Hill St.',
    City: 'Los Angeles',
    State: 'California',
    Zipcode: 90013,
    Email: 'jheart@dx-email.com',
    Skype: 'jheartDXskype',
    HomePhone: '(213) 555-9208',
    Department: 'Management',
    MobilePhone: '(213) 555-9392',
  }, {
    ID: 2,
    FirstName: 'Olivia',
    LastName: 'Peyton',
    Position: 'Sales Assistant',
    BirthDate: '1981/06/03',
    HireDate: '2012/05/14',
    Title: 'Mrs.',
    Address: '807 W Paseo Del Mar',
    City: 'Los Angeles',
    State: 'California',
    Zipcode: 90036,
    Email: 'oliviap@dx-email.com',
    Skype: 'oliviapDXskype',
    HomePhone: '(310) 555-2728',
    Department: 'Human Resources',
    MobilePhone: '(818) 555-2387',
  }, {
    ID: 3,
    FirstName: 'Robert',
    LastName: 'Reagan',
    Position: 'CMO',
    BirthDate: '1974/09/07',
    HireDate: '2002/11/08',
    Title: 'Mr.',
    Address: '4 Westmoreland Pl.',
    City: 'Bentonville',
    State: 'Arkansas',
    Zipcode: 91103,
    Email: 'robertr@dx-email.com',
    Skype: 'robertrDXskype',
    HomePhone: '(818) 555-2438',
    Department: 'Management',
    MobilePhone: '(818) 555-2387',
  }, {
    ID: 4,
    FirstName: 'Greta',
    LastName: 'Sims',
    Position: 'HR Manager',
    BirthDate: '1977/11/22',
    HireDate: '1998/04/23',
    Title: 'Ms.',
    Address: '1700 S Grandview Dr.',
    State: 'Georgia',
    City: 'Atlanta',
    Zipcode: 91803,
    Email: 'gretas@dx-email.com',
    Skype: 'gretasDXskype',
    HomePhone: '(818) 555-0976',
    Department: 'Human Resources',
    MobilePhone: '(818) 555-6546',
  }],
  keyExpr: 'ID',
  columnAutoWidth: true,
  showBorders: true,
  repaintChangesOnly: true,
  columnFixing: { enabled: true },
  columns: [
    {
      caption: 'Employee',
      calculateCellValue(data) {
        return [data.Title, data.FirstName, data.LastName].join(' ');
      },
    },
    { dataField: 'Position', alignment: 'right' },
    { dataField: 'Address' },
    { dataField: 'City' },
    { dataField: 'Zipcode' },
    { dataField: 'State' },
    { dataField: 'Department' },
    { dataField: 'BirthDate', dataType: 'date' },
    { dataField: 'HireDate', dataType: 'date' },
    { dataField: 'HomePhone' },
    { dataField: 'MobilePhone' },
    { dataField: 'Email' },
    { dataField: 'Skype' },
  ],
}));
