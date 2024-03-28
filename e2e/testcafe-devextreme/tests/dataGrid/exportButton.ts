import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture.disablePageReloads`Export button`
  .page(url(__dirname, '../container.html'));

test('allowExportSelectedData: false, menu: false', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('grid-export-one-button.png', dataGrid.getHeaderPanel().element))
    .ok()
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

  await t
    .expect(await takeScreenshot('grid-export-one-button-pdf.png', dataGrid.getHeaderPanel().element))
    .ok()
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

  await t.click(headerPanel.getExportButton().element);

  await t
    .expect(await takeScreenshot('grid-export-dropdown-button.png', dataGrid.element))
    .ok()
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

  await t.click(headerPanel.getDropDownMenuButton());

  await t
    .expect(await takeScreenshot('grid-export-one-button-in-menu.png', 'html'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1, value: 2 }],
  export: {
    enabled: true,
  },
  width: 30,
}));

test('allowExportSelectedData: true, menu: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t.click(headerPanel.getDropDownMenuButton());

  await t
    .expect(await takeScreenshot('grid-export-dropdown-button-in-menu.png', 'html'))
    .ok()
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
}));

safeSizeTest('Export is disabled when no data columns is in grid header, menu: false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');

  await t
    .expect(await takeScreenshot('disabled-export_when-no-columns-visible.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxDataGrid', {
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

/* safeSizeTest */test.skip('Export is disabled when no data columns is in grid header, menu: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  await t.click(headerPanel.getDropDownMenuButton());

  await t
    .expect(await takeScreenshot('disabled-export-in-menu_when-no-columns-visible.png', 'html'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}/* , [800, 800] */).before(async () => createWidget('dxDataGrid', {
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
