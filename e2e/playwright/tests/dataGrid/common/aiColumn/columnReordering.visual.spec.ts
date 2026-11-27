import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Ai Column.ColumnReordering.Visual', () => {
  test('The draggable AI column should display correctly', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      allowColumnReordering: true,
      columnWidth: 200,
      columns: [
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.moveHeader(0, 100, 5, true);

    await expect(dataGrid.getDraggableHeader()).toBeVisible();

    await testScreenshot(page, 'datagrid__ai-column__dragging.png', { element: dataGrid.element });

    await dataGrid.dropHeader(0);

    await expect(dataGrid.getDraggableHeader()).toBeHidden();
  });
});
