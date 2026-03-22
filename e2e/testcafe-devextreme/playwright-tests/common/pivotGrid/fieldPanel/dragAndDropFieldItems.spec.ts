import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_fieldPanel_drag-n-drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const PIVOT_GRID_SELECTOR = '#container';

  test('Field panel items markup in the middle of the drag-n-drop', async ({ page }) => {

    await createWidget(page, 'dxPivotGrid', {
      allowSorting: true,
      allowFiltering: true,
      fieldPanel: {
        showColumnFields: true,
        showDataFields: true,
        showFilterFields: true,
        showRowFields: true,
        allowFieldDragging: true,
        visible: true,
      },
      dataSource: {
        fields: [{
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          dataField: 'countA',
          area: 'row',
        }, {
          dataField: 'countB',
          area: 'row',
        }, {
          dataField: 'countC',
          area: 'data',
        }],
        store: [{
          id: 0,
          countA: 1,
          countB: 1,
          countC: 1,
          date: '2013/01/13',
        }],
      },
    });

    const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
    const columnFirstAction = pivotGrid.getColumnHeaderArea().getField();
    const rowFirstAction = pivotGrid.getRowHeaderArea().getField();
    const dataFirstAction = pivotGrid.getDataHeaderArea().getField();

    await MouseUpEvents.disable(MouseAction.dragToOffset);

    await drag(columnFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-panel_column-action_dnd.png', { element: pivotGrid.element });
    await columnFirstAction.dispatchEvent('mouseup');

    await drag(rowFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-panel_row-action_dnd.png', { element: pivotGrid.element });
    await columnFirstAction.dispatchEvent('mouseup');

    await drag(dataFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
    await testScreenshot(page, 'field-panel_data-action_dnd.png', { element: pivotGrid.element });
    await columnFirstAction.dispatchEvent('mouseup');

    await MouseUpEvents.enable(MouseAction.dragToOffset);

    });

  test('Should show d-n-d indicator during drag to first place in columns fields', async ({ page }) => {

    await createWidget(page, 'dxPivotGrid', {
      showBorders: true,
      fieldPanel: {
        visible: true,
      },
      dataSource: {
        fields: [{
          dataField: 'row1',
          area: 'row',
        }, {
          dataField: 'row2',
          area: 'row',
        }, {
          dataField: 'column1',
          area: 'column',
        }, {
          dataField: 'column2',
          area: 'column',
        }],
        store: [],
      },
    });

    const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
    const rowFirstField = pivotGrid.getRowHeaderArea().getField();
    const columnHeaderAreaElement = pivotGrid.getColumnHeaderArea().element;

    await MouseUpEvents.disable(MouseAction.dragToOffset);

    const rowFirsFieldX = await rowFirstField.offsetLeft;
    const rowFirsFieldY = await rowFirstField.offsetTop;
    const columnHeaderX = await columnHeaderAreaElement.offsetLeft;
    const columnHeaderY = await columnHeaderAreaElement.offsetTop;
    const deltaOffsetX = 20;
    const dragOffsetX = columnHeaderX - rowFirsFieldX - deltaOffsetX;
    const dragOffsetY = rowFirsFieldY - columnHeaderY;

    await drag(rowFirstField, dragOffsetX, dragOffsetY, DRAG_MOUSE_OPTIONS);

    await testScreenshot(page, 'field-panel_column-field_dnd-first.png', { element: pivotGrid.element });

    await MouseUpEvents.enable(MouseAction.dragToOffset);

    });
});
