import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Pager from 'devextreme-testcafe-models/pager';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Pager`
  .page(url(__dirname, '../container.html'));

const options: Options<any> = {

  pageIndex: [2, 5, 30],
  displayMode: ['full', 'compact'],
  infoText: [undefined, 'Total {2} items. Page {0} of {1}'],
  pageSizes: [[1, 2, 3], [3, 6, 9]],
  showInfo: [true, false],
  showNavigationButtons: [true, false],
  showPageSizeSelector: [true, false],
  visible: [true],
};

const defaultCreated = async (): Promise<void> => {};
const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const {
    visible,
    displayMode,
    infoText,
    pageCount,
    pageSizes,
    showInfo,
    showNavigationButtons,
    showPageSizeSelector,
  } = optionConfiguration;

  if (!visible) {
    return;
  }

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pager = new Pager('#container');
  await t
    .expect(await takeScreenshot(`pager-dm_${displayMode}-`
            + `${infoText ? 'has' : 'has_no'}_it-`
            + `pc_${pageCount}-`
            + `ps_${pageSizes[0]}_${pageSizes[1]}_${pageSizes[2]}-`
            + `si_${showInfo.toString()}-`
            + `snb_${showNavigationButtons.toString()}-`
            + `spss_${showPageSizeSelector.toString()}`
            + '.png', pager.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxPager',
  a11yCheckConfig,
  options,
  created: defaultCreated || created, // Waiting pager specification
};

testAccessibility(configuration);
