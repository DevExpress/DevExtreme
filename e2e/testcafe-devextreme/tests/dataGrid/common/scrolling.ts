import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClassNames } from 'devextreme-testcafe-models/dataGrid/classNames';
import type { DataGridScrollMode } from 'devextreme/ui/data_grid';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { salesApiMock } from './apiMocks/salesApiMock';
import { testScreenshot } from '../../../helpers/themeUtils';
import { Themes } from '../../../helpers/themes';

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

function getData(rowCount: number, colCount: number): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j += 1) {
      item[`field_${j}`] = `val_${i}_${j}`;
    }
    items.push(item);
  }

  return items;
}

async function getTestLoadCount(): Promise<number> {
  return ClientFunction(() => (window as any).testLoadCount as number)();
}

fixture.disablePageReloads`Scrolling`
  .page(url(__dirname, '../../container.html'));

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
  await dataGrid.scrollTo(t, { x: 100 });

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
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
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
  await dataGrid.scrollTo(t, { x: scrollLeft });

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
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
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
  await dataGrid.scrollTo(t, { y: 220 });
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

// Theme dependent test
test('Ungrouping after grouping should work correctly if row rendering mode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');
  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.scrollTo(t, { top: 500 });
  let visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows[0].rowType)
    .eql('data')
    .expect(visibleRows[0].key)
    .notEql(1);

  // act
  await dataGrid.apiColumnOption('group', 'groupIndex', 0);
  await t.expect(dataGrid.isReady()).ok();
  visibleRows = await dataGrid.apiGetVisibleRows();

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
  await t.expect(dataGrid.isReady()).ok();
  const groupRow = dataGrid.getGroupRowSelector();

  // assert
  await t
    .expect(groupRow.exists)
    .notOk();

  visibleRows = await dataGrid.apiGetVisibleRows();

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
    height: 500,
    keyExpr: 'id',
    dataSource: getItems(),
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
      // @ts-expect-error private option
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

  await t
    .expect(dataGrid.isReady())
    .ok();

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(300);

  // act
  await dataGrid.scrollTo(t, { x: 100 });
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

test('Header container should have padding-right after expanding the master row with a detail grid when using native scrolling (T1004507)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();

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
  await dataGrid.scrollTo(t, { x: 180 });
  await dataGrid.scrollTo(t, { x: 210 });
  const scrollBarWidth = await dataGrid.getScrollbarWidth(false);

  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(await getRightPadding())
    .eql(scrollBarWidth);

  await testScreenshot(t, takeScreenshot, 'grid-column-lines-alignment-master-grid-horizontal-scrolling.png', { element: '#container' });
  await t
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
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  async function getRightPadding(): Promise<number> {
    const padding = await dataGrid.getHeaders().element.getStyleProperty('padding-right');
    return parseFloat(padding);
  }

  // act
  const scrollBarWidth = await dataGrid.getScrollbarWidth(false);

  await dataGrid.scrollBy(t, { y: 20 });

  // assert
  await t
    .expect(await getRightPadding())
    .eql(scrollBarWidth)

    .expect(await dataGrid.getScrollTop())
    .eql(20);

  await testScreenshot(t, takeScreenshot, 'grid-header-row-scrollbar-padding.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    $('#container').css('max-height', '200px');
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
  const ROWS_AMOUNT = 100;
  const dataGrid = new DataGrid('#container');
  const dataRowSelector = `.${ClassNames.dataRow}`;

  const getFirstVisibleRowHeight = ClientFunction(() => $((window as any).widget.element())
    .find(dataRowSelector)
    .first()
    .height() ?? 0, { dependencies: { dataRowSelector } });

  await t.expect(dataGrid.isReady()).ok();

  // act
  const firstVisibleRowHeight = await getFirstVisibleRowHeight();
  const scrollTopOffset = ROWS_AMOUNT * firstVisibleRowHeight;

  await dataGrid.scrollTo(t, { top: scrollTopOffset });
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
    .eql(ROWS_AMOUNT)
    .expect(lastRow.rowType)
    .eql('detail')
    .expect(lastRow.key)
    .eql(ROWS_AMOUNT);
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
      // @ts-expect-error private option
      legacyMode: false,
    },
    masterDetail: {
      enabled: true,
    },
  });
});

test('New virtual mode. An adaptive row should be rendered when the last row is expanded', async (t) => {
  const ROWS_AMOUNT = 100;
  const dataGrid = new DataGrid('#container');
  const dataRowSelector = `.${ClassNames.dataRow}`;

  const getFirstVisibleRowHeight = ClientFunction(() => $((window as any).widget.element())
    .find(dataRowSelector)
    .first()
    .height() ?? 0, { dependencies: { dataRowSelector } });

  await t.expect(dataGrid.isReady()).ok();

  // act
  const firstVisibleRowHeight = await getFirstVisibleRowHeight();
  const scrollTopOffset = ROWS_AMOUNT * firstVisibleRowHeight;

  await dataGrid.scrollTo(t, { top: scrollTopOffset });
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
    .eql(ROWS_AMOUNT)
    .expect(lastRow.rowType)
    .eql('detailAdaptive')
    .expect(lastRow.key)
    .eql(ROWS_AMOUNT);
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
      // @ts-expect-error private option
      legacyMode: false,
      useNative: false,
    },
    columnHidingEnabled: true,
    customizeColumns(columns) {
      columns[0].width = 250;
    },
  });
});

// Theme dependent test
test('New virtual mode. Virtual rows should not be in view port', async (t) => {
  const dataGrid = new DataGrid('#container');
  const virtualRowSelector = `.${ClassNames.virtualRow}`;
  const dataRowSelector = `.${ClassNames.dataRow}`;
  const getVirtualRowInfo = ClientFunction(() => {
    const result: any = {};
    const $virtualRows = $((window as any).widget.element()).find(virtualRowSelector);

    result.count = $virtualRows.length;
    $virtualRows.each((index, el) => {
      const $element = $(el);
      result[index] = {
        top: $element.position().top,
        height: $element.height(),
      };
    });

    return result;
  }, { dependencies: { virtualRowSelector } });
  const getVisibleRowsHeight = ClientFunction(() => {
    let result = 0;
    const $rows = $((window as any).widget.element()).find(dataRowSelector);

    $rows.each((_, el) => {
      result += $(el).height() ?? 0;
    });

    return result;
  }, { dependencies: { dataRowSelector } });

  await t.wait(350);
  let visibleRows = await dataGrid.apiGetVisibleRows();
  let virtualRowInfo = await getVirtualRowInfo();
  let visibleRowsHeight = await getVisibleRowsHeight();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(16)
    .expect(virtualRowInfo.count)
    .eql(1)
    .expect(virtualRowInfo[0].top >= visibleRowsHeight)
    .ok();

  // act
  await dataGrid.scrollTo(t, { top: 2520 });
  await t.wait(300);
  await dataGrid.scrollTo(t, { top: 4580 });
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
    .eql(8)
    .expect(visibleRows[0].key)
    .eql(93)
    .expect(virtualRowInfo.count)
    .eql(1)
    .expect(bottomVirtualRowPosition <= topScrollPosition)
    .ok();

  // act
  await dataGrid.scrollTo(t, { top: 2520 });
  await t.wait(300);
  await dataGrid.scrollTo(t, { top: 0 });
  await t.wait(300);

  visibleRows = await dataGrid.apiGetVisibleRows();
  virtualRowInfo = await getVirtualRowInfo();
  visibleRowsHeight = await getVisibleRowsHeight();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(8)
    .expect(visibleRows[0].key)
    .eql(1)
    .expect(virtualRowInfo.count)
    .eql(1)
    .expect(virtualRowInfo[0].top >= visibleRowsHeight)
    .ok();
}).before(async (t) => {
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

  await initStore.with({ boundTestRun: t })();

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
    } as any, // todo check
    height: 420,
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
      // @ts-expect-error private option
      legacyMode: false,
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).myStore;
  })();
});

test('New row should be rendered at the top when grid is scrolled in virtual scrolling', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await dataGrid.scrollTo(t, { top: 2350 });

  const topVisibleRowData = await dataGrid.apiGetTopVisibleRowData();

  // assert
  await t
    .expect(topVisibleRowData.ID)
    .eql(49);

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
    $('#container').css('max-height', '440px');
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

test.meta({ browserSize: [800, 700] })('New mode. Rows should be rendered properly when rowRenderingMode is virtual and max height (T1054920)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

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

  await dataGrid.scrollTo(t, { top: 2000 });

  // act
  await t
    .expect(dataGrid.isVirtualRowIntersectViewport())
    .notOk();

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(13);

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
}).before(async () => {
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

// Theme dependent test
test.meta({ browserSize: [800, 800] })('Rows are rendered properly when window content is scrolled (T1070388)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

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
  await scrollWindowTo(3100);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(3100)
    .wait(300);

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(19)
    .expect(visibleRows[0].key > 20)
    .ok()
    .expect(visibleRows[18].key > 35)
    .ok();

  // act
  await scrollWindowTo(6000);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(6000);

  // act
  await scrollWindowTo(3100);

  // assert
  await t
    .expect(getWindowScrollPosition())
    .eql(3100)
    .wait(300);

  visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(19)
    .expect(visibleRows[0].key > 20)
    .ok()
    .expect(visibleRows[18].key > 35)
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
}).before(async () => {
  const renderContent = ClientFunction(() => {
    for (let i = 0; i < 100; i += 1) {
      $('body').prepend('<br class="myBr" />');
    }
    for (let i = 0; i < 100; i += 1) {
      $('body').append('<br class="myBr" />');
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
}).after(async () => ClientFunction(() => {
  $('.myBr').remove();
})());

// T1129252
test('The data should display correctly after changing the dataSource and focusedRowIndex options when scroll position is at the end', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scrollToBottom = async () => {
    await dataGrid.scrollTo(t, { y: 100000 });
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
    .ok();

  await testScreenshot(t, takeScreenshot, 'grid-virtual-scrolling-T1129252.png', { element: '#container' });
  await t
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

// T1166649
test.meta({ browserSize: [800, 800] })('The scroll position of a fixed table should be synchronized with the main table when fast scrolling to the end', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scrollbarVerticalThumbTrack = dataGrid.getScrollBarThumbTrack('vertical');

  // act
  await t
    .hover(scrollbarVerticalThumbTrack)
    .drag(scrollbarVerticalThumbTrack, 0, 600)
    .wait(1000);

  await testScreenshot(t, takeScreenshot, 'grid-virtual-scrolling_with_fixed_columns-T1166649.png', { element: 'tr[aria-rowindex="999"]' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
  // assert
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [...new Array(1000)].map((_, index) => ({ id: index, text: `item ${index}` })),
  keyExpr: 'id',
  showRowLines: true,
  height: 600,
  scrolling: {
    mode: 'virtual',
    useNative: false,
  },
  editing: {
    mode: 'row',
    allowUpdating: true,
    allowDeleting: true,
    useIcons: true,
  },
  columnFixing: {
    enabled: true,
    // @ts-expect-error private option
    legacyMode: true,
  },
  columns: [{
    type: 'buttons',
    fixedPosition: 'left',
  }, 'id', 'text'],
}));

// T1089634
test.meta({ browserSize: [800, 800] })('The page should not be changed when hiding/showing the grid view after the data has been edited', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.scrollTo(t, { y: 500 });

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  await testScreenshot(t, takeScreenshot, 'T1089634-virtual-scrolling-1.png');

  // act
  await dataGrid.apiEditCell(5, 1);
  await dataGrid.apiCellValue(5, 1, 'test');

  // act - simulate click on button
  await dataGrid.hide();
  await t.click(Selector('body'));
  await t.wait(100);

  await testScreenshot(t, takeScreenshot, 'T1089634-virtual-scrolling-2.png');

  // act
  await dataGrid.show();

  await testScreenshot(t, takeScreenshot, 'T1089634-virtual-scrolling-3.png');

  // assert
  const testLoadCount = await getTestLoadCount();

  await t
    .expect(testLoadCount)
    .eql(1)
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).testLoadCount = 0;

    $('body').css({
      minHeight: '100px',
      minWidth: '100px',
    });
  })();

  return createWidget('dxDataGrid', {
    height: 500,
    dataSource: {
      load() {
        ((window as any).testLoadCount as number) += 1;

        return new Array(200).fill(null).map((_, index) => ({ id: index, field1: `item1 ${index}`, field2: `item2 ${index}` }));
      },
      key: 'id',
    } as any, // todo check
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
    scrolling: {
      mode: 'virtual',
    },
  });
}).after(async () => ClientFunction(() => {
  $('body').css({
    minHeight: '',
    minWidth: '',
  });
  delete (window as any).testLoadCount;
})());

fixture.disablePageReloads`Remote Scrolling`
  .page(url(__dirname, '../../container.html'));

test('Scroll to the bottom after expand several group', async (t) => {
  const dataGrid = new DataGrid('#container');

  const scrollToBottom = async () => {
    await dataGrid.scrollTo(t, { y: 100000 });
    await t.expect(dataGrid.isReady()).ok();
  };

  // act
  await t.expect(dataGrid.hasScrollable()).ok();
  await scrollToBottom();
  await dataGrid.apiExpandRow(['Contoso York Store']);
  await dataGrid.apiExpandRow(['Contoso York Store', 'Audio']);
  await scrollToBottom();
  await dataGrid.scrollBy(t, { y: -1 });
  await t.expect(dataGrid.isReady()).ok();

  // assert
  const visibleRows = await dataGrid.apiGetVisibleRows();

  if (!visibleRows.length) {
    await t
      .expect(visibleRows[0].key)
      .within(897075, 932043);
  }
})
  .before(async (t) => {
    await t.addRequestHooks(salesApiMock);
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
    await t.removeRequestHooks(salesApiMock);
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
}).before(async (t) => {
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

  await initStore.with({ boundTestRun: t })();

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
    } as any, // todo check
    height: 500,
    remoteOperations: true,
    scrolling: {
      mode: 'virtual',
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).myStore;
  })();
});

test.meta({ runInTheme: Themes.genericLight })('New virtual mode. Navigation to the last row if new row is added (T1069849)', async (t) => {
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
  test.meta({ runInTheme: Themes.genericLight })(`New virtual mode. Virtual rows should not be in view port after switching to the last page with row numbers less than page size (useNative = ${useNative}) (T1085775)`, async (t) => {
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
  }).before(async (t) => {
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

    await initStore.with({ boundTestRun: t })();

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
      } as any, // todo check
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
  }).after(async () => {
    await ClientFunction(() => {
      delete (window as any).myStore;
    })();
  });
});

// T1284002
test('Last group should not disappear after collapsing another subgroup with virtual scrolling, local grouping and remote operations (T1284002)', async (t) => {
  const dataGrid = new DataGrid('#container');
  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiCollapseRow(['Cell phones', 'Touch Screen Phones']);

  const visibleRows = await dataGrid.apiGetVisibleRows();
  const dataRows = visibleRows.filter((r) => r.rowType === 'data');

  await t.expect(dataRows.length).eql(2, 'Computers category should still show 2 data rows');
}).before(async () => createWidget('dxDataGrid', {
  height: 500,
  dataSource: [
    {
      Id: 1, Category: 'Cell phones', Subcategory: 'Touch Screen Phones', Store: 'Europe Online Store', Date: '2024-01-10',
    },
    {
      Id: 2, Category: 'Cell phones', Subcategory: 'Touch Screen Phones', Store: 'Europe Online Store', Date: '2024-02-15',
    },
    {
      Id: 3, Category: 'Computers', Subcategory: 'Computers Accessories', Store: 'North America Reseller', Date: '2024-03-20',
    },
    {
      Id: 4, Category: 'Computers', Subcategory: 'Computers Accessories', Store: 'North America Online Store', Date: '2024-04-25',
    },
  ],
  keyExpr: 'Id',
  remoteOperations: {
    filtering: true,
    sorting: true,
    paging: true,
  },
  scrolling: {
    mode: 'virtual',
  },
  grouping: {
    autoExpandAll: true,
  },
  columns: [
    { dataField: 'Id', dataType: 'number' },
    { dataField: 'Category', dataType: 'string', groupIndex: 0 },
    { dataField: 'Subcategory', dataType: 'string', groupIndex: 1 },
    { dataField: 'Store', dataType: 'string', groupIndex: 2 },
    { dataField: 'Date', dataType: 'date', format: 'yyyy-MM-dd' },
  ],
}));

// T1152498
['infinite', 'virtual'].forEach((scrollingMode: DataGridScrollMode) => {
  test(`${scrollingMode} scrolling - the markup should be correct for continuous scrolling when there is a fixed column with cellTemplate (React)`, async (t) => {
    // arrange
    const dataGrid = new DataGrid('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.expect(dataGrid.isReady()).ok();

    // act
    await dataGrid.scrollTo(t, { y: 200 });
    await dataGrid.scrollTo(t, { y: 600 });
    await t.expect(dataGrid.isReady()).ok();

    // assert
    await testScreenshot(t, takeScreenshot, `grid-${scrollingMode}-scrolling-T1152498.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await createWidget('dxDataGrid', {
      dataSource: [...new Array(500)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      height: 440,
      width: 800,
      renderAsync: false,
      templatesRenderAsynchronously: true,
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      customizeColumns(columns) {
        columns[0].width = 70;
        columns[0].fixed = true;
        columns[0].cellTemplate = '#test';
      },
      scrolling: {
        mode: scrollingMode,
      },
    });

    const dataGrid = new DataGrid('#container');
    await t.expect(dataGrid.isReady()).ok();

    // simulating async rendering in React
    await ClientFunction(() => {
      const dataGridInstance = ($('#container') as any).dxDataGrid('instance');

      // eslint-disable-next-line no-underscore-dangle
      dataGridInstance.getView('rowsView')._templatesCache = {};

      // eslint-disable-next-line no-underscore-dangle
      dataGridInstance._getTemplate = () => ({
        render(options) {
          setTimeout(() => {
            ($(options.container) as any).append(($('<div/>') as any).text(options.model.value));
            options.deferred?.resolve();
          }, 1000);
        },
      });

      dataGridInstance.repaint();
    })();
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

  await dataGrid.scrollTo(t, { y: 500 });
  await dataGrid.scrollTo(t, { y: 0 });

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

// T1136896
test.meta({ browserSize: [800, 200] })('Editing buttons should rerender correctly after scrolling if repaintChangesOnly=true', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await dataGrid.scrollBy(t, { top: 1000 });

  await dataGrid.apiEditRow(3); // row with id=12

  await dataGrid.scrollBy(t, { top: -1000 });
  await dataGrid.scrollBy(t, { top: 1000 });

  await dataGrid.scrollBy(t, { top: -1 });

  await testScreenshot(t, takeScreenshot, 'T1136896-virtual-scrolling_editing-buttons.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const data = [...new Array(14)].map((_, i) => ({
    id: i + 1,
  }));

  return createWidget('dxDataGrid', {
    height: 200,
    // @ts-expect-error private option
    loadingTimeout: null,
    dataSource: data,
    keyExpr: 'id',
    scrolling: {
      mode: 'virtual',
    },
    editing: {
      mode: 'row',
      allowUpdating: true,
      allowDeleting: true,
    },
    repaintChangesOnly: true,
  });
});

// T1181439
test('Restoring focus on re-rendering should be done without unexpected scrolling to the focused element', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollBy(t, { left: 1000 });

  await t.click(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(19).element);

  await dataGrid.scrollBy(t, { left: 0 });
  await dataGrid.scrollBy(t, { top: 50 });

  await t.expect(dataGrid.getScrollLeft()).eql(0);
}).before(async () => {
  const data = [...new Array(30)].map((_, i) => ({
    id: i + 1,
  }));

  return createWidget('dxDataGrid', {
    dataSource: data,
    scrolling: {
      mode: 'virtual',
      useNative: true,
    },
    height: 440,
    width: 600,
    columns: [...new Array(20)].map(() => ({
      dataField: 'id',
      width: 75,
    })),
    masterDetail: { enabled: true },
  });
});

// T1194796
test('The row alternation should display correctly when grouping and virtual scrolling are enabled', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.hasScrollable())
    .ok();

  // act
  await dataGrid.scrollTo(t, { y: 100 });
  await dataGrid.scrollTo(t, { y: 200 });
  await dataGrid.scrollTo(t, { y: 300 });
  await dataGrid.scrollTo(t, { y: 400 });

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  await testScreenshot(t, takeScreenshot, 'T1194796-row-alternation-with-grouping-and-virtual-scrolling.png', { element: '#container' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', () => ({
  dataSource: new Array(20).fill(null).map((_, index) => ({
    groupField: index < 2 ? index : 2,
    field: `test${index}`,
  })),
  height: 400,
  paging: {
    pageSize: 5,
  },
  columns: [{ dataField: 'groupField', groupIndex: 0 }, 'field'],
  rowAlternationEnabled: true,
  grouping: { autoExpandAll: true },
  scrolling: { mode: 'virtual', useNative: false },
})));

test('DataGrid - Gray boxes appear when the push method is used to remove rows in infinite scrolling mode (T1240079)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const data = [
    { id: 1, text: 'text 1' },
    { id: 2, text: 'text 2' },
  ];
  const changes = data.map((item) => ({
    type: 'remove',
    key: item.id,
  }));

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiPush(changes);
  await testScreenshot(t, takeScreenshot, 'T1240079.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', () => {
    const data = [
      { id: 1, text: 'text 1' },
      { id: 2, text: 'text 2' },
    ];
    const dataSource = {
      reshapeOnPush: true,
      store: new (window as any).DevExpress.data.CustomStore({
        key: 'id',
        loadMode: 'raw',
        load: () => Promise.resolve(data),
      }),
    };

    return {
      dataSource,
      showBorders: true,
      scrolling: {
        mode: 'infinite',
      },
      height: 300,
    };
  });
});

// T1262288 - Left to Right
test('DataGrid - Focused cell moves to the end of the table after horizontal scrolling', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .pressKey('left');

  await t.expect(dataGrid.getDataCell(0, 0).isFocused).ok();

  await dataGrid.scrollBy(t, { x: 1000 });
  await dataGrid.scrollBy(t, { x: -1000 });

  await t.expect(dataGrid.getDataCell(0, 0).isFocused).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(1, 20).map((item, index) => ({ ...item, id: index })),
  keyExpr: 'id',
  columnWidth: 100,
  showBorders: true,
  focusedRowEnabled: true,
  scrolling: {
    columnRenderingMode: 'virtual',
    mode: 'virtual',
    showScrollbar: 'always',
  },
  paging: {
    enabled: false,
  },
}));

// T1277214 - Right to Left
test('DataGrid - Scrolling position is reset to far right on an attempt to scroll left if the most right cell is focused using the keyboard', async (t) => {
  const dataGrid = new DataGrid('#container');
  await dataGrid.scrollTo(t, { x: 1000 });
  await t
    .click(dataGrid.getDataCell(0, 20).element)
    .pressKey('right');

  await t.expect(dataGrid.getDataCell(0, 20).isFocused).ok();

  await dataGrid.scrollBy(t, { x: -1000 });
  await dataGrid.scrollBy(t, { x: 1000 });

  await t.expect(dataGrid.getDataCell(0, 20).isFocused).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: getData(1, 20).map((item, index) => ({ ...item, id: index })),
  keyExpr: 'id',
  columnWidth: 100,
  showBorders: true,
  focusedRowEnabled: true,
  scrolling: {
    columnRenderingMode: 'virtual',
    mode: 'virtual',
    showScrollbar: 'always',
  },
  paging: {
    enabled: false,
  },
}));

// T1280020
test('DataGrid - The "row" parameter in the FocusedRowChanged event refers to a non-focused row if the grid height is small', async (t) => {
  const dataGrid = new DataGrid('#container');
  const otherContainer = Selector('#otherContainer');

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.apiOption('focusedRowKey', '2');
  await t.expect(otherContainer.innerText).eql('2');

  await dataGrid.apiOption('focusedRowKey', '0');
  await t.expect(otherContainer.innerText).eql('0');
}).before(async () => createWidget('dxDataGrid', {
  height: 70,
  dataSource: [
    { id: '0' },
    { id: '1' },
    { id: '2' },
  ],
  scrolling: { mode: 'virtual' },
  keyExpr: 'id',
  focusedRowEnabled: true,
  onFocusedRowChanged(e) {
    const data = e.row?.data;
    $('#otherContainer').text(data.id);
  },
}));

[true, false].forEach((nativeScroll) => {
  type TestCaseWindow = typeof window & { dataGridScrollableEventValues?: number[] };

  test(`Should not scroll back on top with virtual scrolling and adaptive master detail (nativeScroll: ${nativeScroll}) [T1278804]`, async (t) => {
    // NOTE: idx + 1 logic inside POM
    const adaptiveCellIdx = 101;
    const scrollValuesThreshold = 100;

    const dataGrid = new DataGrid('#container');
    const firstRow = dataGrid.getDataRow(0);
    const firstDataCell = firstRow.getDataCell(0);
    const adaptiveCell = firstRow.getCommandCell(adaptiveCellIdx);

    await t
      .click(firstDataCell.element)
      .click(adaptiveCell.element);

    await dataGrid
      .scrollTo(t, { y: 2000 });
    await t.wait(300);
    await dataGrid
      .scrollTo(t, { y: 1000 });
    await t.wait(300);

    const scrollOffsets = await t
      .eval(() => (window as TestCaseWindow).dataGridScrollableEventValues) as number[];

    const hasSmallScrollValues = scrollOffsets.some((offset) => offset < scrollValuesThreshold);
    await t.expect(hasSmallScrollValues).notOk();
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: getData(3, 100).map((item, idx) => ({ ...item, id: idx })),
      keyExpr: 'id',
      columnHidingEnabled: true,
      focusedRowEnabled: true,
      scrolling: {
        mode: 'virtual',
        useNative: nativeScroll,
      },
      onContentReady: ({ component }) => {
        const testWindow = window as TestCaseWindow;

        component.getScrollable().on('scroll', ({ scrollOffset: { top } }) => {
          if (!Array.isArray(testWindow.dataGridScrollableEventValues)) {
            testWindow.dataGridScrollableEventValues = [];
          }

          testWindow.dataGridScrollableEventValues.push(top);
        });
      },
      width: 400,
      height: 400,
    });
  }).after(async (t) => t.eval(() => {
    delete (window as TestCaseWindow).dataGridScrollableEventValues;
  }));
});

// T1270354
// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
[
  { useNative: true },
  { useNative: false },
].forEach(({ useNative }) => {
  test(`Virtual ${useNative ? 'native' : 'simulated'} scrolling - Scrolling to the bottom should work correctly when there is a grouping and a summary`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await dataGrid.scrollBy(t, { y: 10000 });

    await testScreenshot(t, takeScreenshot, `T1270354-virtual-${useNative ? 'native' : 'simulated'}-scrolling-with-grouping-and-summary.png`, { element: '#container' });
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  })
    .before(async () => {
      await createWidget('dxDataGrid', {
        dataSource: [...new Array(50)]
          .fill(null)
          .map((_, index) => ({
            id: index,
            machine: index,
            totalTime: 1,
          })),
        keyExpr: 'id',
        showBorders: true,
        height: 400,
        width: '100%',
        columns: [
          {
            dataField: 'machine',
            groupIndex: 0,
          }, {
            dataField: 'totalTime',
          },
        ],
        scrolling: {
          mode: 'virtual',
          useNative,
        },
        grouping: {
          autoExpandAll: false,
        },
        summary: {
          totalItems: [
            {
              column: 'totalTime',
              summaryType: 'sum',
            },
          ],
        },
      });
    });
});

fixture`Scrolling - warnings`
  .page(url(__dirname, '../../container.html'));

test('Warning should be thrown if scrolling is virtual and height is not specified', async (t) => {
  await t.wait(100);

  const consoleMessages = await t.getBrowserConsoleMessages();
  const warningExists = !!consoleMessages?.warn.find((message) => message.startsWith('W1025'));

  await t.expect(warningExists).ok();
}).before(async () => createWidget('dxDataGrid', {
  scrolling: {
    mode: 'virtual',
  },
  dataSource: [
    { column: 'value' },
  ],
}));

test('Warning should not be thrown if scrolling is virtual and height is specified with option', async (t) => {
  const consoleMessages = await t.getBrowserConsoleMessages();
  const warningExists = !!consoleMessages?.warn.find((message) => message.startsWith('W1025'));

  await t.expect(warningExists).notOk();
}).before(async () => createWidget('dxDataGrid', {
  scrolling: {
    mode: 'virtual',
  },
  dataSource: [
    { column: 'value' },
  ],
  height: 200,
}));

['height', 'max-height'].forEach((cssOption) => {
  test(`Warning should not be thrown if scrolling is virtual and height is specified with css (${cssOption})`, async (t) => {
    const consoleMessages = await t.getBrowserConsoleMessages();
    const warningExists = !!consoleMessages?.warn.find((message) => message.startsWith('W1025'));

    await t.expect(warningExists).notOk();
  }).before(async () => {
    await insertStylesheetRulesToPage(`
      #container {
        ${cssOption}: 200px;
      }
    `);

    await createWidget('dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [
        { column: 'value' },
      ],
    });
  });
});

// T1326460
test('Horizontal scrollbar should not appear when columnHidingEnabled is true and vertical scrollbar is present (T1326460)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  const scrollContainerWidth = await dataGrid.getScrollContainer().clientWidth;
  const rowsWidth = await dataGrid.getRows().nth(0).clientWidth;

  await t.expect(rowsWidth).eql(scrollContainerWidth);
}).before(async () => createWidget('dxDataGrid', {
  width: 552,
  height: 300,
  dataSource: getData(20, 10),
  columnHidingEnabled: true,
  columnWidth: 100,
  scrolling: {
    useNative: true,
  },
}));

test('navigateToRow should scroll to the correct row with virtual scrolling (T1220800)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const targetKey = 901;

  await t.expect(dataGrid.isReady()).ok();

  // act
  await dataGrid.apiNavigateToRow(targetKey);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataCells(0).nth(0).textContent)
    .eql(String(targetKey));

  const visibleRows = await dataGrid.apiGetVisibleRows();

  await t.expect(visibleRows[0].key).eql(targetKey, `Row with key ${targetKey} should be the first visible row after navigation`);
}).before(async (t) => {
  const initStore = ClientFunction(() => {
    const getItems = (): Record<string, unknown>[] => {
      const items: Record<string, unknown>[] = [];
      for (let i = 0; i < 1000000; i += 1) {
        items.push({
          ID: i + 1,
          Name: `Name ${i + 1}`,
          Description: `Text text text text text text text text text text ${i + 1}`,
        });
      }
      return items;
    };

    (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
      key: 'ID',
      data: getItems(),
    });
  });

  await initStore.with({ boundTestRun: t })();

  return createWidget('dxDataGrid', () => ({
    dataSource: new (window as any).DevExpress.data.CustomStore({
      key: 'ID',
      loadMode: 'raw',
      load(loadOptions) {
        return new Promise((resolve) => {
          (window as any).myStore.load(loadOptions).done((data) => {
            resolve(data);
          });
        });
      },
      totalCount() {
        return (window as any).myStore.totalCount();
      },
    }),
    width: 900,
    height: 250,
    wordWrapEnabled: true,
    showBorders: true,
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
      useNative: false,
    },
    paging: {
      pageSize: 20,
    },
    columns: [
      {
        dataField: 'ID',
        width: 90,
      },
      'Name',
      'Description',
    ],
  }));
});
