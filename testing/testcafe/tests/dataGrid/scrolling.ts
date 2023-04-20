import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { ClassNames as CLASS } from '../../model/dataGrid/classNames';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import createRequestMock from '../../helpers/apiRequestMock';

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
  .page(url(__dirname, '../container.html'))
  .beforeEach(async (t) => { await t.maximizeWindow(); });

safeSizeTest('DataGrid should set the scrollbar position to the left on resize (T934842)', async (t) => {
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

safeSizeTest('DataGrid should set the scrollbar position to the right on resize when RTL is enabled (T934842)', async (t) => {
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

safeSizeTest('DataGrid should not reset its left scroll position on window resize when columnRenderingMode is virtual with fixed columns', async (t) => {
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

safeSizeTest('DataGrid should not reset its right scroll position on window resize when columnRenderingMode is virtual with fixed columns (rtlEnabled)', async (t) => {
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
  const groupRow = dataGrid.getGroupRowSelector();

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
  const groupRow = dataGrid.getGroupRowSelector();

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

safeSizeTest('Header container should have padding-right after expanding the master row with a detail grid when using native scrolling (T1004507)', async (t) => {
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

  await t.resizeWindow(600, 250);

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

test('Header container should have padding-right if grid has max-height and scrollbar is shown', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  async function getRightPadding(): Promise<number> {
    const padding = await dataGrid.getHeaders().element.getStyleProperty('padding-right');
    return parseFloat(padding);
  }

  // act
  const scrollBarWidth = await dataGrid.getScrollbarWidth(false);

  await dataGrid.scrollBy({ y: 20 });

  // assert
  await t
    .expect(await getRightPadding())
    .eql(scrollBarWidth)

    .expect(await dataGrid.getScrollTop())
    .eql(20)

    .expect(await takeScreenshot('grid-header-row-scrollbar-padding.png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    $('#container').css('max-height', 200);
  })();

  return createWidget('dxDataGrid', {
    width: 400,
    showBorders: true,
    scrolling: {
      useNative: true,
    },
    dataSource: [
      {
        id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
      },
      {
        id: 1, field1: 'test1', field2: 'test2', field3: 'test3',
      },
      {
        id: 2, field1: 'test1', field2: 'test2', field3: 'test3',
      },
      {
        id: 3, field1: 'test1', field2: 'test2', field3: 'test3',
      },
      {
        id: 4, field1: 'test1', field2: 'test2', field3: 'test3',
      },
      {
        id: 5, field1: 'test1', field2: 'test2', field3: 'test3',
      },
    ],
    keyExpr: 'id',
    columns: ['field1', 'field2', 'field3'],
  });
});

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
    const $virtualRows = $((window as any).widget.element()).find(CLASS.virtualRow);

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
    const $rows = $((window as any).widget.element()).find(CLASS.dataRow);

    $rows.each((_, el) => {
      result += $(el).height() ?? 0;
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
      key: 'ID',
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

test('New row should be rendered at the top when grid is scrolled in virtual scrolling', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await dataGrid.scrollTo({ top: 2350 });

  const topVisibleRowData = await dataGrid.apiGetTopVisibleRowData();

  // assert
  await t
    .expect(topVisibleRowData.ID)
    .eql(70);

  await t
    .click(dataGrid.getHeaderPanel().getAddRowButton());

  // assert
  await t
    .expect(dataGrid.getDataRow(0).isInserted)
    .ok();
}).before(async () => {
  const generateData = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 130; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
      });
    }
    return items;
  };
  await ClientFunction(() => {
    $('#container').css('max-height', 440);
  })();
  await createWidget('dxDataGrid', {
    dataSource: generateData(),
    keyExpr: 'ID',
    scrolling: {
      mode: 'virtual',
    },
    paging: {
      pageSize: 10,
    },
    editing: {
      mode: 'row',
      allowAdding: true,
      newRowPosition: 'first',
    },
  });
});

safeSizeTest('New mode. Rows should be rendered properly when rowRenderingMode is virtual and max height (T1054920)', async (t) => {
  const dataGrid = new DataGrid('#container');

  let visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(10);

  // act
  await t
    .click(dataGrid.getPager().getPageSize(1).element);

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length > 0)
    .ok();

  await dataGrid.scrollTo({ top: 2000 });

  // act
  await t
    .expect(dataGrid.isVirtualRowIntersectViewport())
    .notOk();

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(18);

  // act
  await t
    .click(dataGrid.getPager().getPageSize(0).element);

  // act
  await t
    .expect(dataGrid.isVirtualRowIntersectViewport())
    .notOk();

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(10);
}, [800, 700]).before(async () => {
  const setMaxHeight = ClientFunction(() => {
    $('#container').css('max-height', '600px');
  });

  const getItems = (): any[] => {
    const items: any[] = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({
        id: i + 1,
        name: `Name ${i + 1}`,
      });
    }

    return items;
  };

  await setMaxHeight();

  return createWidget('dxDataGrid', {
    dataSource: getItems(),
    keyExpr: 'id',
    showBorders: true,
    remoteOperations: true,
    scrolling: {
      rowRenderingMode: 'virtual',
      useNative: false,
    },
    paging: {
      pageSize: 10,
    },
    pager: {
      visible: true,
      allowedPageSizes: [10, 'all'],
      showPageSizeSelector: true,
    },
  });
});

safeSizeTest('Rows are rendered properly when window content is scrolled (T1070388)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const scrollWindowTo = async (position: number) => {
    await ClientFunction(
      () => {
        (window as any).scroll({ top: position });
      },
      {
        dependencies: {
          position,
        },
      },
    )();
  };
  const getWindowScrollPosition = ClientFunction(() => (window as any).scrollY);

  let visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length > 0)
    .ok();

  // act
  await scrollWindowTo(3000);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(3000);

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(26)
    .expect(visibleRows[0].key > 30)
    .ok()
    .expect(visibleRows[25].key > 55)
    .ok();

  // act
  await scrollWindowTo(6000);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(6000);

  // act
  await scrollWindowTo(3000);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(3000);

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(26)
    .expect(visibleRows[0].key > 30)
    .ok()
    .expect(visibleRows[25].key > 55)
    .ok();

  // act
  await scrollWindowTo(0);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(0);

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length > 0)
    .ok();
}, [800, 800]).before(async () => {
  const renderContent = ClientFunction(() => {
    for (let i = 0; i < 100; i += 1) {
      $('body').prepend('<br/>');
    }
    for (let i = 0; i < 100; i += 1) {
      $('body').append('<br/>');
    }
  });

  const getItems = (): any[] => {
    const items: any[] = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({
        id: i + 1,
        name: `Name ${i + 1}`,
      });
    }

    return items;
  };

  await renderContent();

  return createWidget('dxDataGrid', {
    dataSource: getItems(),
    keyExpr: 'id',
    showBorders: true,
    scrolling: {
      mode: 'virtual',
    },
  });
});

// T1129252
test('The data should display correctly after changing the dataSource and focusedRowIndex options when scroll position is at the end', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scrollToBottom = async () => {
    await dataGrid.scrollTo({ y: 100000 });
    await t.expect(dataGrid.isReady()).ok();
  };

  await scrollToBottom();

  // act
  await dataGrid.option({
    focusedRowIndex: -1,
    dataSource: [...new Array(100)].map((_, index) => ({ id: index, text: `item ${index}` })),
  } as any);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(await takeScreenshot('grid-virtual-scrolling-T1129252.png', '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  height: 250,
  width: 200,
  keyExpr: 'id',
  dataSource: [...new Array(100)].map((_, index) => ({ id: index, text: `item ${index}` })),
  columnWidth: 100,
  focusedRowEnabled: true,
  focusedRowIndex: 99,
  scrolling: {
    mode: 'virtual',
  },
}));

fixture`Remote Scrolling`
  .page(url(__dirname, '../containerAspNet.html'))
  .beforeEach(async (t) => {
    await t.maximizeWindow();
  });

const generateData = (count) => {
  const groupCount = count / 100;
  const items: any = [];
  const padLength = groupCount.toString().length;
  let Id = 0;

  for (let i = 1; i <= groupCount; i += 1) {
    for (let j = 1; j <= 5; j += 1) {
      for (let k = 1; k <= 100; k += 1) {
        Id += 1;

        items.push({
          Id,
          ProductSubcategoryName: `Subcategory${i.toString().padStart(padLength, '0')}`,
          StoreName: `Store${i.toString().padStart(padLength, '0')}`,
          ProductCategoryName: `Category${i.toString().padStart(padLength, '0')}-${j.toString().padStart(3, '0')}`,
          ProductName: `Product${i.toString().padStart(padLength, '0')}`,
        });
      }
    }
  }
  return items;
};

const apiRequestMock = createRequestMock(generateData(100000));

test('Scroll to the bottom after expand several group', async (t) => {
  const dataGrid = new DataGrid('#container');

  const scrollToBottom = async () => {
    await dataGrid.scrollTo({ y: 100000 });
    await t.expect(dataGrid.isReady()).ok();
  };

  // act
  await t.expect(dataGrid.hasScrollable()).ok();
  await scrollToBottom();
  await dataGrid.apiExpandRow(['Store1000']);
  await dataGrid.apiExpandRow(['Store1000', 'Category1000-001']);
  await scrollToBottom();
  await dataGrid.scrollBy({ y: -1 });
  await t.expect(dataGrid.isReady()).ok();

  // assert
  const visibleRows = await dataGrid.apiGetVisibleRows();

  if (!visibleRows.length) {
    await t
      .expect(visibleRows[0].key)
      .within(499593, 499594);
  }
})
  .before(async (t) => {
    await t.addRequestHooks(apiRequestMock);
    return createWidget('dxDataGrid', () => ({
      width: 1000,
      height: 440,
      dataSource: (window as any).DevExpress.data.AspNet.createStore({
        key: 'Id',
        loadUrl: 'https://api/data',
      }),
      remoteOperations: { groupPaging: true },
      scrolling: {
        mode: 'virtual',
        useNative: false,
      },
      grouping: {
        autoExpandAll: false,
      },
      groupPanel: {
        visible: true,
      },
      showBorders: true,
      columns: [{
        dataField: 'Id',
        dataType: 'number',
        width: 75,
      }, {
        caption: 'Subcategory',
        dataField: 'ProductSubcategoryName',
        width: 150,
      }, {
        caption: 'Store',
        dataField: 'StoreName',
        groupIndex: 0,
        width: 150,
      }, {
        caption: 'Category',
        dataField: 'ProductCategoryName',
        groupIndex: 1,
        width: 120,
      }, {
        caption: 'Product',
        dataField: 'ProductName',
      }],
      loadingTimeout: 0,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(apiRequestMock);
  });

test('New virtual mode. Virtual rows should not be in view port after scrolling large data (T1043156)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const scrollbarVerticalThumbTrack = dataGrid.getScrollBarThumbTrack('vertical');

  // assert
  await t
    .expect(scrollbarVerticalThumbTrack.exists)
    .ok();

  // act
  await t
    .hover(scrollbarVerticalThumbTrack)
    .drag(scrollbarVerticalThumbTrack, 0, 400)
    .wait(1000);

  // assert
  await t
    .expect(dataGrid.isVirtualRowIntersectViewport())
    .notOk();

  // act
  await t
    .hover(scrollbarVerticalThumbTrack)
    .drag(scrollbarVerticalThumbTrack, 0, -200)
    .wait(1000);

  // assert
  await t
    .expect(dataGrid.isVirtualRowIntersectViewport())
    .notOk();
}).before(async () => {
  const initStore = ClientFunction(() => {
    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 1000000; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
        });
      }
      return items;
    };

    (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
      key: 'ID',
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
    height: 500,
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
    },
  });
});

test('New virtual mode. Navigation to the last row if new row is added (T1069849)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

  await t.click(addRowButton);
  await t.pressKey('Tab');
  await t.pressKey('Tab');
  await t.pressKey('Tab');
  await t.pressKey('Tab');

  const lastCell = dataGrid.getDataCell(3, 0);

  // assert
  await t
    .expect(lastCell.element.textContent)
    .eql('4');

  await t
    .expect(lastCell.isFocused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  height: 150,
  keyExpr: 'id',
  dataSource: [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ],
  editing: {
    mode: 'batch',
    allowAdding: true,
  },
  columns: ['id'],
  scrolling: {
    mode: 'virtual',
  },
}));

[false, true].forEach((useNative) => {
  test(`New virtual mode. Virtual rows should not be in view port after switching to the last page with row numbers less than page size (useNative = ${useNative}) (T1085775)`, async (t) => {
    const dataGrid = new DataGrid('#container');

    // assert
    await t
      .expect(dataGrid.isVirtualRowIntersectViewport())
      .notOk();

    for (let i = 0; i < 3; i += 1) {
    // act
      await t
        .click(dataGrid.getPager().getNavPage('4').element)
        .wait(3500);

      const visibleRows = await dataGrid.apiGetVisibleRows();

      // assert
      await t
        .expect(dataGrid.isVirtualRowIntersectViewport())
        .notOk()
        .expect(dataGrid.getPager().getNavPage('3').selected)
        .ok()
        .expect(visibleRows.length >= 12)
        .ok()
        .expect(visibleRows[0].key <= 54)
        .ok()
        .expect(visibleRows[visibleRows.length - 1].key)
        .eql(65);
    }
  }).before(async () => {
    const initStore = ClientFunction(() => {
      const getItems = (): Record<string, unknown>[] => {
        const items: Record<string, unknown>[] = [];
        for (let i = 0; i < 65; i += 1) {
          items.push({
            ID: i + 1,
            Name: `Name ${i + 1}`,
          });
        }
        return items;
      };

      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'ID',
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
            }, 500);
          });
        },
        totalCount(loadOptions) {
          return new Promise((resolve) => {
            setTimeout(() => {
              (window as any).myStore.totalCount(loadOptions).done((count) => {
                resolve(count);
              });
            }, 500);
          });
        },
      },
      height: 500,
      remoteOperations: true,
      scrolling: {
        mode: 'virtual',
        useNative,
      },
      pager: {
        visible: true,
      },
    });
  });
});

// T1152498
['infinite', 'virtual'].forEach((scrollingMode) => {
  safeSizeTest(`${scrollingMode} scrolling - the markup should be correct for continuous scrolling when there is a fixed column with cellTemplate (React)`, async (t) => {
  // arrange
    const dataGrid = new DataGrid('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // act
    await dataGrid.scrollTo({ y: 200 });
    await t.wait(100);
    await dataGrid.scrollTo({ y: 400 });
    await t.wait(300);

    // assert
    await t
      .expect(await takeScreenshot(`grid-${scrollingMode}-scrolling-T1152498.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [900, 600]).before(async (t) => {
    await createWidget('dxDataGrid', {
      dataSource: [...new Array(500)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      height: 440,
      width: 800,
      renderAsync: false,
      templatesRenderAsynchronously: true,
      customizeColumns(columns) {
        columns[0].width = 70;
        columns[0].fixed = true;
        columns[0].cellTemplate = '#test';
      },
      scrolling: {
        mode: scrollingMode,
      },
    });

    await t.wait(100);

    // simulating async rendering in React
    await ClientFunction(() => {
      const dataGrid = ($('#container') as any).dxDataGrid('instance');

      // eslint-disable-next-line no-underscore-dangle
      dataGrid.getView('rowsView')._templatesCache = {};

      // eslint-disable-next-line no-underscore-dangle
      dataGrid._getTemplate = () => ({
        render(options) {
          setTimeout(() => {
            ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
            options.deferred?.resolve();
          }, 200);
        },
      });

      dataGrid.repaint();
    })();

    await t.wait(300);
  });
});

test('Editors should keep changes after being scrolled out of sight (T1145698)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.wait(200)
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('ctrl+a')
    .typeText(dataGrid.getDataCell(0, 0).element, 'test')
    .click(dataGrid.getDataCell(1, 0).element)
    .pressKey('ctrl+a')
    .typeText(dataGrid.getDataCell(1, 0).element, 'test')
    .pressKey('enter');

  await dataGrid.scrollTo({ y: 500 });
  await dataGrid.scrollTo({ y: 0 });

  // assert
  await t.wait(300)
    .expect(dataGrid.apiGetCellValue(0, 0))
    .eql('test')
    .expect(dataGrid.apiGetCellValue(1, 0))
    .eql('test');
}).before(async () => {
  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 65; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
      });
    }
    return items;
  };

  return createWidget('dxDataGrid', {
    dataSource: getItems(),
    keyExpr: 'ID',
    columns: [{
      dataField: 'Name',
      showEditorAlways: true,
    }],
    scrolling: {
      mode: 'virtual',
    },
    height: 300,
    editing: {
      mode: 'batch',
      allowUpdating: true,
      allowAdding: true,
    },
  });
});
