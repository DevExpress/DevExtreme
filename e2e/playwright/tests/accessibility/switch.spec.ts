import type { Properties } from 'devextreme/ui/switch';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [true, false],
  disabled: [true, false],
  readOnly: [true, false],
  name: ['', 'name'],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxSwitch',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
