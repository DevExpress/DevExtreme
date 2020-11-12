import DataGrid from '../../model/dataGrid';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import { createScreenshotsComparer, compareScreenshot } from '../../helpers/screenshort-comparer';
import SelectBox from '../../model/selectBox';
import TextBox from '../../model/textBox';

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
  .page(url(__dirname, '../container.html'))
  .beforeEach(createDataGridWithPager)
  .afterEach(() => disposeWidgets());

test('Full size pager', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();
  await t
    .resizeWindow(650, 600)
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
});
test('Compact pager', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pager = dataGrid.getPager();
  await t
    .resizeWindow(350, 600);
  const pageSizeWidget = new SelectBox(pager.element.find('.dx-page-sizes .dx-selectbox') as any);
  const pageIndexWidget = new TextBox(pager.element.find('.dx-page-index.dx-numberbox') as any);
  await t
    .typeText(pageIndexWidget.input, '7', { replace: true })
    .click(pageSizeWidget.dropDownButton)
    .click(pageSizeWidget.dropDownButton)
    .pressKey('down')
    .pressKey('enter')
    .expect(pageSizeWidget.input.value)
    .eql('10')
    .expect(dataGrid.getDataCell(10 * 7 - 1, 2).element.textContent)
    .eql('69')
    .expect(await compareScreenshot(t, 'pager-compact.png'))
    .ok();
});
test('Resize', async (t) => {
  const dataGrid = new DataGrid('#container');
  const pagerElement = dataGrid.getPager().element;
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(650, 600)
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
    .resizeWindow(650, 600)
    .expect(await takeScreenshot('pager-resize-large-enlarge.png', pagerElement))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
