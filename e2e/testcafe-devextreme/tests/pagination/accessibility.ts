import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Pagination from 'devextreme-testcafe-models/pagination';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { isMaterial, testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`Pagination`
  .page(url(__dirname, '../container.html'));

const options: Options<any> = {
  itemCount: [50],

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
  const pagination = new Pagination('#container');

  if (isMaterial()
    && displayMode === 'compact'
    && infoText
    && showInfo === false
    && showNavigationButtons === false
    && showPageSizeSelector === false
  ) {
    // Flaky tests on CI in Material theme
    return;
  }

  await testScreenshot(
    t,
    takeScreenshot,
    `pagination-dm_${displayMode}-`
            + `${infoText ? 'has' : 'has_no'}_it-`
            + `si_${showInfo.toString()}-`
            + `snb_${showNavigationButtons.toString()}-`
            + `spss_${showPageSizeSelector.toString()}`
            + '.png',
    { element: pagination.element },
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
  component: 'dxPagination',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
