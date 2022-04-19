import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

const isPlaceholderVisible = ClientFunction(() => $('.dx-sortable-placeholder').is(':visible'));

const getPlaceholderOffset = ClientFunction(() => $('.dx-sortable-placeholder').offset());

const getRowsViewLeftOffset = ClientFunction(() => $('#container .dx-datagrid-rowsview').offset()?.left);

const getDraggingElementLeftOffset = ClientFunction(() => $('.dx-sortable-dragging').offset()?.left);

const getDraggingElementScrollPosition = ClientFunction(() => {
  const $dataGrid = $('.dx-sortable-dragging').find('.dx-datagrid').first().parent();
  const dataGridInstance = $dataGrid.data('dxDataGrid');
  const scrollableInstance = dataGridInstance.getScrollable();

  return {
    left: scrollableInstance.scrollLeft(),
    top: scrollableInstance.scrollTop(),
  };
});

const scrollTo = ClientFunction((x, y) => {
  window.scrollTo(x, y);
});

const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < rowCount; i += 1) {
    const item = {};

    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }

    items.push(item);
  }

  return items;
};

fixture`Row dragging`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => disposeWidgets());

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

test('Virtual rendering during auto scrolling should not cause errors in onDragChange', async (t) => {
  await t.drag(Selector('.dx-data-row .dx-command-drag').nth(0), 0, 100, { speed: 0.01 });

  const lastRow = Selector('tr').withAttribute('aria-rowindex', '10');

  await t
    .expect(lastRow.exists)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  height: 200,
  keyExpr: 'id',
  scrolling: {
    mode: 'virtual',
  },
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ],
  columns: ['id'],
  rowDragging: {
    allowReordering: true,
    scrollSpeed: 300,
    onDragChange(e) {
      const visibleRows = e.component.getVisibleRows();
      const row = visibleRows[e.toIndex];
      if (!row) {
        throw new Error('row is null');
      }
    },
  },
}));

// T1078513
test('Headers should not be hidden during auto scrolling when virtual scrollling is specified', async (t) => {
  await t.drag(Selector('.dx-data-row .dx-command-drag').nth(0), 0, 90, { speed: 0.01 });

  const headerRow = Selector('tr.dx-header-row');

  await t
    .expect(headerRow.exists)
    .ok()
    .expect(headerRow.getStyleProperty('transform'))
    .eql('none');
}).before(async () => createWidget('dxDataGrid', {
  height: 200,
  keyExpr: 'id',
  scrolling: {
    mode: 'virtual',
  },
  paging: {
    pageSize: 2,
  },
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
  ],
  columns: ['id'],
  columnAutoWidth: true,
  rowDragging: {
    allowReordering: true,
    dropFeedbackMode: 'push',
    onDragEnd(e: any): void {
      e.cancel = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
  },
}));

// T1078513
test('Footer should not be hidden during auto scrolling when virtual scrollling is specified', async (t) => {
  await t.drag(Selector('.dx-data-row .dx-command-drag').nth(0), 0, 90, { speed: 0.01 });

  const footerRow = Selector('tr.dx-footer-row');

  await t
    .expect(footerRow.exists)
    .ok()
    .expect(footerRow.getStyleProperty('transform'))
    .eql('none');
}).before(async () => createWidget('dxDataGrid', {
  height: 250,
  keyExpr: 'id',
  scrolling: {
    mode: 'virtual',
  },
  summary: {
    totalItems: [{
      column: 'id',
      summaryType: 'count',
    }],
  },
  paging: {
    pageSize: 2,
  },
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
  ],
  columns: ['id'],
  columnAutoWidth: true,
  rowDragging: {
    allowReordering: true,
    dropFeedbackMode: 'push',
    onDragEnd(e: any): void {
      e.cancel = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
  },
}));

// T1082538
test('The draggable element should be displayed correctly after horizontal scrolling when columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.scrollTo({ x: 2500 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(2500);

  await dataGrid.moveRow(0, 0, 25, true);
  await dataGrid.moveRow(0, 0, 50, false);

  const rowsViewLeftOffset = await getRowsViewLeftOffset();

  await t
    .expect(getDraggingElementLeftOffset())
    .eql(rowsViewLeftOffset)
    .expect(getDraggingElementScrollPosition())
    .eql({
      left: 2500,
      top: 0,
    });
}).before(async (t) => {
  await t.maximizeWindow();

  return createWidget('dxDataGrid', {
    width: 600,
    height: 500,
    dataSource: generateData(10, 50),
    columnWidth: 100,
    scrolling: {
      columnRenderingMode: 'virtual',
      useNative: false,
    },
    rowDragging: {
      allowReordering: true,
      showDragIcons: false,
    },
  });
});
