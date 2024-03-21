/* eslint-disable @typescript-eslint/no-floating-promises */
import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import DataGrid, { CLASS } from '../../model/dataGrid';

const showDataGrid = ClientFunction(() => {
  $('#wrapperContainer').css('display', '');
});

fixture.disablePageReloads`Virtual  Columns`
  .page(url(__dirname, '../container.html'));

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

test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the right when columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .expect(dataGrid.getDataCell(0, 0).element.focused)
    .ok();

  await dataGrid.scrollTo(t, { x: 50 });

  await t.expect(dataGrid.getScrollLeft()).eql(50);

  await dataGrid.scrollTo(t, { x: 100 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(100);
}).before(async () => createWidget('dxDataGrid', {
  width: 450,
  dataSource: generateData(10, 30),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the left when columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.scrollTo(t, { x: 1500 });

  await t
    .click(dataGrid.getDataCell(0, 18).element)
    .expect(dataGrid.getDataCell(0, 18).element.focused)
    .ok();

  await dataGrid.scrollTo(t, { x: 1200 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1200);

  await dataGrid.scrollTo(t, { x: 1000 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1000);

  await dataGrid.scrollTo(t, { x: 800 });

  await t
    .wait(200)
    .expect(dataGrid.getScrollLeft())
    .eql(800);
}).before(async () => createWidget('dxDataGrid', {
  width: 450,
  dataSource: generateData(10, 50),
  columnWidth: 100,
  // @ts-expect-error private option
  loadingTimeout: null,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
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

  await t
    .expect(await takeScreenshot('T1090735-grid-virtual-columns.png', '#wrapperContainer'))
    .ok()
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
    await takeScreenshot(`T1176160-master-detail-with-virtual-columns-and-useNative=${useNative}-1.png`, dataGrid.element);

    // act
    await dataGrid.scrollTo(t, { x: 1000 });
    await dataGrid.scrollTo(t, { x: 2000 });

    // assert
    await takeScreenshot(`T1176160-master-detail-with-virtual-columns-and-useNative=${useNative}-2.png`, dataGrid.element);

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

  await t.wait(100);

  // act
  await dataGrid.scrollTo(t, { x: 2000 });
  await t.wait(300);
  await dataGrid.scrollTo(t, { x: 4000 });

  // assert
  await takeScreenshot('T1176161-master-detail-with-virtual-columns-1.png', dataGrid.element);

  // act
  await dataGrid.apiCollapseRow(0);

  // assert
  await takeScreenshot('T1176161-master-detail-with-virtual-columns-2.png', dataGrid.element);

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
