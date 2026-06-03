import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import TextBox from 'devextreme-testcafe-models/textBox';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

async function createDataGridWithPager(): Promise<any> {
  const dataSource = Array.from({ length: 100 }, (_, room) => ({ name: 'Alex', phone: '555555', room }));
  return createWidget('dxDataGrid', {
    dataSource,
    columns: ['name', 'phone', 'room'],
    paging: {
      pageSize: 5,
      pageIndex: 5,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
      showInfo: true,
      showNavigationButtons: true,
    },
  });
}
fixture.disablePageReloads`Pager`
  .page(url(__dirname, '../../container.html'));

test('Full size pager', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(900, 600)
    .expect(pager.getPageSize(0).selected)
    .ok('page size 5 selected')
    .expect(pager.getNavPage('6').selected)
    .ok('page 6 selected')
    .expect(pager.getInfoText().textContent)
    .eql('Page 6 of 20 (100 items)')
    .expect(dataGrid.getDataCell(29, 2).element.textContent)
    .eql('29');
  // set page sige to 10
  await t
    .click(pager.getPageSize(1).element)
    .expect(dataGrid.getDataCell(10 * 6 - 1, 2).element.textContent)
    .eql('59');
  // set page index 7
  await t
    .click(pager.getNavPage('7').element)
    .expect(dataGrid.getDataCell(10 * 7 - 1, 2).element.textContent)
    .eql('69')
    .expect(pager.getInfoText().textContent)
    .eql('Page 7 of 10 (100 items)');
  // navigate to prev page (6)
  await t
    .click(pager.getPrevNavButton().element)
    .expect(pager.getInfoText().textContent)
    .eql('Page 6 of 10 (100 items)');
  // navigate to next page (7)
  await t
    .click(pager.getNextNavButton().element)
    .expect(pager.getInfoText().textContent)
    .eql('Page 7 of 10 (100 items)');

  await testScreenshot(t, takeScreenshot, 'pager-full-allpages.png');
  await t
    .expect(compareResults.isValid())
    .ok();
}).before(async () => createDataGridWithPager());

test.meta({ browserSize: [350, 600] })('Compact pager', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();
  const pageSizeWidget = pager.getPageSizeSelectBox();
  const pageIndexWidget = new TextBox(pager.getPageIndexWidget() as any);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .typeText(pageIndexWidget.input, '7', { replace: true })
    .click(pageSizeWidget.dropDownButton)
    .pressKey('down')
    .pressKey('enter')
    .expect(pageSizeWidget.input.value)
    .eql('10')
    .expect(dataGrid.getDataCell(10 * 7 - 1, 2).element.textContent)
    .eql('69');

  await testScreenshot(t, takeScreenshot, 'pager-compact.png');

  await t
    .expect(compareResults.isValid())
    .ok();
}).before(async () => createDataGridWithPager());

test('Resize', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pagerElement = dataGrid.getPager().element;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(700, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-large.png', { element: pagerElement });
  await t
    .resizeWindow(600, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-large-noinfo.png', { element: pagerElement });
  await t
    .resizeWindow(350, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-small.png', { element: pagerElement });
  await t
    .resizeWindow(600, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-large-noinfo-enlarge.png', { element: pagerElement });
  await t
    .resizeWindow(700, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-large-enlarge.png', { element: pagerElement });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createDataGridWithPager());

test('Resize without navigation buttons', async (t) => {
  const dataGrid = new DataGrid('#container');
  await dataGrid.option('pager.showNavigationButtons', false);
  const pagerElement = dataGrid.getPager().element;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(700, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-nobutton-large.png', { element: pagerElement });
  await t
    .resizeWindow(540, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-nobutton-large-noinfo.png', { element: pagerElement });
  await t
    .resizeWindow(350, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-nobutton-small.png', { element: pagerElement });
  await t
    .resizeWindow(540, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-nobutton-large-noinfo-enlarge.png', { element: pagerElement });
  await t
    .resizeWindow(700, 600);
  await testScreenshot(t, takeScreenshot, 'pager-resize-nobutton-large-enlarge.png', { element: pagerElement });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createDataGridWithPager());

// visual: generic.light
// visual: generic.light.compact
// visual: material.blue.light
// visual: material.blue.light.compact
test.meta({ browserSize: [700, 600] })('Compact pager in the generic.light theme (T1057735)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pagerElement = dataGrid.getPager().element;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'compact-pager.png', { element: pagerElement });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{ id: 1, name: 'test' }],
    keyExpr: 'id',
    paging: {
      pageSize: 10,
    },
    pager: {
      visible: true,
      allowedPageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      showInfo: true,
      showNavigationButtons: true,
      displayMode: 'compact',
    },
  });
});

test('Changing pageSize to \'all\' with rowRenderingMode=\'virtual\' should work (T1090331)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  await t
    .expect(dataGrid.option('paging.pageSize'))
    .eql(10);

  await t.click(dataGrid.element()); // don't know why but test isn't reproduces without this click

  await dataGrid.scrollBy(t, { y: 100 });

  await t.click(pager.getPageSizeSelectBox().element);
  await t.click(pager.getPopupPageSizes().withText('All'));

  await t
    .expect(dataGrid.option('paging.pageSize'))
    .eql(0);
})
  .before(async () => createWidget('dxDataGrid', {
    dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
    keyExpr: 'id',
    showBorders: true,
    scrolling: {
      rowRenderingMode: 'virtual',
    },
    paging: {
      pageSize: 10,
    },
    pager: {
      visible: true,
      allowedPageSizes: [5, 10, 'all'],
      showPageSizeSelector: true,
      displayMode: 'compact',
    },
    height: 400,
  }));

test('Page index should not reset when scrolling while the grid is being refreshed (T1196099)', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.option('paging.pageIndex'))
    .eql(2);

  await dataGrid.apiRefresh();
  await dataGrid.scrollBy(t, { y: 20 });

  await t
    .expect(dataGrid.option('paging.pageIndex'))
    .eql(2);
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
  keyExpr: 'id',
  showBorders: true,
  scrolling: {
    mode: 'standard',
    rowRenderingMode: 'virtual',
  },
  paging: { pageIndex: 2 },
  pager: {
    visible: true,
    displayMode: 'compact',
  },
  height: 440,
}));

test('Pager info should show page 1 of 1 after changing pageSize to \'all\' with virtual scrolling (T1327238)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  await t
    .expect(pager.getInfoText().textContent)
    .eql('Page 5 of 10 (100 items)');

  await t
    .click(pager.getPageSize(1).element)
    .expect(pager.getInfoText().textContent)
    .eql('Page 1 of 1 (100 items)');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
  keyExpr: 'id',
  showBorders: true,
  scrolling: {
    mode: 'virtual',
  },
  paging: {
    pageSize: 10,
    pageIndex: 4,
  },
  pager: {
    visible: true,
    allowedPageSizes: [10, 'all'],
    showPageSizeSelector: true,
    showInfo: true,
    showNavigationButtons: true,
  },
  height: 400,
}));

test('Pager info should show page 1 of 1 after changing pageSize to \'all\' and enabling virtual scrolling (T1327238)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  await t
    .expect(pager.getInfoText().textContent)
    .eql('Page 5 of 10 (100 items)');

  await t
    .click(pager.getPageSize(1).element)
    .expect(pager.getInfoText().textContent)
    .eql('Page 1 of 1 (100 items)');
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
  keyExpr: 'id',
  showBorders: true,
  scrolling: {
    mode: 'standard',
  },
  paging: {
    pageSize: 10,
    pageIndex: 4,
  },
  pager: {
    visible: true,
    allowedPageSizes: [10, 'all'],
    showPageSizeSelector: true,
    showInfo: true,
    showNavigationButtons: true,
  },
  height: 400,
  onOptionChanged: (e) => {
    if (e.fullName === 'paging.pageSize') {
      const setVirtual = e.value === 0;
      const targetRenderingMode = setVirtual ? 'virtual' : 'standard';
      const currentRenderingMode = e.component.option('scrolling.mode');
      if (currentRenderingMode !== targetRenderingMode) {
        e.component.beginUpdate();
        e.component.option('scrolling.mode', targetRenderingMode);
        e.component.repaint();
        e.component.endUpdate();
      }
    }
  },
}));

test('No error should occur if dataSource is not defined and pageIndex is promise chained (T1256070)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  onContentReady(e) {
    e.component.pageIndex(1).then(() => {}, () => {});
  },
}));
