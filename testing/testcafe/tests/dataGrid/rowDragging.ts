import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid, { CLASS as DataGridClassNames } from '../../model/dataGrid';
import { ClassNames } from '../../model/dataGrid/classNames';

const CLASS = { ...DataGridClassNames, ...ClassNames };

const isPlaceholderVisible = ClientFunction(() => $(`.${CLASS.sortablePlaceholder}`).is(':visible'), { dependencies: { CLASS } });

const getPlaceholderOffset = ClientFunction(() => $(`.${CLASS.sortablePlaceholder}`).offset(), { dependencies: { CLASS } });

const getRowsViewLeftOffset = ClientFunction(() => $(`#container .${CLASS.dataGridRowsView}`).offset()?.left, { dependencies: { CLASS } });

const getDraggingElementLeftOffset = ClientFunction(() => $(`.${CLASS.sortableDragging}`).offset()?.left, { dependencies: { CLASS } });

const getDraggingElementScrollPosition = ClientFunction(() => {
  const $dataGrid = $(`.${CLASS.sortableDragging}`).find(`.${CLASS.dataGrid}`).first().parent();
  const dataGridInstance = $dataGrid.data('dxDataGrid');
  const scrollableInstance = dataGridInstance.getScrollable();

  return {
    left: scrollableInstance.scrollLeft(),
    top: scrollableInstance.scrollTop(),
  };
}, { dependencies: { CLASS } });

const getFreeSpaceRowOffset = ClientFunction(() => {
  const $freeSpaceRow = $('#container').find(`.${CLASS.dataGridRowsView} table .${CLASS.freeSpaceRow}`).first();

  return $freeSpaceRow?.offset();
}, { dependencies: { CLASS } });

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

fixture.disablePageReloads`Row dragging`
  .page(url(__dirname, '../container.html'));

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
    }, '#otherContainer'),
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
    }, '#otherContainer'),
  ]);
});

test('The cross-component drag and drop rows should not block rows', async (t) => {
  const dataGrid = new DataGrid('#container');
  const otherDataGrid = new DataGrid('#otherContainer');

  await t.drag(dataGrid.getDataRow(2).element.find('.dx-datagrid-drag-icon'), 500, 0);

  const [fixedPointerEvents, otherFixedPointerEvents] = await ClientFunction(() => [
    $(`.${CLASS.dataGridRowsView} .${CLASS.dataGridContentFixed}:eq(0)`).css('pointer-events'),
    $(`.${CLASS.dataGridRowsView} .${CLASS.dataGridContentFixed}:eq(1)`).css('pointer-events'),
  ], { dependencies: { dataGrid, otherDataGrid, CLASS } })();

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
    }, '#otherContainer'),
  ]);
});

test('Virtual rendering during auto scrolling should not cause errors in onDragChange', async (t) => {
  const dataGrid = new DataGrid('#container');
  await t.drag(dataGrid.getDataRow(0).getDragCommand(), 0, 100, { speed: 0.01 });

  const lastRow = dataGrid.getDataRow(9);

  await t
    .expect(lastRow.element.exists)
    .ok();
}).before(async (t) => {
  await t.maximizeWindow();
  return createWidget('dxDataGrid', {
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
  });
});

// T1078513
test('Headers should not be hidden during auto scrolling when virtual scrollling is specified', async (t) => {
  const dataGrid = new DataGrid('#container');
  await t.drag(dataGrid.getDataRow(0).getDragCommand(), 0, 90, { speed: 0.01 });

  const headerRow = dataGrid.getHeaders().getHeaderRow(0).element;

  await t
    .expect(headerRow.exists)
    .ok()
    .expect(headerRow.getStyleProperty('transform'))
    .eql('none');
}).before(async (t) => {
  await t.maximizeWindow();
  return createWidget('dxDataGrid', {
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
  });
});

// T1078513
test('Footer should not be hidden during auto scrolling when virtual scrollling is specified', async (t) => {
  const dataGrid = new DataGrid('#container');
  await t.drag(dataGrid.getDataRow(0).getDragCommand(), 0, 90, { speed: 0.01 });

  const footerRow = dataGrid.getFooterRow();

  await t
    .expect(footerRow.exists)
    .ok()
    .expect(footerRow.getStyleProperty('transform'))
    .eql('none');
}).before(async (t) => {
  await t.maximizeWindow();
  return createWidget('dxDataGrid', {
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
  });
});

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

// T1085143
test('The placeholder should have correct position after dragging the row to the end when there is free space in grid and dataRowTemplate is set', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.moveRow(0, 0, 50, true);
  await dataGrid.moveRow(0, 0, 550);

  const freeSpaceRowOffset = await getFreeSpaceRowOffset();
  const placeholderOffset = await getPlaceholderOffset();

  const expectedPlaceholderOffset = freeSpaceRowOffset
    ? {
      ...freeSpaceRowOffset,
      top: freeSpaceRowOffset.top - 2,
    }
    : undefined;

  await t.expect(isPlaceholderVisible()).ok();
  await t.expect(placeholderOffset).eql(expectedPlaceholderOffset);
}).before(async (t) => {
  await t.maximizeWindow();
  return createWidget('dxDataGrid', {
    width: 400,
    height: 600,
    dataSource: [
      {
        id: 1, name: 'Name 1', age: 19,
      },
      {
        id: 2, name: 'Name 2', age: 11,
      },
    ],
    columns: ['name', 'age'],
    dataRowTemplate(_, { data }) {
      return $(`<tr><td>${data.name}</td><td>${data.age}</td></tr>`);
    },
    rowDragging: {
      allowReordering: true,
      dragTemplate() {
        return $('<div>test</div>');
      },
      showDragIcons: false,
    },
  });
});

// T1126013
// TODO: It is unstable test. Unskip after fix trello.com/c/k1u72fE0
test('toIndex should not be corrected when source item gets removed from DOM', async (t) => {
  const fromIndex = 2;
  const toIndex = 4;

  const dataGrid = new DataGrid('#container');
  await dataGrid.scrollTo({ y: 3000 });
  await dataGrid.moveRow(fromIndex, 0, 50, true);
  await dataGrid.moveRow(fromIndex, 0, -20);
  await t.wait(500);
  await dataGrid.moveRow(toIndex, 0, 5);
  await t.wait(200);

  await ClientFunction((grid) => {
    const instance = grid.getInstance();
    $(instance.element()).trigger($.Event('dxpointerup'));
  })(dataGrid);
  await t.wait(200);

  const draggedRowIndex = await ClientFunction((grid) => grid.getInstance()
    .getVisibleRows()
    .findIndex(({ key }, index: number, rows) => key > rows[index + 1]?.key))(dataGrid);
  await t.expect(draggedRowIndex)
    .eql(toIndex - 1);
}).before(async (t) => {
  await t.maximizeWindow();
  const items = generateData(50, 1);
  return createWidget('dxDataGrid', {
    height: 250,
    keyExpr: 'field1',
    scrolling: {
      mode: 'virtual',
    },
    paging: {
      pageSize: 4,
    },
    dataSource: items,
    rowDragging: {
      scrollSpeed: 300,
      allowReordering: true,
      onReorder: ClientFunction((e) => {
        const visibleRows = e.component.getVisibleRows();
        // eslint-disable-next-line max-len
        const toIndex = items.findIndex((item) => item.field1 === visibleRows[e.toIndex].data.field1);
        const fromIndex = items.findIndex((item) => item.field1 === e.itemData.field1);
        items.splice(fromIndex, 1);
        items.splice(toIndex, 0, e.itemData);

        e.component.refresh();
      }, { dependencies: { items } }),
    },
    showBorders: true,
  });
});

// T1139685
test('Item should appear in a correct spot when dragging to a different page with scrolling.mode: "virtual"', async (t) => {
  const fromIndex = 2;
  const toIndex = 4;

  const dataGrid = new DataGrid('#container');
  await dataGrid.moveRow(fromIndex, 0, 50, true);
  await dataGrid.moveRow(fromIndex, 0, 95);
  await t.wait(500);
  await dataGrid.moveRow(toIndex, 0, 5);

  await t.wait(200);

  await ClientFunction((grid) => {
    const instance = grid.getInstance();
    $(instance.element()).trigger($.Event('dxpointerup'));
  })(dataGrid);
  await t.wait(200);

  const draggedRowIndex = await ClientFunction((grid) => grid.getInstance()
    .getVisibleRows()
    .findIndex(({ key }, index: number, rows) => key > rows[index + 1]?.key))(dataGrid);

  await t.expect(draggedRowIndex)
    .eql(toIndex - 1);
}).before(async (t) => {
  await t.maximizeWindow();
  const items = generateData(20, 1);
  return createWidget('dxDataGrid', {
    height: 250,
    keyExpr: 'field1',
    scrolling: {
      mode: 'virtual',
    },
    paging: {
      pageSize: 4,
    },
    dataSource: items,
    rowDragging: {
      scrollSpeed: 300,
      allowReordering: true,
      onReorder: ClientFunction((e) => {
        const visibleRows = e.component.getVisibleRows();
        // eslint-disable-next-line max-len
        const toIndex = items.findIndex((item) => item.field1 === visibleRows[e.toIndex].data.field1);
        const fromIndex = items.findIndex((item) => item.field1 === e.itemData.field1);
        items.splice(fromIndex, 1);
        items.splice(toIndex, 0, e.itemData);

        e.component.refresh();
      }, { dependencies: { items } }),
    },
    showBorders: true,
  });
});
