import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.describe('Filtering', () => {
  // T1311818
  test('Don\'t calculate additional filter when filtering column list is empty', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      filterValue: ['id', '>=', 1],
      // @ts-expect-error null as the data source, which the types don't allow
      dataSource: null,
      columns: [],
      showBorders: true,
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.option({
      columns: [
        { dataField: 'id', caption: 'ID', dataType: 'number' },
        { dataField: 'name', caption: 'Name', dataType: 'string' },
      ],
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ],
    });

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.option({
      columns: [],
      dataSource: undefined,
    });

    // assert
    expect(consoleErrors.every((msg) => !msg.includes('E1047'))).toBe(true);
  });
});
