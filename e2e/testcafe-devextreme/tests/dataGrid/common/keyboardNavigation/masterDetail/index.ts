import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { gridOptions } from './options';

fixture
  .disablePageReloads`Keyboard Navigation - screenshots`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test('Focus goes inside master detail on tab', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(
    dataGrid.getDataRow(0).getCommandCell(0).element,
  );

  const innerDataGrid = new DataGrid(dataGrid.getMasterRow(0).element.find('.dx-datagrid').parent());

  await t.click(
    dataGrid.getDataCell(0, 4).element,
  )
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', gridOptions));

test('Focus goes inside previous master detail on shift+tab', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(
    dataGrid.getDataRow(0).getCommandCell(0).element,
  );

  const innerDataGrid = new DataGrid(dataGrid.getMasterRow(0).element.find('.dx-datagrid').parent());

  await t.click(
    // tmp 'nth' dataGrid's model includes inner grid's rows
    dataGrid.getDataCell(1, 1).element.nth(1),
  )
    .pressKey('shift+tab')
    .pressKey('shift+tab');

  await t
    .expect(innerDataGrid.getDataCell(0, 0).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', gridOptions));

test('Focus goes on master detail using arrow keys', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(
    dataGrid.getDataRow(0).getCommandCell(0).element,
  );

  await t.click(
    dataGrid.getDataCell(0, 1).element,
  );

  await t
    .pressKey('down')
    .expect(dataGrid.getMasterRow(0).getCell().focused)
    .ok();

  await t
    .pressKey('down')
    .expect(dataGrid.getDataRow(1).getCommandCell(0).element.focused)
    .ok();

  await t
    .pressKey('up')
    .expect(dataGrid.getMasterRow(0).getCell().focused)
    .ok();

  await t
    .pressKey('up')
    .expect(dataGrid.getDataRow(0).getCommandCell(0).element.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', gridOptions));

test('Focus goes inside master detail on enter & goes out on esc', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(
    dataGrid.getDataRow(0).getCommandCell(0).element,
  );

  const innerDataGrid = new DataGrid(dataGrid.getMasterRow(0).element.find('.dx-datagrid').parent());

  await t.click(
    dataGrid.getDataCell(0, 1).element,
  );

  await t
    .pressKey('down')
    .expect(dataGrid.getMasterRow(0).getCell().focused)
    .ok();

  await t
    .pressKey('enter')
    .expect(innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).isFocused)
    .ok();

  await t
    .pressKey('esc')
    .expect(dataGrid.getMasterRow(0).getCell().focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', gridOptions));

test('up/down arrows works only on master detail, not on its content', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t.click(
    dataGrid.getDataRow(0).getCommandCell(0).element,
  );

  const innerDataGrid = new DataGrid(dataGrid.getMasterRow(0).element.find('.dx-datagrid').parent());

  await t.click(
    dataGrid.getDataCell(0, 1).element,
  );

  await t
    .pressKey('down')
    .expect(dataGrid.getMasterRow(0).getCell().focused)
    .ok();

  await t
    .pressKey('enter')
    .expect(innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).isFocused)
    .ok();

  await t
    .pressKey('up')
    .expect(innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).isFocused)
    .ok();
  await t
    .pressKey('down')
    .expect(innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', gridOptions));
