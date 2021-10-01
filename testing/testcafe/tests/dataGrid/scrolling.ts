import { Selector, ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

const groupRow = Selector('.dx-group-row');

async function getMaxRightOffset(dataGrid: DataGrid): Promise<number> {
  const scrollWidth = await dataGrid.getScrollWidth();
  const rowsViewWidth = await dataGrid.getRowsView().clientWidth;
  return scrollWidth - rowsViewWidth;
}

async function getRightScrollOffset(dataGrid: DataGrid): Promise<number> {
  const maxHorizontalOffset = await getMaxRightOffset(dataGrid);
  const scrollLeft = await dataGrid.getScrollLeft();
  return maxHorizontalOffset - scrollLeft;
}

function getData(rowCount, colCount): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j += 1) {
      item[`field_${i}_${j}`] = `val_${i}_${j}`;
    }
    items.push(item);
  }

  return items;
}

fixture`Scrolling`
  .page(url(__dirname, '../container.html'));

test('DataGrid should set the scrollbar position to the left on resize (T934842)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(0);

  // act
  await t.resizeWindow(700, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(0);

  // act
  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(0);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  columnWidth: 100,
}));

test('DataGrid should set the scrollbar position to the right on resize when RTL is enabled (T934842)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);
  let maxRightOffset = await getMaxRightOffset(dataGrid);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);

  // act
  await t.resizeWindow(700, 250);
  maxRightOffset = await getMaxRightOffset(dataGrid);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);

  // act
  await t.resizeWindow(600, 250);
  maxRightOffset = await getMaxRightOffset(dataGrid);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  rtlEnabled: true,
  columnWidth: 100,
}));

test('DataGrid should not reset its left scroll position on window resize when columnRenderingMode is virtual with fixed columns', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);
  await dataGrid.scrollTo({ x: 100 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(100);

  // act
  await t.resizeWindow(700, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(100);

  // act
  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(100);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[1].fixed = true;
    columns[48].fixed = true;
    columns[48].fixedPosition = 'right';
    columns[49].fixed = true;
    columns[49].fixedPosition = 'right';
  },
}));

test('DataGrid should not reset its right scroll position on window resize when columnRenderingMode is virtual with fixed columns (rtlEnabled)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);
  const maxHorizontalPosition = await getMaxRightOffset(dataGrid);
  const scrollLeft = maxHorizontalPosition - 100;
  await dataGrid.scrollTo({ x: scrollLeft });

  // assert
  await t
    .expect(await getRightScrollOffset(dataGrid)).eql(100);

  // act
  await t.resizeWindow(700, 250);

  // assert
  await t
    .expect(await getRightScrollOffset(dataGrid)).eql(100);

  // act
  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(await getRightScrollOffset(dataGrid)).eql(100);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  columnWidth: 100,
  rtlEnabled: true,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  customizeColumns(columns) {
    columns[0].fixedPosition = 'right';
    columns[0].fixed = true;
    columns[1].fixedPosition = 'right';
    columns[1].fixed = true;
    columns[48].fixed = true;
    columns[49].fixed = true;
  },
}));

test('DataGrid should not reset its top scroll position after cell modification with master-detail', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element);
  await dataGrid.scrollTo({ y: 220 });
  const scrollTop = await dataGrid.getScrollTop();
  await t
    .click(dataGrid.getDataRow(1).getCommandCell(0).element)
    .click(dataGrid.getDataCell(2, 1).element)
    .typeText(dataGrid.getDataCell(2, 1).element, 'new_value')
    .pressKey('Tab');
  // assert
  const newScrollTop = await dataGrid.getScrollTop();
  await t.expect(Math.abs(scrollTop - newScrollTop) < 2).ok(`ScrollTop ${scrollTop} changes after editing to ${newScrollTop}`);
}).before(async () => createWidget('dxDataGrid', {
  height: 300,
  dataSource: [{ FirstName: 'A', LastName: 'B' }, { FirstName: 'C', LastName: 'D' }],
  editing: {
    allowUpdating: true,
    mode: 'cell',
  },
  masterDetail: {
    enabled: true,
    template: (container): void => {
      $('<div>')
        .css('height', '200px')
        .appendTo(container);
    },
  },
}));

test('Ungrouping after grouping should work correctly if row rendering mode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await dataGrid.scrollTo({ top: 500 });
  await dataGrid.apiColumnOption('group', 'groupIndex', 0);
  let visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(8)
    .expect(visibleRows[0].rowType)
    .eql('group')
    .expect(visibleRows[0].key)
    .eql(['group1'])
    .expect(visibleRows[7].rowType)
    .eql('group')
    .expect(visibleRows[7].key)
    .eql(['group8']);

  // act
  await dataGrid.apiColumnOption('group', 'groupIndex', 'undefined');

  // assert
  await t
    .expect(groupRow.exists)
    .notOk();

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows[0].rowType)
    .eql('data')
    .expect(visibleRows[0].key)
    .eql(1);
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 1; i <= 25; i += 1) {
      const groupIndex = (i % 8) + 1;
      items.push({
        id: i,
        group: `group${groupIndex}`,
      });
    }
    return items;
  };
  return createWidget('dxDataGrid', {
    height: 400,
    loadingTimeout: null,
    keyExpr: 'id',
    dataSource: getItems(),
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
      updateTimeout: 0,
      useNative: false,
    },
    grouping: {
      autoExpandAll: false,
    },
    groupPanel: {
      visible: true,
    },
    paging: {
      pageSize: 10,
    },
  });
});

test('Scroll position after grouping when RTL (T388508)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(300);

  // act
  await dataGrid.scrollTo({ x: 100 });
  const scrollRight = await dataGrid.getScrollRight();
  await dataGrid.apiColumnOption('field1', 'groupIndex', 0);

  // assert
  await t
    .expect(groupRow.exists)
    .ok();

  const visibleRows = await dataGrid.apiGetVisibleRows();
  const scrollRightAfterGrouping = await dataGrid.getScrollRight();

  // assert
  await t
    .expect(visibleRows[0].rowType)
    .eql('group')
    .expect(Math.floor(scrollRightAfterGrouping))
    .eql(Math.floor(scrollRight));
}).before(async () => createWidget('dxDataGrid', {
  width: 200,
  rtlEnabled: true,
  columns: [
    { dataField: 'field1', width: 100 },
    { dataField: 'field2', width: 100 },
    { dataField: 'field3', width: 100 },
    { dataField: 'field4', width: 100 },
    { dataField: 'field5', width: 100 },
  ],
  dataSource: [{
    field1: '1',
    field2: '2',
    field3: '3',
    field4: '4',
  }],
}));

test('Header container should have padding-right after expanding the master row with a detail grid when using native scrolling (T1004507)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  async function getRightPadding(): Promise<number> {
    const padding = await dataGrid.getHeaders().element.getStyleProperty('padding-right');
    return parseFloat(padding);
  }

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element);

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isExpanded).ok();

  // act
  await dataGrid.scrollTo({ x: 180 });
  await dataGrid.scrollTo({ x: 210 });
  const scrollBarWidth = await dataGrid.getScrollbarWidth(false);

  // assert
  await t
    .expect(await getRightPadding())
    .eql(scrollBarWidth)
    .expect(await takeScreenshot('grid-column-lines-alignment-master-grid-horizontal-scrolling.png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  width: 150,
  height: 300,
  columnMinWidth: 100,
  dataSource: [{
    id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
  }],
  keyExpr: 'id',
  columns: ['field1', 'field2', 'field3'],
  scrolling: {
    useNative: true,
  },
  masterDetail: {
    enabled: true,
    template(): any {
      return ($('<div>') as any).dxDataGrid({
        dataSource: [
          {
            id: 0, field1: 'test11', field2: 'test21', field3: 'test31',
          },
          {
            id: 1, field1: 'test12', field2: 'test22', field3: 'test32',
          },
          {
            id: 2, field1: 'test13', field2: 'test23', field3: 'test33',
          },
          {
            id: 3, field1: 'test14', field2: 'test24', field3: 'test34',
          },
          {
            id: 4, field1: 'test15', field2: 'test25', field3: 'test35',
          },
        ],
        columns: ['field1', 'field2', 'field3'],
        columnMinWidth: 100,
        keyExpr: 'id',
      });
    },
  },
}));

test('New virtual mode. A detail row should be rendered when the last master row is expanded', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await dataGrid.scrollTo({ top: 3300 });
  await t
    .wait(300)
    .click(dataGrid.getDataRow(99).getCommandCell(0).element);

  const visibleRows = await dataGrid.apiGetVisibleRows();

  const penultimateRow = visibleRows[visibleRows.length - 2];
  const lastRow = visibleRows[visibleRows.length - 1];

  // assert
  await t
    .expect(penultimateRow.rowType)
    .eql('data')
    .expect(penultimateRow.key)
    .eql(100)
    .expect(lastRow.rowType)
    .eql('detail')
    .expect(lastRow.key)
    .eql(100);
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
      });
    }
    return items;
  };
  return createWidget('dxDataGrid', {
    height: 350,
    dataSource: getItems(),
    keyExpr: 'ID',
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
      legacyMode: false,
    },
    masterDetail: {
      enabled: true,
    },
  });
});

test('New virtual mode. An adaptive row should be rendered when the last row is expanded', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await dataGrid.scrollTo({ top: 3300 });
  await t
    .wait(300)
    .click(dataGrid.getDataRow(99).getCommandCell(3).element);

  const visibleRows = await dataGrid.apiGetVisibleRows();

  const penultimateRow = visibleRows[visibleRows.length - 2];
  const lastRow = visibleRows[visibleRows.length - 1];

  // assert
  await t
    .expect(penultimateRow.rowType)
    .eql('data')
    .expect(penultimateRow.key)
    .eql(100)
    .expect(lastRow.rowType)
    .eql('detailAdaptive')
    .expect(lastRow.key)
    .eql(100);
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
        Description: `Description ${i + 1}`,
      });
    }
    return items;
  };
  return createWidget('dxDataGrid', {
    height: 350,
    width: 300,
    dataSource: getItems(),
    keyExpr: 'ID',
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
      legacyMode: false,
      useNative: false,
    },
    columnHidingEnabled: true,
    customizeColumns(columns) {
      columns[0].width = 250;
    },
  });
});

test.skip('New virtual mode. Virtual rows should not be in view port', async (t) => {
  const dataGrid = new DataGrid('#container');
  const getVirtualRowInfo = ClientFunction(() => {
    const result: any = {};
    const $virtualRows = $((window as any).widget.element()).find('.dx-virtual-row');

    result.count = $virtualRows.length;
    $virtualRows.each((index, el) => {
      const $element = $(el);
      result[index] = {
        top: $element.position().top,
        height: $element.height(),
      };
    });

    return result;
  });
  const getVisibleRowsHeight = ClientFunction(() => {
    let result = 0;
    const $rows = $((window as any).widget.element()).find('.dx-data-row');

    $rows.each((_, el) => {
      result += $(el).height();
    });

    return result;
  });

  await t.wait(350);
  let visibleRows = await dataGrid.apiGetVisibleRows();
  let virtualRowInfo = await getVirtualRowInfo();
  let visibleRowsHeight = await getVisibleRowsHeight();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(20)
    .expect(virtualRowInfo.count)
    .eql(1)
    .expect(virtualRowInfo[0].top >= visibleRowsHeight)
    .ok();

  // act
  await dataGrid.scrollTo({ top: 1580 });
  await t.wait(300);
  await dataGrid.scrollTo({ top: 3250 });
  await t.wait(600);

  visibleRows = await dataGrid.apiGetVisibleRows();
  virtualRowInfo = await getVirtualRowInfo();
  const topScrollPosition = await dataGrid.getScrollTop();
  const topVirtualRowPosition = virtualRowInfo[0].top as number;
  const virtualRowHeight = virtualRowInfo[0].height as number;
  const bottomVirtualRowPosition = topVirtualRowPosition + virtualRowHeight;

  // assert
  await t
    .expect(visibleRows.length)
    .eql(10)
    .expect(visibleRows[0].key)
    .eql(91)
    .expect(virtualRowInfo.count)
    .eql(1)
    .expect(bottomVirtualRowPosition <= topScrollPosition)
    .ok();

  // act
  await dataGrid.scrollTo({ top: 1580 });
  await t.wait(300);
  await dataGrid.scrollTo({ top: 0 });
  await t.wait(300);

  visibleRows = await dataGrid.apiGetVisibleRows();
  virtualRowInfo = await getVirtualRowInfo();
  visibleRowsHeight = await getVisibleRowsHeight();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(10)
    .expect(visibleRows[0].key)
    .eql(1)
    .expect(virtualRowInfo.count)
    .eql(1)
    .expect(virtualRowInfo[0].top >= visibleRowsHeight)
    .ok();
}).before(async () => {
  const initStore = ClientFunction(() => {
    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 100; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
        });
      }
      return items;
    };

    (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
      key: 'id',
      data: getItems(),
    });
  });

  await initStore();

  return createWidget('dxDataGrid', {
    dataSource: {
      key: 'ID',
      load(loadOptions) {
        return new Promise((resolve) => {
          setTimeout(() => {
            (window as any).myStore.load(loadOptions).done((data) => {
              resolve(data);
            });
          }, 300);
        });
      },
      totalCount(loadOptions) {
        return (window as any).myStore.totalCount(loadOptions);
      },
    },
    height: 300,
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
      legacyMode: false,
    },
  });
});
