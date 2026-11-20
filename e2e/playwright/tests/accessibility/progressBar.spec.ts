import type { Properties } from 'devextreme/ui/progress_bar';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [undefined, 45],
  min: [0],
  max: [100],
  disabled: [true, false],
  showStatus: [true, false],
  elementAttr: [{ 'aria-label': 'Progress Bar' }],
};

const configuration: Configuration<Properties> = {
  component: 'dxProgressBar',
  options,
};

testAccessibility(configuration);
