import { createScreenshotsComparer, compareScreenshot } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import Pager from '../../model/dataGrid/pager';
import SelectBox from '../../model/selectBox';
import TextBox from '../../model/textBox';
import { PagerProps } from '../../../../js/renovation/ui/pager/common/pager_props';
import { multiPlatformTest, updateComponentOptions } from '../../helpers/multi-platform-test';

const defaultProps: Partial<PagerProps> = {
  totalCount: 100,
  gridCompatibility: false,
  showPageSizes: true,
  pageSizes: [5, 10, 20],
  pageSize: 5,
  pageCount: 20,
  pageIndex: 5,
  showInfo: true,
  showNavigationButtons: true,
};

const test = multiPlatformTest({
  page: 'declaration/pager',
  platforms: ['jquery', 'react'],
});

const PAGER_SELECTOR = '#container';

fixture('Renovated pager');

test('Full size pager', async (t, { screenshotComparerOptions }) => {
  const pagerElement = Selector(PAGER_SELECTOR);
  const pager = new Pager(pagerElement);
  await t
    .resizeWindow(750, 600)
    .expect(pager.getPageSize(0).selected)
    .ok('page size 5 selected')
    .expect(pager.getNavPage('6').selected)
    .ok('page 6 selected')
    .expect(pager.infoText.textContent)
    .eql('Page 6 of 20 (100 items)');
  // set page sige to 10
  await t
    .click(pager.getPageSize(1).element);
  // set page index 7
  await t
    .click(pager.getNavPage('7').element)
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
    .expect(await compareScreenshot(t, 'pager-full-allpages.png', pagerElement, screenshotComparerOptions))
    .ok();
}).before(async (_, { platform }) => updateComponentOptions(platform, defaultProps));

test('Compact pager', async (t, { screenshotComparerOptions }) => {
  const pagerElement = Selector(PAGER_SELECTOR);
  const pager = new Pager(pagerElement);
  await t
    .resizeWindow(350, 600);
  const pageSizeWidget = new SelectBox(pager.element.find('.dx-page-sizes .dx-selectbox') as any);
  const pageIndexWidget = new TextBox(pager.element.find('.dx-page-index.dx-numberbox') as any);
  await t
    .typeText(pageIndexWidget.input, '7', { replace: true })
    .click(pageSizeWidget.dropDownButton)
    .pressKey('down')
    .pressKey('enter')
    .expect(pageSizeWidget.input.value)
    .eql('10')
    .expect(await compareScreenshot(t, 'pager-compact.png', pagerElement, screenshotComparerOptions))
    .ok();
}).before(async (_, { platform }) => updateComponentOptions(platform, defaultProps));

test('Resize', async (t, { screenshotComparerOptions }) => {
  const pagerElement = Selector(PAGER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-large.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(600, 600)
    .expect(await takeScreenshot('pager-resize-large-noinfo.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(350, 600)
    .expect(await takeScreenshot('pager-resize-small.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(600, 600)
    .expect(await takeScreenshot('pager-resize-large-noinfo-enlarge.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-large-enlarge.png', pagerElement, screenshotComparerOptions))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => updateComponentOptions(platform, defaultProps));

test('Resize without navigation buttons', async (t, { screenshotComparerOptions }) => {
  const pagerElement = Selector(PAGER_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await t
    // hide navigation button
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(540, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large-noinfo.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(350, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-small.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(540, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large-noinfo-enlarge.png', pagerElement, screenshotComparerOptions))
    .ok()
    .resizeWindow(700, 600)
    .expect(await takeScreenshot('pager-resize-nobutton-large-enlarge.png', pagerElement, screenshotComparerOptions))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (_, { platform }) => updateComponentOptions(platform, {
  ...defaultProps, showNavigationButtons: false,
}));
