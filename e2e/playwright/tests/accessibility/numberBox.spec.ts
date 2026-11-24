import type { Properties } from 'devextreme/ui/number_box';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [20.5],
  placeholder: [undefined, 'placeholder'],
  disabled: [true, false],
  readOnly: [true, false],
  showClearButton: [true, false],
  showSpinButtons: [true, false],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxNumberBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
