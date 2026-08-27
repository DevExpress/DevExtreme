import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { finishDrag, startDragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';

test('Drag-n-drop the tree view item in all directions', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    dataSource: {
      store: [{
        id: 0,
        data_0: 'data_0',
        data_1: 'data_1',
        data_2: 'data_2',
        data_3: 'data_3',
        data_4: 'data_4',
        data_5: 'data_5',
        data_6: 'data_6',
        data_7: 'data_7',
        data_8: 'data_8',
        data_9: 'data_9',
        data_10: 'data_10',
        data_11: 'data_11',
        data_12: 'data_12',
      }],
    },
    fieldChooser: {
      enabled: true,
    },
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  const fieldChooser = pivotGrid.getFieldChooser();
  const treeView = fieldChooser.getTreeView();
  const treeViewNodeItem = treeView.getNodeItem();

  await startDragToOffset(page, treeViewNodeItem, 0, -30);
  await testScreenshot(page, 'field-chooser_tree-item_dnd_top.png', { element: fieldChooser.element });
  await finishDrag(page);

  await startDragToOffset(page, treeViewNodeItem, 30, 0);
  await testScreenshot(page, 'field-chooser_tree-item_dnd_right.png', { element: fieldChooser.element });
  await finishDrag(page);

  await startDragToOffset(page, treeViewNodeItem, 0, 30);
  await testScreenshot(page, 'field-chooser_tree-item_dnd_bottom.png', { element: fieldChooser.element });
  await finishDrag(page);

  await startDragToOffset(page, treeViewNodeItem, -30, 0);
  await testScreenshot(page, 'field-chooser_tree-item_dnd_left.png', { element: fieldChooser.element });
  await finishDrag(page);
});

test('Drag-n-drop the row area item in all directions', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    dataSource: {
      fields: [{
        caption: 'Data_0',
        dataField: 'data_0',
        area: 'row',
      },
      {
        caption: 'Data_1',
        dataField: 'data_1',
        area: 'row',
      },
      {
        caption: 'Data_2',
        dataField: 'data_2',
        area: 'row',
      },
      {
        caption: 'Data_3',
        dataField: 'data_3',
        area: 'row',
      },
      {
        caption: 'Data_4',
        dataField: 'data_4',
        area: 'row',
      }],
      store: [],
    },
    fieldChooser: {
      enabled: true,
    },
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  const fieldChooser = pivotGrid.getFieldChooser();
  const rowAreaItem = fieldChooser.getRowAreaItem();

  await startDragToOffset(page, rowAreaItem, 0, -30);
  await testScreenshot(page, 'field-chooser_row-area-item_dnd_top.png', { element: fieldChooser.element });
  await finishDrag(page);

  await startDragToOffset(page, rowAreaItem, 30, 0);
  await testScreenshot(page, 'field-chooser_row-area-item_dnd_right.png', { element: fieldChooser.element });
  await finishDrag(page);

  await startDragToOffset(page, rowAreaItem, 0, 30);
  await testScreenshot(page, 'field-chooser_row-area-item_dnd_bottom.png', { element: fieldChooser.element });
  await finishDrag(page);

  await startDragToOffset(page, rowAreaItem, -30, 0);
  await testScreenshot(page, 'field-chooser_row-area-item_dnd_left.png', { element: fieldChooser.element });
  await finishDrag(page);
});
