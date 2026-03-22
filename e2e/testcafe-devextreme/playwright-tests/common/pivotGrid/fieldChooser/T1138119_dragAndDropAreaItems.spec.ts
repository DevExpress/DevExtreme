import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_fieldChooser_drag-and-drop_T1138119 ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

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

    const pivotGrid = page.locator('#container');
    await click(pivotGrid.getFieldChooserButton());

    const fieldChooser = pivotGrid.getFieldChooser();
    const treeView = fieldChooser.getTreeView();
    const treeViewNodeItem = treeView.getNodeItem();

    await MouseUpEvents.disable(MouseAction.dragToOffset);

    await drag(treeViewNodeItem, 0, -30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_tree-item_dnd_top.png', { element: fieldChooser.element });
    await treeViewNodeItem.dispatchEvent('mouseup');

    await drag(treeViewNodeItem, 30, 0, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_tree-item_dnd_right.png', { element: fieldChooser.element });
    await treeViewNodeItem.dispatchEvent('mouseup');

    await drag(treeViewNodeItem, 0, 30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_tree-item_dnd_bottom.png', { element: fieldChooser.element });
    await treeViewNodeItem.dispatchEvent('mouseup');

    await drag(treeViewNodeItem, -30, 0, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_tree-item_dnd_left.png', { element: fieldChooser.element });
    await treeViewNodeItem.dispatchEvent('mouseup');

    await MouseUpEvents.enable(MouseAction.dragToOffset);

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

    const pivotGrid = page.locator('#container');
    await click(pivotGrid.getFieldChooserButton());

    const fieldChooser = pivotGrid.getFieldChooser();
    const rowAreaItem = fieldChooser.getRowAreaItem();

    await MouseUpEvents.disable(MouseAction.dragToOffset);

    await drag(rowAreaItem, 0, -30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_row-area-item_dnd_top.png', { element: fieldChooser.element });
    await rowAreaItem.dispatchEvent('mouseup');

    await drag(rowAreaItem, 30, 0, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_row-area-item_dnd_right.png', { element: fieldChooser.element });
    await rowAreaItem.dispatchEvent('mouseup');

    await drag(rowAreaItem, 0, 30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_row-area-item_dnd_bottom.png', { element: fieldChooser.element });
    await rowAreaItem.dispatchEvent('mouseup');

    await drag(rowAreaItem, -30, 0, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-chooser_row-area-item_dnd_left.png', { element: fieldChooser.element });
    await rowAreaItem.dispatchEvent('mouseup');

    await MouseUpEvents.enable(MouseAction.dragToOffset);

    });
});
