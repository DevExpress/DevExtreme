import type { Properties } from 'devextreme/ui/text_box';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [undefined, 'value'],
  placeholder: [undefined, 'placeholder'],
  showClearButton: [true, false],
  mode: ['password', 'email', 'search', 'tel', 'text', 'url'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const availabilityConfiguration: Configuration<Properties> = {
  component: 'dxTextBox',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration<Properties> = {
  component: 'dxTextBox',
  name: 'info',
  a11yCheckConfig,
  options: {
    ...options,
    label: ['', 'label'],
    name: ['', 'name'],
  },
};

testAccessibility(infoConfiguration);

const spellcheckConfiguration: Configuration<Properties> = {
  component: 'dxTextBox',
  name: 'spellcheck',
  a11yCheckConfig,
  options: {
    ...options,
    spellcheck: [true],
  },
};

testAccessibility(spellcheckConfiguration);
