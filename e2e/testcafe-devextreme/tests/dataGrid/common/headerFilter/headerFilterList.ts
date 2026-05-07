import DataGrid from 'devextreme-testcafe-models/dataGrid';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Header Filter - dxList integration`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

const openHeaderFilterAndGetList = async (t: TestController, dataGrid: DataGrid) => {
  const headerCell = dataGrid.getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();
  const headerFilter = new HeaderFilter();
  const list = headerFilter.getList();
  const firstListItem = list.getItem(0);
  const secondListItem = list.getItem(1);

  await t
    .click(filterIconElement);

  return { list, firstListItem, secondListItem };
};

test('Should has unchecked "Select all" checkbox state if no values is selected', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('unchecked')
    .expect(firstListItem.isSelected)
    .notOk()
    .expect(secondListItem.isSelected)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [] },
  ],
  headerFilter: { visible: true },
}));

test('Should has checked "Select all" checkbox state if all values selected', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('checked')
    .expect(firstListItem.isSelected)
    .ok()
    .expect(secondListItem.isSelected)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterType: 'exclude', filterValues: [] },
  ],
  headerFilter: { visible: true },
}));

test('Should has indeterminate "Select all" checkbox state if only part of values selected', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('indeterminate')
    .expect(firstListItem.isSelected)
    .ok()
    .expect(secondListItem.isSelected)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [0] },
  ],
  headerFilter: { visible: true },
}));

test('Should has indeterminate "Select all" checkbox state if part of values excluded', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('indeterminate')
    .expect(firstListItem.isSelected)
    .ok()
    .expect(secondListItem.isSelected)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterType: 'exclude', filterValues: [1] },
  ],
  headerFilter: { visible: true },
}));

test('Should has indeterminate "Select all" checkbox state if has not selected value on not first page [T1284200]', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('indeterminate');

  const firstPageItemCount = await list.getItems().count;

  for (let idx = 0; idx < firstPageItemCount; idx += 1) {
    await t
      .expect(list.getItem(idx).isSelected)
      .ok();
  }
}).before(async () => createWidget('dxDataGrid', {
  dataSource: new Array(100)
    .map((_, idx) => ({ id: idx })),
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterType: 'exclude', filterValues: [89] },
  ],
  headerFilter: { visible: true },
}));

test('Should select all values after unchecked "Select all" click', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(list.selectAll.checkBox.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('checked')
    .expect(firstListItem.isSelected)
    .ok()
    .expect(secondListItem.isSelected)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [] },
  ],
  headerFilter: { visible: true },
}));

test('Should unselect all values after checked "Select all" click', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(list.selectAll.checkBox.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('unchecked')
    .expect(firstListItem.isSelected)
    .notOk()
    .expect(secondListItem.isSelected)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterType: 'exclude', filterValues: [] },
  ],
  headerFilter: { visible: true },
}));

test('Should select all values after indeterminate "Select all" click', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(list.selectAll.checkBox.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('checked')
    .expect(firstListItem.isSelected)
    .ok()
    .expect(secondListItem.isSelected)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [0] },
  ],
  headerFilter: { visible: true },
}));

test('Should change "Select all" to checked after selecting all values [T1293295]', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(firstListItem.element)
    .click(secondListItem.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('checked')
    .expect(firstListItem.isSelected)
    .ok()
    .expect(secondListItem.isSelected)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [] },
  ],
  headerFilter: { visible: true },
}));

test('Should change "Select all" to unchecked after unselecting all values', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(firstListItem.element)
    .click(secondListItem.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('unchecked')
    .expect(firstListItem.isSelected)
    .notOk()
    .expect(secondListItem.isSelected)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [0, 1] },
  ],
  headerFilter: { visible: true },
}));

test('Should change "Select all" to unchecked after unselecting all values with exclude filter', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(firstListItem.element)
    .click(secondListItem.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('unchecked')
    .expect(firstListItem.isSelected)
    .notOk()
    .expect(secondListItem.isSelected)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterType: 'exclude', filterValues: [] },
  ],
  headerFilter: { visible: true },
}));

test('Should change "Select all" to indeterminate after unselecting one value', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(t, dataGrid);

  await t
    .click(firstListItem.element);

  await t
    .expect(await list.selectAll.checkBox.getCheckBoxState())
    .eql('indeterminate')
    .expect(firstListItem.isSelected)
    .notOk()
    .expect(secondListItem.isSelected)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0 },
    { id: 1 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', filterValues: [0, 1] },
  ],
  headerFilter: { visible: true },
}));
