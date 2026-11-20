import type { Properties } from 'devextreme/ui/check_box';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [true, false, null],
  enableThreeStateBehavior: [true],
  elementAttr: [{ 'aria-label': 'Checked' }],
};

const a11yCheckConfig = {};

const availabilityConfiguration: Configuration<Properties> = {
  component: 'dxCheckBox',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration<Properties> = {
  component: 'dxCheckBox',
  name: 'info',
  a11yCheckConfig,
  options: {
    ...options,
    name: ['', 'name'],
    text: ['', 'text'],
  },
};

testAccessibility(infoConfiguration);
