import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { MouseAction, MouseUpEvents } from '../../../../helpers/mouseUpEvents';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Column reordering.Visual`
  .page(url(__dirname, '../../../container.html'));

test('column separator should work properly with expand columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();
  await MouseUpEvents.disable(MouseAction.dragToOffset);

  await t.drag(dataGrid.getGroupPanel().getHeader(0).element, 0, 30);
  await testScreenshot(t, takeScreenshot, 'column-separator-with-expand-columns.png');
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  await MouseUpEvents.enable(MouseAction.dragToOffset);
}).before(async () => createWidget('dxDataGrid', {
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
  onToolbarPreparing(e): void {
    e.toolbarOptions.allowKeyboardNavigation = false;
  },
}));

test('HeaderRow should be highlighted when dragging column with allowColumnReordering=false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  await t.expect(dataGrid.isReady()).ok();

  await MouseUpEvents.disable(MouseAction.dragToOffset);

  await t.drag(dataGrid.getGroupPanel().getHeader(0).element, 0, 30);
  await testScreenshot(t, takeScreenshot, 'headerRow-highlight-on-drag.png');
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  await MouseUpEvents.enable(MouseAction.dragToOffset);
}).before(async () => createWidget('dxDataGrid', {
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
}));

test('The group separator should not appear when dragging a grouped column to the same position', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

  await t.drag(dataGrid.getGroupPanel().getHeader(0).element, -25, 20);

  await testScreenshot(t, takeScreenshot, 'dragging_grouped_column_to_same_position.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await MouseUpEvents.disable(MouseAction.dragToOffset);

  return createWidget('dxDataGrid', {
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
    onToolbarPreparing(e): void {
      e.toolbarOptions.allowKeyboardNavigation = false;
    },
  });
}).after(async () => {
  await MouseUpEvents.enable(MouseAction.dragToOffset);
});
