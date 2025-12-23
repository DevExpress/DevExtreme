import { Properties } from 'devextreme/ui/text_box.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [undefined, 'value'],
  placeholder: [undefined, 'placeholder'],
  showClearButton: [true, false],
  mode: ['password', 'email', 'search', 'tel', 'text', 'url'],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['outlined', 'filled', 'underlined'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const availabilityConfiguration: Configuration = {
  component: 'dxTextBox',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration = {
  component: 'dxTextBox',
  a11yCheckConfig,
  options: {
    ...options,
    label: ['', 'label'],
    name: ['', 'name'],
  },
};

testAccessibility(infoConfiguration);

const spellcheckConfiguration: Configuration = {
  component: 'dxTextBox',
  a11yCheckConfig,
  options: {
    ...options,
    spellcheck: [true],
  },
};

testAccessibility(spellcheckConfiguration);
