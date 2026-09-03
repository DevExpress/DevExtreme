import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { finishDrag, startDragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';

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

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnFirstAction = pivotGrid.getColumnHeaderArea().getField();
  const rowFirstAction = pivotGrid.getRowHeaderArea().getField();
  const dataFirstAction = pivotGrid.getDataHeaderArea().getField();

  await startDragToOffset(page, columnFirstAction, 30, 30);
  await testScreenshot(page, 'field-panel_column-action_dnd.png', { element: pivotGrid.element });
  await finishDrag(page);

  await startDragToOffset(page, rowFirstAction, 30, 30);
  await testScreenshot(page, 'field-panel_row-action_dnd.png', { element: pivotGrid.element });
  await finishDrag(page);

  await startDragToOffset(page, dataFirstAction, 30, 30);
  await testScreenshot(page, 'field-panel_data-action_dnd.png', { element: pivotGrid.element });
  await finishDrag(page);
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

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowFirstField = pivotGrid.getRowHeaderArea().getField();
  const columnHeaderAreaElement = pivotGrid.getColumnHeaderArea().element;

  const rowFirsFieldX = await rowFirstField.evaluate((element: HTMLElement) => element.offsetLeft);
  const rowFirsFieldY = await rowFirstField.evaluate((element: HTMLElement) => element.offsetTop);
  const columnHeaderX = await columnHeaderAreaElement
    .evaluate((element: HTMLElement) => element.offsetLeft);
  const columnHeaderY = await columnHeaderAreaElement
    .evaluate((element: HTMLElement) => element.offsetTop);
  const deltaOffsetX = 20;
  const dragOffsetX = columnHeaderX - rowFirsFieldX - deltaOffsetX;
  const dragOffsetY = rowFirsFieldY - columnHeaderY;

  await startDragToOffset(page, rowFirstField, dragOffsetX, dragOffsetY);

  await testScreenshot(page, 'field-panel_column-field_dnd-first.png', { element: pivotGrid.element });

  await finishDrag(page);
});
