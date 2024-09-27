import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Pager from 'devextreme-testcafe-models/pager';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`Pager`
  .page(url(__dirname, '../container.html'));

const options: Options<any> = {
  totalCount: [50],

  displayMode: ['full', 'compact'],
  infoText: [undefined, 'Total {2} items. Page {0} of {1}'],
  showInfo: [true, false],
  showNavigationButtons: [true, false],
  showPageSizeSelector: [true, false],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const {
    displayMode,
    infoText,
    showInfo,
    showNavigationButtons,
    showPageSizeSelector,
  } = optionConfiguration;

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pager = new Pager('#container');

  await testScreenshot(
    t,
    takeScreenshot,
    `pager-dm_${displayMode}-`
            + `${infoText ? 'has' : 'has_no'}_it-`
            + `si_${showInfo.toString()}-`
            + `snb_${showNavigationButtons.toString()}-`
            + `spss_${showPageSizeSelector.toString()}`
            + '.png',
    { element: pager.element },
  );
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

const a11yCheckConfig = {
  // NOTE:  color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxPager',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
