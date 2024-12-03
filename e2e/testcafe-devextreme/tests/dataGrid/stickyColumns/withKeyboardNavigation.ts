import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

const navigateToNextCell = async (t, $headerCell) => {
  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect($headerCell.isFocused)
    .ok();
};

const navigateToPrevCell = async (t, $headerCell) => {
  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect($headerCell.isFocused)
    .ok();
};

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Fixed Columns - keyboard navigation`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Headers navigation by Tab key when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(headerRow.getHeaderCell(0).element);

  // assert
  await t
    .expect(headerRow.getHeaderCell(0).isFocused)
    .ok();

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(1));
  await navigateToNextCell(t, headerRow.getHeaderCell(2));
  await navigateToNextCell(t, headerRow.getHeaderCell(3));

  await takeScreenshot('fixed_columns_headers_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(4));
  await navigateToNextCell(t, headerRow.getHeaderCell(5));

  await takeScreenshot('fixed_columns_headers_navigation_by_tab_2.png', dataGrid.element);

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(6));

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 600,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));

safeSizeTest('Headers navigation by Shift and Tab keys when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(headerRow.getHeaderCell(6).element);

  // assert
  await t
    .expect(headerRow.getHeaderCell(6).isFocused)
    .ok();

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(5));

  await takeScreenshot('fixed_columns_headers_navigation_by_shift_and_tab_1.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(4));
  await navigateToPrevCell(t, headerRow.getHeaderCell(3));
  await navigateToPrevCell(t, headerRow.getHeaderCell(2));
  await navigateToPrevCell(t, headerRow.getHeaderCell(1));

  await takeScreenshot('fixed_columns_headers_navigation_by_shift_and_tab_2.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(0));

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 625,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));

safeSizeTest('Headers navigation by Tab key when there are fixed columns and adaptability is enabled', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(headerRow.getHeaderCell(0).element);

  // assert
  await t
    .expect(headerRow.getHeaderCell(0).isFocused)
    .ok();

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(1));
  await navigateToNextCell(t, headerRow.getHeaderCell(2));
  await navigateToNextCell(t, headerRow.getHeaderCell(3));

  await takeScreenshot('fixed_columns_and_adaptability_headers_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(4));
  await navigateToNextCell(t, headerRow.getHeaderCell(6));

  await takeScreenshot('fixed_columns_and_adaptability_headers_navigation_by_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 650,
  columnWidth: 150,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
    columns[5].hidingPriority = 0;
  },
}));

safeSizeTest('Headers navigation by Shift and Tab keys when there are fixed columns and adaptability is enabled', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const headerRow = headers.getHeaderRow(0);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(headerRow.getHeaderCell(6).element);

  // assert
  await t
    .expect(headerRow.getHeaderCell(6).isFocused)
    .ok();

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(4));

  await takeScreenshot('fixed_columns_and_adaptability_headers_navigation_by_shift_and_tab_1.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(3));

  await takeScreenshot('fixed_columns_and_adaptability_headers_navigation_by_shift_and_tab_2.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(2));
  await navigateToPrevCell(t, headerRow.getHeaderCell(1));
  await navigateToPrevCell(t, headerRow.getHeaderCell(0));

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 650,
  columnWidth: 150,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
    columns[5].hidingPriority = 0;
  },
}));

safeSizeTest('Band headers navigation by Tab key when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const firstHeaderRow = headers.getHeaderRow(0);
  const secondHeaderRow = headers.getHeaderRow(1);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(firstHeaderRow.getHeaderCell(0).element);

  // assert
  await t
    .expect(firstHeaderRow.getHeaderCell(0).isFocused)
    .ok();

  // act
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(1));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(2));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(3));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(4));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(5));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(6));

  await takeScreenshot('fixed_columns_band_headers_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, secondHeaderRow.getHeaderCell(0));

  await takeScreenshot('fixed_columns_band_headers_navigation_by_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 600,
  customizeColumns(columns) {
    columns[3] = {
      caption: 'Band columns',
      columns: [{ dataField: 'CustomerStoreCity', width: 150 }],
    };
  },
}));

safeSizeTest('Band headers navigation by Shift and Tab key when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const firstHeaderRow = headers.getHeaderRow(0);
  const secondHeaderRow = headers.getHeaderRow(1);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(dataGrid.getDataCell(0, 0).element);
  await navigateToPrevCell(t, secondHeaderRow.getHeaderCell(0));

  await takeScreenshot('fixed_columns_band_headers_navigation_by_shift_and_tab_1.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(6));
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(5));
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(4));
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(3));
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(2));
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(1));

  await takeScreenshot('fixed_columns_band_headers_navigation_by_shift_and_tab_2.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, firstHeaderRow.getHeaderCell(0));

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 550,
  columnWidth: 200,
  customizeColumns(columns) {
    columns[5] = {
      caption: 'Band columns',
      columns: [{ dataField: 'SaleAmount', width: 150 }],
    };
  },
}));

safeSizeTest('Band headers navigation by Tab key when there are fixed and command columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const firstHeaderRow = headers.getHeaderRow(0);
  const secondHeaderRow = headers.getHeaderRow(1);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(firstHeaderRow.getHeaderCell(0).element);

  // assert
  await t
    .expect(firstHeaderRow.getHeaderCell(0).isFocused)
    .ok();

  // act
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(1));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(2));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(3));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(4));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(5));
  await navigateToNextCell(t, firstHeaderRow.getHeaderCell(6));

  await takeScreenshot('fixed_and_command_columns_band_headers_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, secondHeaderRow.getHeaderCell(0));

  await takeScreenshot('fixed_and_command_columns_band_headers_navigation_by_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 600,
  editing: {
    allowUpdating: true,
  },
  customizeColumns(columns) {
    columns[3] = {
      caption: 'Band columns',
      columns: [{ dataField: 'CustomerStoreCity', width: 150 }],
    };
  },
}));

safeSizeTest('Data cells navigation by Tab key when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(dataGrid.getDataCell(0, 0).element);
  await navigateToNextCell(t, dataGrid.getDataCell(0, 1));
  await navigateToNextCell(t, dataGrid.getDataCell(0, 2));
  await navigateToNextCell(t, dataGrid.getDataCell(0, 3));

  await takeScreenshot('fixed_columns_data_cells_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, dataGrid.getDataCell(0, 4));
  await navigateToNextCell(t, dataGrid.getDataCell(0, 5));

  await takeScreenshot('fixed_columns_data_cells_navigation_by_tab_2.png', dataGrid.element);

  // act
  await navigateToNextCell(t, dataGrid.getDataCell(0, 6));

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 600,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));

safeSizeTest('Data cells navigation by Shift and Tab keys when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.expect(dataGrid.isReady()).ok();

  // act
  await t.click(dataGrid.getDataCell(0, 6).element);
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 5));

  await takeScreenshot('fixed_columns_data_cells_navigation_by_shift_and_tab_1.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 4));
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 3));
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 2));
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 1));

  await takeScreenshot('fixed_columns_data_cells_navigation_by_shift_and_tab_2.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 0));

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 625,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));
