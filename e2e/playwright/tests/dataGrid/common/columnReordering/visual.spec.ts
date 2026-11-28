import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { startDragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { insertStylesToSuppressGroupPanelFocusOutline } from '../../helpers/domUtils';

test.describe('Column reordering.Visual', () => {
  test('column separator should work properly with expand columns', async ({ page }) => {
    await insertStylesToSuppressGroupPanelFocusOutline(page);

    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          width: 200,
          groupIndex: 0,
        }, {
          dataField: 'field2',
          width: 200,
          groupIndex: 1,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await startDragToOffset(page, dataGrid.getGroupPanel().getHeader(0).element, 0, 30);
    await testScreenshot(page, 'column-separator-with-expand-columns.png');
  });

  test('HeaderRow should be highlighted when dragging column with allowColumnReordering=false', async ({ page }) => {
    await insertStylesToSuppressGroupPanelFocusOutline(page);

    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          width: 200,
          groupIndex: 0,
        }, {
          dataField: 'field2',
          width: 200,
          groupIndex: 1,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: false,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await startDragToOffset(page, dataGrid.getGroupPanel().getHeader(0).element, 0, 30);
    await testScreenshot(page, 'headerRow-highlight-on-drag.png');
  });

  test('The group separator should not appear when dragging a grouped column to the same position', async ({ page }) => {
    await insertStylesToSuppressGroupPanelFocusOutline(page);

    await createWidget(page, 'dxDataGrid', {
      width: 800,
      dataSource: [
        {
          field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
        },
      ],
      groupPanel: {
        visible: true,
      },
      columns: [
        {
          dataField: 'field1',
          width: 200,
          groupIndex: 0,
        }, {
          dataField: 'field2',
          width: 200,
        }, {
          dataField: 'field3',
          width: 200,
        }, {
          dataField: 'field4',
          width: 200,
        },
      ],
      allowColumnReordering: false,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await startDragToOffset(page, dataGrid.getGroupPanel().getHeader(0).element, -25, 20);

    await testScreenshot(page, 'dragging_grouped_column_to_same_position.png', { element: dataGrid.element });
  });
});
