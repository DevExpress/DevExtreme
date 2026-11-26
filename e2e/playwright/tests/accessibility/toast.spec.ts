import type { Properties } from 'devextreme/ui/toast';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  visible: [true],
  message: [undefined, 'message'],
  type: ['custom', 'error', 'info', 'success', 'warning'],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxToast',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
