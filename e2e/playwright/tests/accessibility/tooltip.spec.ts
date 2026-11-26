import type { Properties } from 'devextreme/ui/tooltip';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  visible: [true],
  target: ['#container'],
  width: [50],
  height: [25],
  disabled: [true, false],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxTooltip',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
