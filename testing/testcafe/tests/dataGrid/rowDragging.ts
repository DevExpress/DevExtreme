import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

const isPlaceholderVisible = ClientFunction(() => $('.dx-sortable-placeholder').is(':visible'));

const getPlaceholderOffset = ClientFunction(() => $('.dx-sortable-placeholder').offset());

const scrollTo = ClientFunction((x, y) => {
  window.scrollTo(x, y);
});

fixture.disablePageReloads`Row dragging`
  .page(url(__dirname, '../container.html'))
  .afterEach(() => disposeWidgets());

// T903351
test('The placeholder should appear when a cross-component dragging rows after scrolling the window', async (t) => {
  const dataGrid = new DataGrid('#container');

  await scrollTo(0, 10000);
  await dataGrid.moveRow(6, 500, 0, true);
  await dataGrid.moveRow(6, 550, 0);

  await t.expect(isPlaceholderVisible()).ok();
}).before(async (t) => {
  await t.maximizeWindow();

  await ClientFunction(() => {
    $('body').css('display', 'flex');
    $('#container, #otherContainer').css({
      display: 'inline-block',
      'margin-top': '800px',
      width: '50%',
    });
  })();

  return Promise.all([
    createWidget('dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columns: ['name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }),
    createWidget('dxTreeList', {
      columnAutoWidth: true,
      dataSource: [
        {
          id: 1, parentId: 0, name: 'Name 1', age: 19,
        },
        {
          id: 2, parentId: 1, name: 'Name 2', age: 11,
        },
        {
          id: 3, parentId: 0, name: 'Name 3', age: 15,
        },
        {
          id: 4, parentId: 3, name: 'Name 4', age: 16,
        },
        {
          id: 5, parentId: 0, name: 'Name 5', age: 25,
        },
        {
          id: 6, parentId: 5, name: 'Name 6', age: 18,
        },
        {
          id: 7, parentId: 0, name: 'Name 7', age: 21,
        },
        {
          id: 8, parentId: 7, name: 'Name 8', age: 14,
        },
      ],
      autoExpandAll: true,
      columns: ['name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }, false, '#otherContainer'),
  ]);
});

test('The cross-component drag and drop rows should work when there are fixed columns', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.moveRow(0, 500, 0, true);
  await dataGrid.moveRow(0, 550, 0);

  await t
    .expect(isPlaceholderVisible())
    .ok();

  const otherDataGrid = new DataGrid('#otherContainer');
  const dataRow = otherDataGrid.getDataRow(0);
  const dataRowOffset = await dataRow.getOffset();

  await t
    .expect(dataRow.element.exists)
    .ok()
    .expect(getPlaceholderOffset())
    .eql(dataRowOffset);
}).before(async (t) => {
  await t.maximizeWindow();

  await ClientFunction(() => {
    $('body').css('display', 'flex');
    $('#container, #otherContainer').css({
      display: 'inline-block',
      width: '50%',
    });
  })();

  return Promise.all([
    createWidget('dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }),
    createWidget('dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }, false, '#otherContainer'),
  ]);
});

test('The cross-component drag and drop rows should not block rows', async (t) => {
  const dataGrid = new DataGrid('#container');
  const otherDataGrid = new DataGrid('#otherContainer');

  await t.drag(Selector('.dx-command-drag').nth(2), 500, 0);

  const [fixedPointerEvents, otherFixedPointerEvents] = await ClientFunction(() => [
    $('.dx-datagrid-rowsview .dx-datagrid-content-fixed:eq(0)').css('pointer-events'),
    $('.dx-datagrid-rowsview .dx-datagrid-content-fixed:eq(1)').css('pointer-events'),
  ], { dependencies: { dataGrid, otherDataGrid } })();

  // T1013088
  await t
    .expect(fixedPointerEvents)
    .eql('none')
    .expect(otherFixedPointerEvents)
    .eql('none');
}).before(async (t) => {
  await t.maximizeWindow();

  await ClientFunction(() => {
    $('body').css('display', 'flex');
    $('#container, #otherContainer').css({
      display: 'inline-block',
      width: '50%',
    });
  })();

  return Promise.all([
    createWidget('dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 14,
        },
      ],
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }),
    createWidget('dxDataGrid', {
      width: 400,
      dataSource: [
        {
          id: 1, name: 'Name 1', age: 19,
        },
        {
          id: 2, name: 'Name 2', age: 11,
        },
        {
          id: 3, name: 'Name 3', age: 15,
        },
        {
          id: 4, name: 'Name 4', age: 16,
        },
        {
          id: 5, name: 'Name 5', age: 25,
        },
        {
          id: 6, name: 'Name 6', age: 18,
        },
        {
          id: 7, name: 'Name 7', age: 21,
        },
        {
          id: 8, name: 'Name 8', age: 15,
        },
      ],
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: {
        group: 'shared',
      },
    }, false, '#otherContainer'),
  ]);
});
