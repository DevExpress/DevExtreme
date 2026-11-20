import type { Properties } from 'devextreme/ui/load_panel';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  visible: [true],
  showIndicator: [true, false],
  showPane: [true, false],
  message: [undefined, 'message'],
  delay: [undefined, 3000],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxLoadPanel',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
