import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { changeTheme } from '../../../helpers/changeTheme';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import PivotGrid from '../../../model/pivotGrid';

const disableMouseUpEvent = ClientFunction(() => {
  const proto = (window as any)['%testCafeAutomation%'].DragToOffset.prototype.constructor.prototype;

  // eslint-disable-next-line spellcheck/spell-checker,no-underscore-dangle
  (window as any)._originalMouseup = proto._mouseup;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line spellcheck/spell-checker,no-underscore-dangle, no-promise-executor-return
  proto._mouseup = () => new Promise((r) => setTimeout(r, 1));
});

const enableMouseUpEvent = ClientFunction(() => {
  // eslint-disable-next-line no-underscore-dangle,spellcheck/spell-checker
  (window as any)['%testCafeAutomation%'].DragToOffset.prototype.constructor.prototype._mouseup = (window as any)._originalMouseup;
});

const DRAG_MOUSE_OPTIONS = { speed: 0.1 };

fixture.disablePageReloads`pivotGrid_fieldChooser_drag-and-drop_T1138119 `
  .page(url(__dirname, '../../../container.html'));

test('Drag-n-drop the tree view item in all directions', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid('#container');
  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();
  const treeView = fieldChooser.getTreeView();

  await disableMouseUpEvent();

  await t.drag(treeView.getNode(), 0, -30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_tree-item_dnd_top.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await t.drag(treeView.getNode(), 30, 0, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_tree-item_dnd_right.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await t.drag(treeView.getNode(), 0, 30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_tree-item_dnd_bottom.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await t.drag(treeView.getNode(), -30, 0, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_tree-item_dnd_left.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await enableMouseUpEvent();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('generic.light');
  await createWidget('dxPivotGrid', {
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
});

test('Drag-n-drop the row area item in all directions', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid('#container');
  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();

  await disableMouseUpEvent();

  await t.drag(fieldChooser.getRowAreaItem(), 0, -30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_row-area-item_dnd_top.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await t.drag(fieldChooser.getRowAreaItem(), 30, 0, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_row-area-item_dnd_right.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await t.drag(fieldChooser.getRowAreaItem(), 0, 30, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_row-area-item_dnd_bottom.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await t.drag(fieldChooser.getRowAreaItem(), -30, 0, DRAG_MOUSE_OPTIONS);
  await testScreenshot(t, takeScreenshot, 'field-chooser_row-area-item_dnd_left.png', { element: fieldChooser.element });
  await t.click(fieldChooser.element);

  await enableMouseUpEvent();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await changeTheme('generic.light');
  await createWidget('dxPivotGrid', {
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
});
