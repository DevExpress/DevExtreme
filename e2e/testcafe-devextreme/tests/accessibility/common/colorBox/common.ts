import { Properties } from 'devextreme/ui/color_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const commonOptions: Options<Properties> = {
  value: [undefined, '#f05b41'],
  disabled: [true, false],
  readOnly: [true, false],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const options: Options<Properties> = {
  ...commonOptions,
  opened: [true, false],
  deferRendering: [true],
};

const noDeferredOptions: Options<Properties> = {
  ...commonOptions,
  opened: [false],
  deferRendering: [false],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const configuration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options,
};
const noDeferredConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: noDeferredOptions,
};

testAccessibility(configuration);
testAccessibility(noDeferredConfiguration);
