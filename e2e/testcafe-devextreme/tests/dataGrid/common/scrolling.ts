import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import type { DataGridScrollMode } from 'devextreme/ui/data_grid';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { salesApiMock } from './apiMocks/salesApiMock';
import { testScreenshot } from '../../../helpers/themeUtils';
import { Themes } from '../../../helpers/themes';

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

async function getTestLoadOptions(): Promise<{ skip: number; take: number }[]> {
  return ClientFunction(
    () => (window as any).testLoadOptions as { skip: number; take: number }[],
  )();
}

fixture.disablePageReloads`Remote Scrolling`
  .page(url(__dirname, '../../container.html'));

test('Scroll to the bottom after expand several group', async (t) => {
  const dataGrid = new DataGrid('#container');

  const scrollToBottom = async () => {
    await dataGrid.scrollTo(t, { top: 100000 });
    await t.expect(dataGrid.isReady()).ok();
  };

  // act
  await t.expect(dataGrid.hasScrollable()).ok();
  await scrollToBottom();
  await dataGrid.apiExpandRow(['Contoso York Store']);
  await dataGrid.apiExpandRow(['Contoso York Store', 'Audio']);
  await scrollToBottom();
  await dataGrid.scrollBy(t, { top: -1 });
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
    await dataGrid.scrollTo(t, { top: 200 });
    await dataGrid.scrollTo(t, { top: 600 });
    await t
      .expect(dataGrid.isReady())
      .ok()
      .expect(dataGrid.isVirtualRowIntersectViewport())
      .notOk()
      .expect(dataGrid.getFixedDataCell(12, 0).element.textContent)
      .eql('12')
      .expect(dataGrid.getFixedDataCell(19, 0).element.textContent)
      .eql('19');

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

  await dataGrid.scrollTo(t, { top: 500 });
  await dataGrid.scrollTo(t, { top: 0 });

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
type ContentReadyWindow = typeof window & { contentReadyFired?: boolean };

test('Restoring focus on re-rendering should be done without unexpected scrolling to the focused element', async (t) => {
  const dataGrid = new DataGrid('#container');
  const resetContentReadyFlag = ClientFunction(() => {
    (window as ContentReadyWindow).contentReadyFired = false;
  });
  const isContentReadyFired = ClientFunction(
    () => (window as ContentReadyWindow).contentReadyFired,
  );

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.scrollBy(t, { left: 1000 });

  await resetContentReadyFlag();
  await t.click(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(19).element);
  await t.expect(isContentReadyFired()).ok();

  await dataGrid.scrollBy(t, { left: -1000 });

  await resetContentReadyFlag();
  await dataGrid.scrollBy(t, { top: 50 });
  await t.expect(isContentReadyFired()).ok();

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
    onContentReady: () => {
      (window as ContentReadyWindow).contentReadyFired = true;
    },
  });
}).after(async (t) => t.eval(() => {
  delete (window as ContentReadyWindow).contentReadyFired;
}));

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
  await dataGrid.scrollTo(t, { top: 100 });
  await dataGrid.scrollTo(t, { top: 200 });
  await dataGrid.scrollTo(t, { top: 300 });
  await dataGrid.scrollTo(t, { top: 400 });

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

  await dataGrid.scrollBy(t, { left: 1000 });
  await dataGrid.scrollBy(t, { left: -1000 });

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
  await dataGrid.scrollTo(t, { left: 1000 });
  await t
    .click(dataGrid.getDataCell(0, 20).element)
    .pressKey('right');

  await t.expect(dataGrid.getDataCell(0, 20).isFocused).ok();

  await dataGrid.scrollBy(t, { left: -1000 });
  await dataGrid.scrollBy(t, { left: 1000 });

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
      .scrollTo(t, { top: 2000 });
    await t.wait(300);
    await dataGrid
      .scrollTo(t, { top: 1000 });
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

    await dataGrid.scrollBy(t, { top: 10000 });

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

test('Remote virtual scrolling should send one request on init when starting on a non-first page with async templates (T1326786)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();
  await t.expect(dataGrid.getScrollTop()).gt(0);
  await t.expect(dataGrid.apiPageIndex()).eql(10);

  const loadOptions = await getTestLoadOptions();

  await t.expect(loadOptions).eql([{ skip: 1000, take: 100 }]);
}).before(async () => {
  await ClientFunction(() => {
    (window as any).testLoadOptions = [];
  })();

  return createWidget('dxDataGrid', () => ({
    height: 1000,
    remoteOperations: true,
    renderAsync: false,
    templatesRenderAsynchronously: true,
    dataSource: new (window as any).DevExpress.data.CustomStore({
      key: 'id',
      load(loadOptions: any) {
        (window as any).testLoadOptions.push({
          skip: loadOptions.skip,
          take: loadOptions.take,
        });

        const skip = loadOptions.skip ?? 0;
        const take = loadOptions.take ?? 20;
        const data: Record<string, unknown>[] = [];

        for (let i = skip; i < skip + take; i += 1) {
          data.push({ id: i, text: `item ${i}` });
        }

        return Promise.resolve({ data, totalCount: 5000 });
      },
    }),
    scrolling: {
      mode: 'virtual',
      useNative: false,
    },
    paging: {
      pageSize: 100,
      pageIndex: 10,
    },
    columns: [
      { dataField: 'id', cellTemplate: 'cell' },
      'text',
    ],
    integrationOptions: {
      templates: {
        cell: {
          render(e: any) {
            setTimeout(() => {
              ($(e.container) as any).text(e.model.value);
              e.onRendered?.();
            });
          },
        },
      },
    },
  }));
}).after(async () => ClientFunction(() => {
  delete (window as any).testLoadOptions;
})());

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
