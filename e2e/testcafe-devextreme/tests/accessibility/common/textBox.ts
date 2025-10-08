import { Properties } from 'devextreme/ui/text_box.d';
import url from '../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const options: Options<Properties> = {
  value: [undefined, 'value'],
  placeholder: [undefined, 'placeholder'],
  disabled: [true, false],
  readOnly: [true, false],
  // showClearButton: [true, false],
  // mode: [undefined, 'password', 'email', 'search', 'tel', 'text', 'url'],
  label: ['', 'label'],
  name: ['', 'name'],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['outlined', 'filled', 'underlined'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const inputConfiguration: Configuration = {
  component: 'dxTextBox',
  a11yCheckConfig,
  options: {
    ...options,
    showClearButton: [true, false],
  },
};

testAccessibility(inputConfiguration);

const modeConfiguration: Configuration = {
  component: 'dxTextBox',
  a11yCheckConfig,
  options: {
    ...options,
    mode: [undefined, 'password', 'email', 'search', 'tel', 'text', 'url'],
  },
};

testAccessibility(modeConfiguration);
