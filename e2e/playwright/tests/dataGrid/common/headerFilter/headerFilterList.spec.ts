import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import HeaderFilter from '../../../../models/dataGrid/headers/headerFilter';

const openHeaderFilterAndGetList = async (dataGrid: DataGrid) => {
  const headerCell = dataGrid.getHeaders()
    .getHeaderRow(0)
    .getHeaderCell(0);
  const filterIconElement = headerCell.getFilterIcon();
  const headerFilter = new HeaderFilter(dataGrid.page);
  const list = headerFilter.getList();
  const firstListItem = list.getItem(0);
  const secondListItem = list.getItem(1);

  await filterIconElement.click();

  return { list, firstListItem, secondListItem };
};

test.describe('Header Filter - dxList integration', () => {
  test('Should has unchecked "Select all" checkbox state if no values is selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('unchecked');
    await firstListItem.expectSelected(false);
    await secondListItem.expectSelected(false);
  });

  test('Should has checked "Select all" checkbox state if all values selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterType: 'exclude', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('checked');
    await firstListItem.expectSelected();
    await secondListItem.expectSelected();
  });

  test('Should has indeterminate "Select all" checkbox state if only part of values selected', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [0] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('indeterminate');
    await firstListItem.expectSelected();
    await secondListItem.expectSelected(false);
  });

  test('Should has indeterminate "Select all" checkbox state if part of values excluded', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterType: 'exclude', filterValues: [1] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('indeterminate');
    await firstListItem.expectSelected();
    await secondListItem.expectSelected(false);
  });

  test('Should has indeterminate "Select all" checkbox state if has not selected value on not first page [T1284200]', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: new Array(100)
        .map((_, idx) => ({ id: idx })),
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterType: 'exclude', filterValues: [89] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list } = await openHeaderFilterAndGetList(dataGrid);

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('indeterminate');

    const firstPageItemCount = await list.items.count();

    for (let idx = 0; idx < firstPageItemCount; idx += 1) {
      await list.getItem(idx).expectSelected();
    }
  });

  test('Should select all values after unchecked "Select all" click', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await list.selectAll.checkBox.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('checked');
    await firstListItem.expectSelected();
    await secondListItem.expectSelected();
  });

  test('Should unselect all values after checked "Select all" click', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterType: 'exclude', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await list.selectAll.checkBox.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('unchecked');
    await firstListItem.expectSelected(false);
    await secondListItem.expectSelected(false);
  });

  test('Should select all values after indeterminate "Select all" click', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [0] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await list.selectAll.checkBox.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('checked');
    await firstListItem.expectSelected();
    await secondListItem.expectSelected();
  });

  test('Should change "Select all" to checked after selecting all values [T1293295]', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await firstListItem.element.click();
    await secondListItem.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('checked');
    await firstListItem.expectSelected();
    await secondListItem.expectSelected();
  });

  test('Should change "Select all" to unchecked after unselecting all values', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [0, 1] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await firstListItem.element.click();
    await secondListItem.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('unchecked');
    await firstListItem.expectSelected(false);
    await secondListItem.expectSelected(false);
  });

  test('Should change "Select all" to unchecked after unselecting all values with exclude filter', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterType: 'exclude', filterValues: [] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await firstListItem.element.click();
    await secondListItem.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('unchecked');
    await firstListItem.expectSelected(false);
    await secondListItem.expectSelected(false);
  });

  test('Should change "Select all" to indeterminate after unselecting one value', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      keyExpr: 'id',
      columns: [
        { dataField: 'id', filterValues: [0, 1] },
      ],
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const { list, firstListItem, secondListItem } = await openHeaderFilterAndGetList(dataGrid);

    await firstListItem.element.click();

    await expect.poll(() => list.selectAll.checkBox.getCheckBoxState()).toBe('indeterminate');
    await firstListItem.expectSelected(false);
    await secondListItem.expectSelected();
  });
});
