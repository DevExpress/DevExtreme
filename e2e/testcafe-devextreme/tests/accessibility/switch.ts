import { Properties } from 'devextreme/ui/switch.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [true, false],
  disabled: [true, false],
  readOnly: [true, false],
  name: ['', 'name'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: {
    'color-contrast': { enabled: false },
  },
};

const configuration: Configuration = {
  component: 'dxSwitch',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
