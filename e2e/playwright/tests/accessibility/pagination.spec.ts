import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<any> = {
  itemCount: [50],
  displayMode: ['full', 'compact'],
  infoText: [undefined, 'Total {2} items. Page {0} of {1}'],
  showInfo: [true, false],
  showNavigationButtons: [true, false],
  showPageSizeSelector: [true, false],
};

const a11yCheckConfig = {};

const configuration: Configuration = {
  component: 'dxPagination',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
