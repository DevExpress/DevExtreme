/* eslint-disable @typescript-eslint/no-floating-promises */
import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid, { CLASS } from 'devextreme-testcafe-models/dataGrid';
import type { Column } from 'devextreme/ui/data_grid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { isScrollAtEnd } from '../../helpers/rowDraggingHelpers';

const showDataGrid = ClientFunction(() => {
  $('#wrapperContainer').css('display', '');
});

fixture.disablePageReloads`Virtual Columns.Visual`
  .page(url(__dirname, '../../../container.html'));

const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
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

const generateColumns = (columnCount: number): Column[] => [...new Array(columnCount)]
  .map((_, index) => ({
    dataField: `field${index + 1}`,
  }));

// T1090735
test('The updateDimensions method should render the grid if a container was hidden and columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(Selector('#wrapperContainer').visible)
    .notOk();

  await showDataGrid();

  await t
    .wait(200)
    .expect(Selector('#wrapperContainer').visible)
    .ok();

  await dataGrid.apiUpdateDimensions();

  await testScreenshot(t, takeScreenshot, 'T1090735-grid-virtual-columns.png', { element: '#wrapperContainer' });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.maximizeWindow();

  await ClientFunction(() => {
    $('#container').wrap('<div id=\'wrapperContainer\' style=\'display: none;\'></div>');
  })();

  return createWidget('dxDataGrid', {
    height: 440,
    dataSource: generateData(150, 500),
    columnWidth: 100,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
  });
});

// T1176160
[true, false].forEach((useNative) => {
  test(`The vertical scroll position should not be reset after horizontal scrolling when there are a fixed column and a master detail row (useNative = ${useNative})`, async (t) => {
    // arrange
    const dataGrid = new DataGrid('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.expect(dataGrid.isReady()).ok();

    await dataGrid.apiExpandRow(9);

    // assert
    await t
      .expect(dataGrid.getContainer().find(`.${CLASS.masterDetailRow}`).exists)
      .ok();

    // act
    await dataGrid.scrollTo(t, { y: 5000 });

    // assert
    await testScreenshot(t, takeScreenshot, `T1176160-master-detail-with-virtual-columns-and-useNative=${useNative}-1.png`, { element: dataGrid.element });

    // act
    await dataGrid.scrollTo(t, { x: 1000 });
    await dataGrid.scrollTo(t, { x: 2000 });

    // assert
    await testScreenshot(t, takeScreenshot, `T1176160-master-detail-with-virtual-columns-and-useNative=${useNative}-2.png`, { element: dataGrid.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxDataGrid', {
    dataSource: generateData(10, 50).map((item, index) => ({ ...item, id: index })),
    keyExpr: 'id',
    width: 500,
    height: 500,
    columnWidth: 100,
    scrolling: {
      columnRenderingMode: 'virtual',
      mode: 'virtual',
      useNative,
    },
    columnFixing: {
      // @ts-expect-error private option
      legacyMode: true,
    },
    customizeColumns(columns) {
      columns[0].fixed = true;
    },
    masterDetail: {
      enabled: true,
      template() {
        return ($('<div style=\'height: 300px;\'>') as any).text('details');
      },
    },
  })).after(async () => {
    await ClientFunction(() => {
      const dataGrid = ($('#container') as any).dxDataGrid('instance');

      dataGrid?.dispose();
    })();
  });
});

// T1176161
test('The markup should be correct after horizontal scrolling and collapse of the master detail row', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.isReady()).ok();
  await t.wait(100);

  // act
  await dataGrid.scrollTo(t, { x: 2000 });
  await t.wait(300);
  await dataGrid.scrollTo(t, { x: 4000 });

  // assert
  await testScreenshot(t, takeScreenshot, 'T1176161-master-detail-with-virtual-columns-1.png', { element: dataGrid.element });

  // act
  await dataGrid.apiCollapseRow(0);

  // assert
  await testScreenshot(t, takeScreenshot, 'T1176161-master-detail-with-virtual-columns-2.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: generateData(10, 50).map((item, index) => ({ ...item, id: index })),
  keyExpr: 'id',
  width: 500,
  height: 500,
  columnWidth: 100,
  scrolling: {
    mode: 'virtual',
    columnRenderingMode: 'virtual',
  },
  columnFixing: {
    // @ts-expect-error private option
    legacyMode: true,
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
  },
  masterDetail: {
    enabled: true,
    template() {
      return ($('<div style=\'height: 300px;\'>') as any).text('details');
    },
  },
  onContentReady(e) {
    // @ts-expect-error flag for test
    // eslint-disable-next-line no-underscore-dangle
    if (!e.component.__initExpand) {
      // @ts-expect-error flag for test
      // eslint-disable-next-line no-underscore-dangle
      e.component.__initExpand = true;
      e.component.expandRow(0);
    }
  },
}));

// T1191875
test('Columns should be rendered correctly after reinit of columns controller', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await dataGrid.scrollTo(t, { x: 1000 });
  await t.expect(dataGrid.getScrollLeft()).eql(1000);

  const columns = generateColumns(500);
  columns[0].visible = false;
  await dataGrid.option('columns', columns);
  await t.expect(dataGrid.getScrollLeft()).eql(1000);

  columns[0].visible = true;
  await dataGrid.option('columns', columns);
  await t.expect(dataGrid.getScrollLeft()).eql(1000);

  await testScreenshot(t, takeScreenshot, 'grid-virtual-columns-after-reinit.png');
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  height: 440,
  dataSource: generateData(150, 500),
  columns: generateColumns(500),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('Columns reordering should work with virtual columns', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await dataGrid.scrollTo(t, { x: 100000 });

  await t.drag(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(499).element,
    -110,
    0,
  );

  await testScreenshot(t, takeScreenshot, 'data-grid__virtual-columns__reoder.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  allowColumnReordering: true,
  height: 440,
  dataSource: generateData(150, 500),
  columns: generateColumns(500),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('Grouping should work with virtual columns', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await dataGrid.scrollTo(t, { x: 100000 });

  await t.dragToElement(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(499).element,
    dataGrid.getGroupPanel().element,
  );

  await testScreenshot(t, takeScreenshot, 'data-grid__virtual-columns__grouping.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  height: 440,
  groupPanel: {
    visible: true,
  },
  dataSource: generateData(150, 500),
  columns: generateColumns(500),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('Column chooser should work with virtual columns', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await dataGrid.scrollTo(t, { x: 100000 });

  await t.click(dataGrid.getColumnChooserButton());
  await t.expect(
    dataGrid.getColumnChooser().isOpened,
  ).ok();

  await t.dragToElement(
    dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(499).element,
    dataGrid.getColumnChooser().content,
  );
  await testScreenshot(t, takeScreenshot, 'data-grid__virtual-columns__column-chooser.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  height: 440,
  columnChooser: {
    enabled: true,
  },
  dataSource: generateData(150, 500),
  columns: generateColumns(500),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('Group row should have right colspan with summary, virtual columns and fixed columns (T1221369)', async (t) => {
  const grid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'T1221369_fixed-summary-with-virtual-cols_0.png', { element: grid.element });

  // NOTE: There is an issue with Scrollable
  // So, we should scroll two times to reach maximum right scroll position
  await grid.scrollTo(t, { x: 10000 });
  await grid.scrollTo(t, { x: 10000 });

  await testScreenshot(t, takeScreenshot, 'T1221369_fixed-summary-with-virtual-cols_1.png', { element: grid.element });

  await grid.scrollTo(t, { x: 0 });

  await testScreenshot(t, takeScreenshot, 'T1221369_fixed-summary-with-virtual-cols_2.png', { element: grid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const generatedColumns = generateColumns(20);
  const columns = [
    {
      ...generatedColumns[0],
      groupIndex: 0,
    },
    {
      ...generatedColumns[1],
      fixed: true,
    },
    {
      ...generatedColumns[2],
      fixed: true,
    },
    ...generatedColumns.splice(3),
  ];
  const data = generateData(10, 20);

  await createWidget('dxDataGrid', {
    dataSource: data,
    width: 400,
    height: 400,
    columns,
    columnFixing: {
      enabled: true,
      // @ts-expect-error private option
      legacyMode: true,
    },
    columnMinWidth: 100,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
    summary: {
      groupItems: [{
        column: columns[2].dataField,
        summaryType: 'count',
        alignByColumn: true,
      }],
    },
  });
});

// T1260472
test('Header, fixed columns and virtual scroll bar should have stable position during async render and virtual horizontal scrolling', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.expect(dataGrid.getDataRow(0).element.exists).ok(); // wait for initial render
  await ClientFunction(() => { (window as any).deferred = $.Deferred(); })();
  await dataGrid.scrollTo(t, { x: 2000 });
  await testScreenshot(t, takeScreenshot, 'T1260472-async-render-during-horizontal-scrolling.png', { element: dataGrid.element });
  await ClientFunction(() => {
    (window as any).deferred.resolve();
    (window as any).deferred = undefined;
  })();
  await testScreenshot(t, takeScreenshot, 'T1260472-async-render-after-horizontal-scrolling.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const defaultColumnConfig = {
    headerCellTemplate: 'headerCellTemplate',
    cellTemplate: 'cellTemplate',
  };

  return createWidget('dxDataGrid', {
    dataSource: generateData(3, 50),
    keyExpr: 'field1',
    showBorders: true,
    width: 500,
    columnWidth: 100,
    scrolling: {
      rowRenderingMode: 'virtual',
      columnRenderingMode: 'virtual',
      mode: 'virtual',
      useNative: false,
    },
    columns: Array.from({ length: 20 }).map((_, i) => ({
      ...defaultColumnConfig,
      caption: `Product${i + 1}`,
      fixed: i === 0,
      columns: [
        { ...defaultColumnConfig, dataField: `field${(2 * i) + 1}`, fixed: i === 0 },
        { ...defaultColumnConfig, dataField: `field${(2 * i) + 2}`, fixed: i === 0 },
      ],
    })),
    // @ts-expect-error private option
    templatesRenderAsynchronously: true,
    integrationOptions: {
      templates: {
        headerCellTemplate: {
          render({ model, container, onRendered }) {
            const title = model.column.caption == null ? null : model.column.caption;
            const content = $(`<span title='${title}'>
          ${title}
        </span>`);
            container.append(content);
            if ((window as any).deferred) {
              (window as any).deferred.done(onRendered);
            } else {
              onRendered();
            }
          },
        },
        cellTemplate: {
          render({ model, container, onRendered }) {
            const title = model.value == null ? null : model.value;
            const content = $(`<span title='${title}'>
          ${title}
        </span>`);
            container.append(content);
            if ((window as any).deferred) {
              (window as any).deferred.done(onRendered);
            } else {
              onRendered();
            }
          },
        },
      },
    },
  });
});

test('Virtual columns should render correctly with repaintChangesOnly and grouping after horizontal scrolling (T1319173)', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok()
    .expect(dataGrid.getDataCell(1, 1).element.textContent)
    .eql('0');

  // act
  await dataGrid.scrollTo(t, { x: 10000 });

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 50).element.textContent)
    .eql('1-50')
    .expect(isScrollAtEnd('horizontal'))
    .ok();

  await testScreenshot(t, takeScreenshot, 'T1319173__datagrid__virtual-columns__repaintChangesOnly=true.png', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: generateData(10, 50).map((item, index) => ({ id: index, ...item })),
  keyExpr: 'id',
  height: 400,
  width: 600,
  repaintChangesOnly: true,
  scrolling: {
    columnRenderingMode: 'virtual',
    useNative: false,
  },
  columnWidth: 100,
  customizeColumns(columns) {
    columns[1].groupIndex = 0;
  },
}));
