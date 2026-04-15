import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Grouping API - calculateGroupValue runtime changes`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

test(
  'One group: should expand grouped section after calculateGroupValue update',
  async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();
    await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .notOk()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(1)
      .expect(dataGrid.dataRows.count)
      .eql(0);

    await t.click(dataGrid
      .getGroupRow(0)
      .getExpandCell());

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .ok()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(1)
      .expect(dataGrid.dataRows.count)
      .eql(4);
  },
).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, A: 'A_0', group: 'A' },
    { id: 1, A: 'A_1', group: 'A' },
    { id: 2, A: 'A_2', group: 'B' },
    { id: 3, A: 'A_3', group: 'B' },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'group', groupIndex: 0 },
    'A',
  ],
  grouping: { autoExpandAll: false },
}));

// NOTE: Intersection with "column configuration from first data source item" feature
// Because one of first item's fields is null and different logic is applied
test(
  'One group: should expand grouped section after calculateGroupValue update if first record contains null value',
  async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();
    await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .notOk()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(1)
      .expect(dataGrid.dataRows.count)
      .eql(0);

    await t.click(dataGrid
      .getGroupRow(0)
      .getExpandCell());

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .ok()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(1)
      .expect(dataGrid.dataRows.count)
      .eql(4);
  },
).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, A: 'A_0', group: 'A' },
    { id: 1, A: 'A_1', group: 'A' },
    { id: 2, A: 'A_2', group: 'B' },
    { id: 3, A: 'A_3', group: 'B' },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'group', groupIndex: 0 },
    'A',
  ],
  grouping: { autoExpandAll: false },
}));

test(
  'Multiple groups: should expand grouped section after calculateGroupValue update',
  async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();
    await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .notOk()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(1)
      .expect(dataGrid.dataRows.count)
      .eql(0);

    await t.click(dataGrid
      .getGroupRow(0)
      .getExpandCell());

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .ok()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(5)
      .expect(dataGrid.dataRows.count)
      .eql(0);
  },
).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      id: 0, A: 'A_0', B: 'B_0', group: 'A',
    },
    {
      id: 1, A: 'A_1', B: 'B_1', group: 'A',
    },
    {
      id: 2, A: 'A_2', B: 'B_2', group: 'B',
    },
    {
      id: 3, A: 'A_3', B: 'B_3', group: 'B',
    },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'group', groupIndex: 0 },
    { dataField: 'A', groupIndex: 1 },
    'B',
  ],
  grouping: { autoExpandAll: false },
}));

// NOTE: Intersection with "column configuration from first data source item" feature
// Because one of first item's fields is null and different logic is applied
test(
  'Multiple groups: should expand grouped section after calculateGroupValue update if first record contains null value [T1281192]',
  async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();
    await dataGrid.apiColumnOption('group', 'calculateGroupValue', () => 'ALL');

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .notOk()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(1)
      .expect(dataGrid.dataRows.count)
      .eql(0);

    await t.click(dataGrid
      .getGroupRow(0)
      .getExpandCell());

    await t
      .expect(await dataGrid.getGroupRow(0).isExpanded)
      .ok()
      .expect(dataGrid.getGroupRowSelector().count)
      .eql(5)
      .expect(dataGrid.dataRows.count)
      .eql(0);
  },
).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      id: 0, A: 'A_0', B: null, group: 'A',
    },
    {
      id: 1, A: 'A_1', B: 'B_1', group: 'A',
    },
    {
      id: 2, A: 'A_2', B: 'B_2', group: 'B',
    },
    {
      id: 3, A: 'A_3', B: 'B_3', group: 'B',
    },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'group', groupIndex: 0 },
    { dataField: 'A', groupIndex: 1 },
    'B',
  ],
  grouping: { autoExpandAll: false },
}));

test('Should not reset sorting parameters after calculateGroupValue update [T1298901]', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t
    .expect(await dataGrid.apiColumnOption('A', 'sortOrder'))
    .eql('desc')
    .expect(await dataGrid.apiColumnOption('A', 'sortIndex'))
    .eql(0);

  await dataGrid.apiColumnOption('A', 'calculateGroupValue', () => 'ALL');

  await t
    .expect(await dataGrid.apiColumnOption('A', 'sortOrder'))
    .eql('desc')
    .expect(await dataGrid.apiColumnOption('A', 'sortIndex'))
    .eql(0);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, A: 0, B: 'B_0' },
    { id: 1, A: 1, B: 'B_1' },
    { id: 2, A: 2, B: 'B_2' },
    { id: 3, A: 3, B: 'B_3' },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'A', sortOrder: 'desc' },
    'B',
  ],
  sorting: { mode: 'single' },
}));

test('Should not reset multiple sorting parameters after calculateGroupValue update [T1298901]', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  await t
    .expect(dataGrid.isReady())
    .ok();

  await t
    .expect(await dataGrid.apiColumnOption('A', 'sortOrder'))
    .eql('desc')
    .expect(await dataGrid.apiColumnOption('A', 'sortIndex'))
    .eql(1)
    .expect(await dataGrid.apiColumnOption('B', 'sortOrder'))
    .eql('asc')
    .expect(await dataGrid.apiColumnOption('B', 'sortIndex'))
    .eql(0);

  await dataGrid.apiColumnOption('A', 'calculateGroupValue', () => 'ALL');

  await t
    .expect(await dataGrid.apiColumnOption('A', 'sortOrder'))
    .eql('desc')
    .expect(await dataGrid.apiColumnOption('A', 'sortIndex'))
    .eql(1)
    .expect(await dataGrid.apiColumnOption('B', 'sortOrder'))
    .eql('asc')
    .expect(await dataGrid.apiColumnOption('B', 'sortIndex'))
    .eql(0);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { id: 0, A: 0, B: 'B_0' },
    { id: 1, A: 1, B: 'B_1' },
    { id: 2, A: 2, B: 'B_2' },
    { id: 3, A: 3, B: 'B_3' },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'A', sortOrder: 'desc', sortIndex: 1 },
    { dataField: 'B', sortOrder: 'asc', sortIndex: 0 },
  ],
  sorting: { mode: 'multiple' },
}));
