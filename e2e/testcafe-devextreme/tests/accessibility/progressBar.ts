import { Properties } from 'devextreme/ui/progress_bar.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [undefined, 45],
  min: [0],
  max: [100],
  disabled: [true, false],
  hint: [undefined, 'hint'],
  showStatus: [true, false],
  elementAttr: [{ 'aria-label': 'Progress Bar' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxProgressBar',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
