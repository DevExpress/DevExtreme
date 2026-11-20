import type { Properties } from 'devextreme/ui/load_indicator';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  height: [undefined, 40],
  width: [undefined, 40],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxLoadIndicator',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
