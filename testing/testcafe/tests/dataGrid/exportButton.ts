import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

fixture`Export button`
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
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click('.dx-datagrid-export-button');

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
    formats: ['xlsx', 'pdf'],
  },
}));

test('allowExportSelectedData: false, menu: true', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click('.dx-toolbar-menu-container > .dx-button');

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

  await t.click('.dx-toolbar-menu-container > .dx-button');

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
