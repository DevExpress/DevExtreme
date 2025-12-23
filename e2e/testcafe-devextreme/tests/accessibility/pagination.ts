import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

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

const a11yCheckConfig = {
  // NOTE:  color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxPagination',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
