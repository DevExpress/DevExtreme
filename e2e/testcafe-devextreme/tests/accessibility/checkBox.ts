import { Properties } from 'devextreme/ui/check_box.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [true, false, null],
  enableThreeStateBehavior: [true],
  elementAttr: [{ 'aria-label': 'Checked' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const availabilityConfiguration: Configuration = {
  component: 'dxCheckBox',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration = {
  component: 'dxCheckBox',
  a11yCheckConfig,
  options: {
    ...options,
    name: ['', 'name'],
    text: ['', 'text'],
  },
};

testAccessibility(infoConfiguration);
