import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { MouseAction, MouseUpEvents } from '../../../helpers/mouseUpEvents';
import { testScreenshot } from '../../../helpers/themeUtils';
import PivotGrid from '../../../model/pivotGrid';
import { DRAG_MOUSE_OPTIONS } from '../const';

fixture`pivotGrid_fieldPanel_drag-n-drop`
  .page(url(__dirname, '../../container.html'));

test.only('Field panel items markup in the middle of the drag-n-drop', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid('#container');
  const columnFirstAction = pivotGrid.getColumnHeaderArea().getAction();
  const rowFirstAction = pivotGrid.getRowHeaderArea().getAction();
  const dataFirstAction = pivotGrid.getDataHeaderArea().getAction();

  await MouseUpEvents.disable(MouseAction.dragToOffset);

  await t.drag(columnFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
  // await t.hover('body', { offsetX: 0, offsetY: 0 });
  await testScreenshot(t, takeScreenshot, 'field-panel_column-action_dnd.png', { element: pivotGrid.element });
  await t.dispatchEvent(columnFirstAction, 'mouseup');

  await t.drag(rowFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
  // await t.hover('body', { offsetX: 0, offsetY: 0 });
  await testScreenshot(t, takeScreenshot, 'field-panel_row-action_dnd.png', { element: pivotGrid.element });
  await t.dispatchEvent(rowFirstAction, 'mouseup');

  await t.drag(dataFirstAction, 30, 30, DRAG_MOUSE_OPTIONS);
  // await t.hover('body', { offsetX: 0, offsetY: 0 });
  await testScreenshot(t, takeScreenshot, 'field-panel_data-action_dnd.png', { element: pivotGrid.element });
  await t.dispatchEvent(dataFirstAction, 'mouseup');

  await MouseUpEvents.enable(MouseAction.dragToOffset);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxPivotGrid', {
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
});
