import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

// The new value is a function, which the page can't receive as an argument: it is created there.
const setCalculateGroupValueToAll = (
  dataGrid: DataGrid,
  columnId: string,
): Promise<void> => dataGrid.element.evaluate((element, id) => {
  ($(element) as any).dxDataGrid('instance').columnOption(id, 'calculateGroupValue', () => 'ALL');
}, columnId);

test.describe('Grouping API - calculateGroupValue runtime changes', () => {
  test('One group: should expand grouped section after calculateGroupValue update', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await setCalculateGroupValueToAll(dataGrid, 'group');

    await dataGrid.getGroupRow(0).expectExpanded(false);
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(1);
    await expect(dataGrid.getDataRows()).toHaveCount(0);

    await dataGrid
      .getGroupRow(0)
      .getExpandCell()
      .click();

    await dataGrid.getGroupRow(0).expectExpanded();
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(1);
    await expect(dataGrid.getDataRows()).toHaveCount(4);
  });

  // NOTE: Intersection with "column configuration from first data source item" feature
  // Because one of first item's fields is null and different logic is applied
  test('One group: should expand grouped section after calculateGroupValue update if first record contains null value', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await setCalculateGroupValueToAll(dataGrid, 'group');

    await dataGrid.getGroupRow(0).expectExpanded(false);
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(1);
    await expect(dataGrid.getDataRows()).toHaveCount(0);

    await dataGrid
      .getGroupRow(0)
      .getExpandCell()
      .click();

    await dataGrid.getGroupRow(0).expectExpanded();
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(1);
    await expect(dataGrid.getDataRows()).toHaveCount(4);
  });

  test('Multiple groups: should expand grouped section after calculateGroupValue update', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await setCalculateGroupValueToAll(dataGrid, 'group');

    await dataGrid.getGroupRow(0).expectExpanded(false);
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(1);
    await expect(dataGrid.getDataRows()).toHaveCount(0);

    await dataGrid
      .getGroupRow(0)
      .getExpandCell()
      .click();

    await dataGrid.getGroupRow(0).expectExpanded();
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(5);
    await expect(dataGrid.getDataRows()).toHaveCount(0);
  });

  // NOTE: Intersection with "column configuration from first data source item" feature
  // Because one of first item's fields is null and different logic is applied
  test('Multiple groups: should expand grouped section after calculateGroupValue update if first record contains null value [T1281192]', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await setCalculateGroupValueToAll(dataGrid, 'group');

    await dataGrid.getGroupRow(0).expectExpanded(false);
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(1);
    await expect(dataGrid.getDataRows()).toHaveCount(0);

    await dataGrid
      .getGroupRow(0)
      .getExpandCell()
      .click();

    await dataGrid.getGroupRow(0).expectExpanded();
    await expect(dataGrid.getGroupRowSelector()).toHaveCount(5);
    await expect(dataGrid.getDataRows()).toHaveCount(0);
  });

  test('Should not reset sorting parameters after calculateGroupValue update [T1298901]', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortOrder')).toBe('desc');
    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortIndex')).toBe(0);

    await setCalculateGroupValueToAll(dataGrid, 'A');

    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortOrder')).toBe('desc');
    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortIndex')).toBe(0);
  });

  test('Should not reset multiple sorting parameters after calculateGroupValue update [T1298901]', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortOrder')).toBe('desc');
    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortIndex')).toBe(1);
    await expect.poll(() => dataGrid.apiColumnOption('B', 'sortOrder')).toBe('asc');
    await expect.poll(() => dataGrid.apiColumnOption('B', 'sortIndex')).toBe(0);

    await setCalculateGroupValueToAll(dataGrid, 'A');

    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortOrder')).toBe('desc');
    await expect.poll(() => dataGrid.apiColumnOption('A', 'sortIndex')).toBe(1);
    await expect.poll(() => dataGrid.apiColumnOption('B', 'sortOrder')).toBe('asc');
    await expect.poll(() => dataGrid.apiColumnOption('B', 'sortIndex')).toBe(0);
  });
});
