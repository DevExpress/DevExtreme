import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Export button`
  .page(url(__dirname, '../../container.html'));

test('allowExportSelectedData: false, menu: false', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'grid-export-one-button.png', { element: dataGrid.getHeaderPanel().element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, value: 2 }],
  export: {
    enabled: true,
  },
}));

test('allowExportSelectedData: false, menu: false, PDF', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'grid-export-one-button-pdf.png', { element: dataGrid.getHeaderPanel().element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, value: 2 }],
  export: {
    enabled: true,
    formats: ['pdf'],
  },
}));

test('allowExportSelectedData: true, menu: false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t.expect(dataGrid.isReady()).ok();

  await t.click(headerPanel.getExportButton().element);

  await testScreenshot(t, takeScreenshot, 'grid-export-dropdown-button.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, value: 2 }],
  height: 300,
  export: {
    enabled: true,
    allowExportSelectedData: true,
    formats: ['xlsx', 'pdf', 'csv'],
  },
}));

test('allowExportSelectedData: false, menu: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t.expect(dataGrid.isReady()).ok();

  await t.click(headerPanel.getDropDownMenuButton());

  await testScreenshot(t, takeScreenshot, 'grid-export-one-button-in-menu.png', { element: 'html' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, value: 2 }],
  export: {
    enabled: true,
  },
  width: 30,
  onToolbarPreparing(e): void {
    e.toolbarOptions.allowKeyboardNavigation = false;
  },
}));

test('allowExportSelectedData: true, menu: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t.expect(dataGrid.isReady()).ok();

  await t.click(headerPanel.getDropDownMenuButton());

  await testScreenshot(t, takeScreenshot, 'grid-export-dropdown-button-in-menu.png', { element: 'html' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, value: 2 }],
  export: {
    enabled: true,
    allowExportSelectedData: true,
    formats: ['xlsx', 'pdf'],
  },
  width: 30,
  onToolbarPreparing(e): void {
    e.toolbarOptions.allowKeyboardNavigation = false;
  },
}));

test.meta({ browserSize: [800, 800] })('Export is disabled when no data columns is in grid header, menu: false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');
  await t.expect(dataGrid.isReady()).ok();

  await testScreenshot(t, takeScreenshot, 'disabled-export_when-no-columns-visible.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ value: 1 }],
  groupPanel: {
    visible: true,
  },
  columns: [
    { dataField: 'value', groupIndex: 0 },
  ],
  export: {
    enabled: true,
    allowExportSelectedData: true,
    formats: ['xlsx', 'pdf'],
  },
}));

test.meta({ browserSize: [800, 800] })('Export is disabled when no data columns is in grid header, menu: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t.expect(dataGrid.isReady()).ok();

  await t.click(headerPanel.getDropDownMenuButton());

  await testScreenshot(t, takeScreenshot, 'disabled-export-in-menu_when-no-columns-visible.png', { element: 'html' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ value: 1 }],
  columns: [
    { dataField: 'value', visible: false },
  ],
  columnChooser: {
    enabled: true,
  },
  toolbar: {
    items: [
      { name: 'exportButton', locateInMenu: 'always' },
      { name: 'columnChooserButton', locateInMenu: 'always' },
    ],
  },
  export: {
    enabled: true,
    allowExportSelectedData: true,
    formats: ['xlsx', 'pdf'],
  },
}));
