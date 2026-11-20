import type { Properties } from 'devextreme/ui/speed_dial_action';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  label: ['', 'label'],
  icon: [undefined, 'save'],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxSpeedDialAction',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
