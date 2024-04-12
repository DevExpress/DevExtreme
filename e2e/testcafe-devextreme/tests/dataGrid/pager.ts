import { createScreenshotsComparer, compareScreenshot } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import SelectBox from 'devextreme-testcafe-models/selectBox';
import TextBox from 'devextreme-testcafe-models/textBox';
import { changeTheme } from '../../helpers/changeTheme';

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
  .page(url(__dirname, '../container.html'));

safeSizeTest('Full size pager', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();
  await t
    .resizeWindow(750, 600)
    .expect(pager.getPageSize(0).selected)
    .ok('page size 5 selected')
    .expect(pager.getNavPage('6').selected)
    .ok('page 6 selected')
    .expect(pager.infoText.textContent)
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
    .expect(pager.infoText.textContent)
    .eql('Page 7 of 10 (100 items)');
  // navigate to prev page (6)
  await t
    .click(pager.getPrevNavButton().element)
    .expect(pager.infoText.textContent)
    .eql('Page 6 of 10 (100 items)');
  // navigate to next page (7)
  await t
    .click(pager.getNextNavButton().element)
    .expect(pager.infoText.textContent)
    .eql('Page 7 of 10 (100 items)')
    .expect(await compareScreenshot(t, 'pager-full-allpages.png'))
    .ok();
}).before(async () => createDataGridWithPager());

safeSizeTest('Compact pager', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();
  const pageSizeWidget = new SelectBox(pager.getPageSizeSelect() as any);
  const pageIndexWidget = new TextBox(pager.getPageIndexWidget() as any);
  await t
    .typeText(pageIndexWidget.input, '7', { replace: true })
    .click(pageSizeWidget.dropDownButton)
    .pressKey('down')
    .pressKey('enter')
    .expect(pageSizeWidget.input.value)
    .eql('10')
    .expect(dataGrid.getDataCell(10 * 7 - 1, 2).element.textContent)
    .eql('69')
    .expect(await compareScreenshot(t, 'pager-compact.png'))
    .ok();
}, [350, 600]).meta({unstable: true}).before(async () => createDataGridWithPager());

safeSizeTest('Resize', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pagerElement = dataGrid.getPager().element;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-large.png', pagerElement))
    .ok()
    .resizeWindow(600, 600)
    .expect(await takeScreenshot('pager-resize-large-noinfo.png', pagerElement))
    .ok()
    .resizeWindow(350, 600)
    .expect(await takeScreenshot('pager-resize-small.png', pagerElement))
    .ok()
    .resizeWindow(600, 600)
    .expect(await takeScreenshot('pager-resize-large-noinfo-enlarge.png', pagerElement))
    .ok()
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-large-enlarge.png', pagerElement))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createDataGridWithPager());

safeSizeTest('Resize without navigation buttons', async (t) => {
  const dataGrid = new DataGrid('#container');
  await dataGrid.option('pager.showNavigationButtons', false);
  const pagerElement = dataGrid.getPager().element;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large.png', pagerElement))
    .ok()
    .resizeWindow(540, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large-noinfo.png', pagerElement))
    .ok()
    .resizeWindow(350, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-small.png', pagerElement))
    .ok()
    .resizeWindow(540, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large-noinfo-enlarge.png', pagerElement))
    .ok()
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large-enlarge.png', pagerElement))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createDataGridWithPager());

['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  safeSizeTest(`Compact pager in the ${theme} theme (T1057735)`, async (t) => {
    const dataGrid = new DataGrid('#container');
    const pagerElement = dataGrid.getPager().element;
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`compact-pager-in-the-${theme.replace(/\./g, '-')}-theme.png`, pagerElement))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [700, 600])
    .meta({unstable: theme === 'material.blue.light'})  
    .before(async () => {
      await changeTheme(theme);
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
    })
    .after(async () => {
      await changeTheme('generic.light');
    });
});

test('Changing pageSize to \'all\' with rowRenderingMode=\'virtual\' should work (T1090331)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();

  await t
    .expect(dataGrid.option('paging.pageSize'))
    .eql(10);

  await t.click(dataGrid.element()); // don't know why but test isn't reproduces without this click

  await dataGrid.scrollBy({ y: 100 });

  await t.click(pager.getPageSizeSelect());
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
  await dataGrid.scrollBy({ y: 20 });

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
