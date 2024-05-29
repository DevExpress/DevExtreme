import { Properties } from 'devextreme/ui/load_indicator.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  height: [undefined, 40],
  width: [undefined, 40],
  hint: [undefined, 'hint'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxLoadIndicator',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
